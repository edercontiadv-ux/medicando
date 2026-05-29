"use client"

import { useState } from "react"
import { Plus, Pill, Pencil, Trash2 } from "lucide-react"
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
import { criarPaciente, removerPaciente, atualizarPaciente } from "@/services/pacientes"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Paciente } from "@/types"

export default function Home() {
  const router = useRouter()
  const { pacientes, loading, refetch } = usePacientes()
  const [nome, setNome] = useState("")
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [erro, setErro] = useState("")
  const [editando, setEditando] = useState<Paciente | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  async function handleCriar() {
    if (!nome.trim() || submitting) return
    setSubmitting(true)
    setErro("")
    try {
      const id = await criarPaciente(nome.trim())
      setNome("")
      setOpen(false)
      router.push(`/pacientes/${id}`)
    } catch (e) {
      setErro("Erro ao cadastrar paciente. Verifique a conexão com o Firebase.")
    } finally {
      setSubmitting(false)
    }
  }

  function handleEditar(p: Paciente) {
    setEditando(p)
    setNome(p.nome)
    setEditOpen(true)
  }

  async function handleSalvarEdicao() {
    if (!editando || !nome.trim() || submitting) return
    setSubmitting(true)
    setErro("")
    try {
      await atualizarPaciente(editando.id, nome.trim())
      setEditando(null)
      setNome("")
      setEditOpen(false)
      refetch()
    } catch {
      setErro("Erro ao editar paciente.")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleExcluir(id: string) {
    if (!confirm("Excluir este paciente e todos os seus registros?")) return
    try {
      await removerPaciente(id)
      refetch()
    } catch {
      setErro("Erro ao excluir paciente.")
    }
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
            <div
              key={p.id}
              className={`animate-fade-in-up stagger-${Math.min(i + 1, 8)} group`}
            >
              <div
                className="relative rounded-xl bg-white shadow-sm transition-all duration-200 hover:shadow-md"
                style={{
                  boxShadow: "0 1px 3px rgba(13,85,85,0.06), 0 1px 2px rgba(13,85,85,0.04)",
                }}
              >
                <Link
                  href={`/pacientes/${p.id}`}
                  className="flex items-center p-4 pl-5 pr-20 hover:-translate-y-0.5 active:scale-[0.99] transition-all block"
                >
                  <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-[#0d5555]/20 group-hover:bg-[#0d5555]/40 transition-colors" />
                  <span className="font-[family-name:var(--font-display)] text-lg font-medium text-[#1a1a18] flex-1">
                    {p.nome}
                  </span>
                </Link>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditar(p)}
                    className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg hover:bg-black/5 active:scale-95 transition-all"
                    title="Editar"
                  >
                    <Pencil className="w-3.5 h-3.5 text-muted-foreground/60" />
                  </button>
                  <button
                    onClick={() => handleExcluir(p.id)}
                    className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg hover:bg-red-50 active:scale-95 transition-all"
                    title="Excluir"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-[family-name:var(--font-display)] text-xl">
              Editar Paciente
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSalvarEdicao()
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
            {erro && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{erro}</p>
            )}
            <Button type="submit" className="min-h-[48px] text-sm" disabled={submitting}>
              {submitting ? "Salvando..." : "Salvar"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

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
            {erro && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{erro}</p>
            )}
            <Button type="submit" className="min-h-[48px] text-sm" disabled={submitting}>
              {submitting ? "Salvando..." : "Cadastrar"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}
