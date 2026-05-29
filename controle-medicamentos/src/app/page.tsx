"use client"

import { useState } from "react"
import { Plus, Pill } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { usePacientes } from "@/hooks/usePacientes"
import { criarPaciente } from "@/services/pacientes"
import Link from "next/link"

export default function Home() {
  const { pacientes, loading, refetch } = usePacientes()
  const [nome, setNome] = useState("")
  const [open, setOpen] = useState(false)

  async function handleCriar() {
    if (!nome.trim()) return
    await criarPaciente(nome.trim())
    setNome("")
    setOpen(false)
    refetch()
  }

  return (
    <main className="min-h-screen max-w-sm mx-auto px-4 pb-24 pt-6">
      <h1 className="text-xl font-bold text-slate-900 mb-6">Pacientes</h1>

      {loading ? (
        <p className="text-slate-500 text-center py-8">Carregando...</p>
      ) : pacientes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Pill className="w-12 h-12 mb-4" />
          <p className="text-center">Nenhum paciente cadastrado</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {pacientes.map((p) => (
            <Link
              key={p.id}
              href={`/pacientes/${p.id}`}
              className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm active:bg-slate-50 transition-colors min-h-[48px]"
            >
              <span className="font-medium text-slate-900">{p.nome}</span>
            </Link>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm min-h-[48px] rounded-xl gap-2 shadow-lg bg-primary text-primary-foreground font-medium inline-flex items-center justify-center hover:bg-primary/90 transition-colors">
          <Plus className="w-5 h-5" />
          Novo Paciente
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Paciente</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleCriar()
            }}
            className="flex flex-col gap-4"
          >
            <Input
              placeholder="Nome do paciente"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="text-base"
              autoFocus
            />
            <Button type="submit" className="min-h-[48px]">
              Cadastrar
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}
