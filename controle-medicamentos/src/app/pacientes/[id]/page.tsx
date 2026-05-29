"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, FileText, Pill } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getPaciente, criarRegistro, listarRegistros } from "@/services/pacientes"
import { exportarPDF } from "@/utils/exportPdf"
import type { Paciente, Registro } from "@/types"
import { formatDate } from "@/types"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function PacientePage({ params }: PageProps) {
  const resolvedParams = use(params)
  const id = resolvedParams.id
  const router = useRouter()
  const [paciente, setPaciente] = useState<Paciente | null>(null)
  const [registros, setRegistros] = useState<Registro[]>([])
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [medicamento, setMedicamento] = useState("")
  const [dosagem, setDosagem] = useState("")
  const [observacao, setObservacao] = useState("")
  const [erro, setErro] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setErro("")
    Promise.all([
      getPaciente(id).then(setPaciente),
      listarRegistros(id).then(setRegistros),
    ]).catch(() => {
      setErro("Erro ao carregar dados. Firebase não configurado.")
    }).finally(() => {
      setLoading(false)
    })
  }, [id])

  async function handleRegistrar() {
    if (!medicamento.trim() || submitting) return
    setSubmitting(true)
    setErro("")
    try {
      await criarRegistro(id, {
        medicamento: medicamento.trim(),
        dosagem: dosagem.trim(),
        observacao: observacao.trim(),
      })
      setMedicamento("")
      setDosagem("")
      setObservacao("")
      setOpen(false)
      setRegistros(await listarRegistros(id))
    } catch {
      setErro("Erro ao registrar medicamento. Verifique a conexão.")
    } finally {
      setSubmitting(false)
    }
  }

  function handleExportPDF() {
    exportarPDF(
      paciente?.nome ?? "Paciente",
      registros.map((r) => ({
        data: formatDate(r.createdAt),
        medicamento: r.medicamento,
        dosagem: r.dosagem,
        observacao: r.observacao,
      }))
    )
  }

  if (loading) return (
    <main className="min-h-screen max-w-sm mx-auto px-4 pt-8">
      <div className="animate-fade-in space-y-3">
        <div className="h-10 w-24 rounded-lg bg-gradient-to-r from-[#e8e4df] via-[#f5f2ed] to-[#e8e4df] bg-[length:200%_100%]" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[72px] rounded-xl bg-gradient-to-r from-[#e8e4df] via-[#f5f2ed] to-[#e8e4df] bg-[length:200%_100%]" />
        ))}
      </div>
    </main>
  )

  if (erro) return (
    <main className="min-h-screen max-w-sm mx-auto px-4 pt-8">
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <p className="text-red-600 text-center text-sm bg-red-50 rounded-xl px-4 py-3">{erro}</p>
      </div>
    </main>
  )

  if (!paciente) return (
    <main className="min-h-screen max-w-sm mx-auto px-4 pt-8">
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <p className="text-muted-foreground text-center text-sm">Paciente não encontrado.</p>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen max-w-sm mx-auto px-4 pb-28 pt-8">
      <div className="flex items-center gap-2 mb-7 animate-fade-in">
        <button
          onClick={() => router.back()}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-black/5 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-[#1a1a18]" />
        </button>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[#1a1a18] flex-1">
          {paciente.nome}
        </h1>
        <button
          onClick={handleExportPDF}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-black/5 active:scale-95 transition-all"
          title="Exportar PDF"
        >
          <FileText className="w-5 h-5 text-[#0d5555]" />
        </button>
      </div>

      {registros.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[#d4826a]/10 flex items-center justify-center mb-5">
            <Pill className="w-7 h-7 text-[#d4826a]/40" />
          </div>
          <p className="text-muted-foreground text-center text-sm leading-relaxed">
            Nenhum registro de medicação
          </p>
          <p className="text-muted-foreground/60 text-xs mt-1">
            Registre o primeiro medicamento
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {registros.map((r, i) => (
            <div
              key={r.id}
              className={`animate-fade-in-up stagger-${Math.min(i + 1, 8)}`}
            >
              <Card
                className="border border-[#e8e4df] bg-white shadow-sm transition-all duration-200 hover:shadow-md"
                style={{
                  boxShadow: "0 1px 3px rgba(13,85,85,0.06), 0 1px 2px rgba(13,85,85,0.04)",
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-[#0d5555]/30 shrink-0" />
                        <strong className="font-[family-name:var(--font-display)] font-semibold text-[#1a1a18] text-base truncate">
                          {r.medicamento}
                        </strong>
                      </div>
                      {r.dosagem && (
                        <p className="text-sm text-muted-foreground ml-4">
                          {r.dosagem}
                        </p>
                      )}
                      {r.observacao && (
                        <p className="text-sm text-muted-foreground/70 ml-4 mt-0.5 italic">
                          {r.observacao}
                        </p>
                      )}
                    </div>
                    <time className="text-xs text-muted-foreground/60 shrink-0 mt-1 font-medium">
                      {formatDate(r.createdAt)}
                    </time>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm min-h-[52px] rounded-xl gap-2.5 shadow-lg bg-[#0d5555] text-[#faf8f5] font-medium inline-flex items-center justify-center hover:bg-[#0a4545] active:scale-[0.98] transition-all duration-200 text-sm">
          <Plus className="w-5 h-5" />
          Registrar Medicamento
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-[family-name:var(--font-display)] text-xl">
              Registrar Medicamento
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleRegistrar()
            }}
            className="flex flex-col gap-4 pt-1"
          >
            <Input
              placeholder="Medicamento"
              value={medicamento}
              onChange={(e) => setMedicamento(e.target.value)}
              className="text-base"
              autoFocus
            />
            <Input
              placeholder="Dosagem (ex: 500mg)"
              value={dosagem}
              onChange={(e) => setDosagem(e.target.value)}
              className="text-base"
              inputMode="text"
            />
            <Input
              placeholder="Observação"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="text-base"
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
    </main>
  )
}
