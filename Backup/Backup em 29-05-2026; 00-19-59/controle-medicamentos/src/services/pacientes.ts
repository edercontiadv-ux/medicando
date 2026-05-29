import {
  collection,
  addDoc,
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
import { formatDate } from "@/types"

const pacientesRef = collection(db, "pacientes")

export async function criarPaciente(nome: string): Promise<string> {
  const docRef = await addDoc(pacientesRef, {
    nome,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

export async function listarPacientes(): Promise<Paciente[]> {
  const q = query(pacientesRef, orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Paciente))
}

export async function getPaciente(id: string): Promise<Paciente | null> {
  const snap = await getDoc(doc(db, "pacientes", id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Paciente
}

export async function removerPaciente(id: string): Promise<void> {
  await deleteDoc(doc(db, "pacientes", id))
}

export async function criarRegistro(
  pacienteId: string,
  data: Omit<Registro, "id" | "createdAt">
): Promise<string> {
  const registrosRef = collection(db, "pacientes", pacienteId, "registros")
  const docRef = await addDoc(registrosRef, {
    ...data,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

export async function listarRegistros(pacienteId: string): Promise<Registro[]> {
  const registrosRef = collection(db, "pacientes", pacienteId, "registros")
  const q = query(registrosRef, orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Registro))
}
