"use client"

import { useState, useEffect, useCallback } from "react"
import type { Paciente } from "@/types"
import { listarPacientes } from "@/services/pacientes"

export function usePacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [loading, setLoading] = useState(true)

  const carregar = useCallback(async () => {
    setLoading(true)
    try {
      const data = await listarPacientes()
      setPacientes(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  return { pacientes, loading, refetch: carregar }
}
