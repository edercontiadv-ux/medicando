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
    <main className="min-h-screen max-w-sm mx-auto px-4 pb-28 pt-8">
      <header className="mb-7 animate-fade-in">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[#0d5555]">
          Medicando
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {pacientes.length} paciente{pacientes.length !== 1 ? "s" : ""}
        </p>
      </header>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[68px] rounded-xl bg-gradient-to-r from-[#e8e4df] via-[#f5f2ed] to-[#e8e4df] bg-[length:200%_100%] animate-fade-in"
              style={{
                animation: "shimmer 1.5s ease-in-out infinite",
                background: "linear-gradient(90deg, #e8e4df 25%, #f5f2ed 50%, #e8e4df 75%)",
                backgroundSize: "200% 100%",
              }}
            />
          ))}
        </div>
      ) : pacientes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[#0d5555]/5 flex items-center justify-center mb-5">
            <Pill className="w-7 h-7 text-[#0d5555]/40" />
          </div>
          <p className="text-muted-foreground text-center text-sm leading-relaxed">
            Nenhum paciente cadastrado
          </p>
          <p className="text-muted-foreground/60 text-xs mt-1">
            Toque no botão abaixo para começar
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {pacientes.map((p, i) => (
            <Link
              key={p.id}
              href={`/pacientes/${p.id}`}
              className={`animate-fade-in-up stagger-${Math.min(i + 1, 8)}`}
            >
              <div
                className="group relative rounded-xl bg-white p-4 pl-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]"
                style={{
                  boxShadow: "0 1px 3px rgba(13,85,85,0.06), 0 1px 2px rgba(13,85,85,0.04)",
                }}
              >
                <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-[#0d5555]/20 group-hover:bg-[#0d5555]/40 transition-colors" />
                <span className="font-[family-name:var(--font-display)] text-lg font-medium text-[#1a1a18]">
                  {p.nome}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm min-h-[52px] rounded-xl gap-2.5 shadow-lg bg-[#0d5555] text-[#faf8f5] font-medium inline-flex items-center justify-center hover:bg-[#0a4545] active:scale-[0.98] transition-all duration-200 text-sm">
          <Plus className="w-5 h-5" />
          Novo Paciente
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-[family-name:var(--font-display)] text-xl">
              Novo Paciente
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleCriar()
            }}
            className="flex flex-col gap-4 pt-1"
          >
            <Input
              placeholder="Nome do paciente"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="text-base"
              autoFocus
            />
            <Button type="submit" className="min-h-[48px] text-sm">
              Cadastrar
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}
