import { initializeApp, getApps } from "firebase/app"
import { initializeFirestore, persistentLocalCache } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

function getDb() {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    return null
  }
  const existing = getApps()
  const app = existing.length === 0 ? initializeApp(firebaseConfig) : existing[0]
  if (typeof window !== "undefined") {
    return initializeFirestore(app, {
      localCache: persistentLocalCache(),
    })
  } else {
    return initializeFirestore(app, {})
  }
}

export const db = getDb()
