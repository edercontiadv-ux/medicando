import type { Timestamp } from "firebase/firestore"

export interface Paciente {
  id: string
  nome: string
  createdAt: Timestamp | null
}

export interface Registro {
  id: string
  medicamento: string
  dosagem: string
  observacao: string
  createdAt: Timestamp | null
}

export function formatDate(t: Timestamp | null | undefined): string {
  if (!t) return ""
  return t.toDate().toLocaleDateString("pt-BR")
}
