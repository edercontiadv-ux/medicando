const admin = require("firebase-admin")
const path = require("path")

const serviceAccount = path.resolve(__dirname, "..", "medicando-f232d-firebase-adminsdk-fbsvc-4345d3a3da.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const projectManagement = admin.projectManagement()

async function main() {
  console.log("Buscando apps web no projeto...\n")

  let apps
  try {
    apps = await projectManagement.listWebApps()
  } catch {
    console.log("Método listWebApps não disponível. Tentando via REST API...")
    await fetchViaRest()
    return
  }

  if (apps.length === 0) {
    console.log("Nenhum Web App encontrado. É preciso criar um app Web no Console Firebase.")
    return
  }

  for (const app of apps) {
    const config = await app.getConfig()
    console.log(`App: ${app.displayName} (${app.appId})`)
    console.log(`NEXT_PUBLIC_FIREBASE_API_KEY=${config.apiKey}`)
    console.log(`NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${config.authDomain || `${config.projectId}.firebaseapp.com`}`)
    console.log(`NEXT_PUBLIC_FIREBASE_PROJECT_ID=${config.projectId}`)
    console.log(`NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${config.storageBucket || `${config.projectId}.appspot.com`}`)
    console.log(`NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${config.messagingSenderId}`)
    console.log(`NEXT_PUBLIC_FIREBASE_APP_ID=${app.appId}`)
    console.log()
  }
}

async function fetchViaRest() {
  const { GoogleAuth } = require("google-auth-library")
  const auth = new GoogleAuth({
    keyFilename: serviceAccount,
    scopes: ["https://www.googleapis.com/auth/firebase"],
  })
  const client = await auth.getClient()
  const token = await client.getAccessToken()

  const res = await fetch(
    "https://firebase.googleapis.com/v1beta1/projects/medicando-f232d/webApps",
    { headers: { Authorization: `Bearer ${token.token}` } }
  )
  const data = await res.json()

  if (!data.apps || data.apps.length === 0) {
    console.log("Nenhum Web App encontrado.")
    return
  }

  for (const app of data.apps) {
    const appId = app.name.split("/").pop()
    const configRes = await fetch(
      `https://firebase.googleapis.com/v1beta1/projects/medicando-f232d/webApps/${appId}/config`,
      { headers: { Authorization: `Bearer ${token.token}` } }
    )
    const config = await configRes.json()

    console.log(`App: ${app.displayName} (${appId})`)
    console.log(`NEXT_PUBLIC_FIREBASE_API_KEY=${config.apiKey}`)
    console.log(`NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${config.authDomain}`)
    console.log(`NEXT_PUBLIC_FIREBASE_PROJECT_ID=${config.projectId}`)
    console.log(`NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${config.storageBucket}`)
    console.log(`NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${config.messagingSenderId}`)
    console.log(`NEXT_PUBLIC_FIREBASE_APP_ID=${appId}`)
    console.log()
  }
}

main().catch(console.error)
