import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export function exportarPDF(
  nomePaciente: string,
  registros: { medicamento: string; dosagem: string; observacao: string; data: string }[]
) {
  const doc = new jsPDF()

  doc.setFont("helvetica")
  doc.setFontSize(16)
  doc.text(`Histórico de Medicamentos — ${nomePaciente}`, 14, 20)

  doc.setFontSize(10)
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 28)

  autoTable(doc, {
    startY: 35,
    head: [["Data", "Medicamento", "Dosagem", "Observação"]],
    body: registros.map((r) => [r.data, r.medicamento, r.dosagem, r.observacao]),
    styles: { font: "helvetica", fontSize: 9 },
    headStyles: { fillColor: [15, 23, 42] },
  })

  doc.save(`historico-${nomePaciente}.pdf`)
}
