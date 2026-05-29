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

function formatTimestamp(t: any, options: Intl.DateTimeFormatOptions): string {
  if (!t) return ""
  try {
    if (typeof t.toDate === "function") return t.toDate().toLocaleDateString("pt-BR", options)
    if (t instanceof Date) return t.toLocaleDateString("pt-BR", options)
    if (typeof t === "string" || typeof t === "number") return new Date(t).toLocaleDateString("pt-BR", options)
  } catch (e) {
    console.error("Erro ao formatar data:", e)
  }
  return ""
}

export function formatDate(t: any): string {
  return formatTimestamp(t, { dateStyle: "short" })
}

export function formatDateTime(t: any): string {
  return formatTimestamp(t, {
    dateStyle: "short",
    timeStyle: "short",
  })
}
