import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { ExportColumn, ExportRow } from "@/lib/export/csv";

const CLUB_BLUE: [number, number, number] = [0, 51, 102];

export function downloadPdf(filename: string, title: string, rows: ExportRow[], columns: ExportColumn[]): void {
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.setTextColor(...CLUB_BLUE);
  doc.text(title, 14, 16);

  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(`Estoril Praia Analytics Hub · ${new Date().toLocaleDateString("pt-PT")}`, 14, 22);

  autoTable(doc, {
    startY: 28,
    head: [columns.map((column) => column.label)],
    body: rows.map((row) => columns.map((column) => String(row[column.key] ?? ""))),
    headStyles: { fillColor: CLUB_BLUE },
    styles: { fontSize: 8, cellPadding: 2.5 },
    alternateRowStyles: { fillColor: [244, 246, 250] },
  });

  doc.save(filename);
}
