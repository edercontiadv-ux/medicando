import {
  collection,
  addDoc,
  setDoc,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Paciente, Registro } from "@/types"


function getDatabase() {
  if (!db) {
    throw new Error(
      "Firebase não configurado. Adicione as variáveis de ambiente NEXT_PUBLIC_FIREBASE_* no Vercel (Settings → Environment Variables)."
    )
  }
  return db
}

export async function criarPaciente(nome: string): Promise<string> {
  const firestore = getDatabase()
  const pacientesRef = collection(firestore, "pacientes")
  const docRef = doc(pacientesRef)
  const id = docRef.id

  await setDoc(docRef, {
    nome,
    createdAt: serverTimestamp(),
  })

  return id
}

export async function listarPacientes(): Promise<Paciente[]> {
  try {
    const firestore = getDatabase()
    const pacientesRef = collection(firestore, "pacientes")
    const q = query(pacientesRef, orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Paciente))
  } catch (e) {
    console.error("Erro ao listar pacientes:", e)
    return []
  }
}

export async function getPaciente(id: string): Promise<Paciente | null> {
  try {
    const firestore = getDatabase()
    const snap = await getDoc(doc(firestore, "pacientes", id))
    if (!snap.exists()) return null
    return { id: snap.id, ...snap.data() } as Paciente
  } catch (e) {
    console.error("Erro ao buscar paciente:", e)
    return null
  }
}

export async function removerPaciente(id: string): Promise<void> {
  try {
    const firestore = getDatabase()
    const registrosRef = collection(firestore, "pacientes", id, "registros")
    const snapshot = await getDocs(registrosRef)
    const deleteRegistros = snapshot.docs.map(d =>
      deleteDoc(doc(firestore, "pacientes", id, "registros", d.id))
    )
    await Promise.all(deleteRegistros)
    await deleteDoc(doc(firestore, "pacientes", id))
  } catch (e) {
    console.error("Erro ao remover paciente:", e)
  }
}

export async function criarRegistro(
  pacienteId: string,
  data: Omit<Registro, "id" | "createdAt">
): Promise<string> {
  const firestore = getDatabase()
  const registrosRef = collection(firestore, "pacientes", pacienteId, "registros")
  const docRef = doc(registrosRef)
  const id = docRef.id

  await setDoc(docRef, {
    ...data,
    createdAt: serverTimestamp(),
  })

  return id
}

export async function listarRegistros(pacienteId: string): Promise<Registro[]> {
  try {
    const firestore = getDatabase()
    const registrosRef = collection(firestore, "pacientes", pacienteId, "registros")
    const q = query(registrosRef, orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Registro))
  } catch (e) {
    console.error("Erro ao listar registros:", e)
    return []
  }
}
