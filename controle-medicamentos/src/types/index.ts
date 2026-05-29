import type { Timestamp } from "firebase/firestore"

export interface Paciente {
  id: string
  nome: string
  createdAt: Timestamp | null
}

export interface MedicamentoPreset {
  id: string
  medicamento: string
  dosagem: string
}

export interface Registro {
  id: string
  medicamento: string
  dosagem: string
  observacao: string
  createdAt: Timestamp | null
}

function toDate(t: any): Date | null {
  if (!t) return null
  try {
    if (typeof t.toDate === "function") return t.toDate()
    if (t instanceof Date) return t
    if (typeof t === "string" || typeof t === "number") return new Date(t)
  } catch (e) {
    console.error("Erro ao converter data:", e)
  }
  return null
}

export function formatDate(t: any): string {
  const d = toDate(t)
  if (!d) return ""
  return d.toLocaleDateString("pt-BR")
}

export function formatDateTime(t: any): string {
  const d = toDate(t)
  if (!d) return ""
  return d.toLocaleString("pt-BR")
}
