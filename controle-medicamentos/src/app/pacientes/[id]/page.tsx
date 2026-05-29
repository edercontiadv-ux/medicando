"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Plus, FileText } from "lucide-react"
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

export default function PacientePage() {
  const params = useParams()
  const router = useRouter()
  const [paciente, setPaciente] = useState<Paciente | null>(null)
  const [registros, setRegistros] = useState<Registro[]>([])
  const [open, setOpen] = useState(false)
  const [medicamento, setMedicamento] = useState("")
  const [dosagem, setDosagem] = useState("")
  const [observacao, setObservacao] = useState("")

  const id = params.id as string

  useEffect(() => {
    if (!id) return
    getPaciente(id).then(setPaciente)
    listarRegistros(id).then(setRegistros)
  }, [id])

  async function handleRegistrar() {
    if (!medicamento.trim()) return
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

  if (!paciente) return <p className="text-center py-8 text-slate-500">Carregando...</p>

  return (
    <main className="min-h-screen max-w-sm mx-auto px-4 pb-24 pt-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="min-h-[48px] min-w-[48px] flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h1 className="text-xl font-bold text-slate-900 flex-1">
          {paciente.nome}
        </h1>
        <button
          onClick={handleExportPDF}
          className="min-h-[48px] min-w-[48px] flex items-center justify-center"
        >
          <FileText className="w-5 h-5 text-slate-700" />
        </button>
      </div>

      {registros.length === 0 ? (
        <p className="text-center text-slate-400 py-16">
          Nenhum registro de medicação
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {registros.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <strong className="text-slate-900">{r.medicamento}</strong>
                  <span className="text-sm text-slate-500">
                    {formatDate(r.createdAt)}
                  </span>
                </div>
                {r.dosagem && (
                  <p className="text-sm text-slate-600">{r.dosagem}</p>
                )}
                {r.observacao && (
                  <p className="text-sm text-slate-500 mt-1">{r.observacao}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm min-h-[48px] rounded-xl gap-2 shadow-lg bg-primary text-primary-foreground font-medium inline-flex items-center justify-center hover:bg-primary/90 transition-colors">
          <Plus className="w-5 h-5" />
          Registrar Medicamento
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Medicamento</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleRegistrar()
            }}
            className="flex flex-col gap-4"
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
              inputMode="numeric"
            />
            <Input
              placeholder="Observação"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="text-base"
            />
            <Button type="submit" className="min-h-[48px]">
              Salvar
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}
