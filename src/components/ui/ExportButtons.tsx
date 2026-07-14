"use client";

import { useTranslations } from "next-intl";
import { buildCsv, downloadCsv, type ExportColumn, type ExportRow } from "@/lib/export/csv";

type ExportButtonsProps = {
  title: string;
  filenameBase: string;
  columns: ExportColumn[];
  rows: ExportRow[];
};

export function ExportButtons({ title, filenameBase, columns, rows }: ExportButtonsProps) {
  const t = useTranslations("export");

  function handleCsvExport() {
    const csv = buildCsv(rows, columns);
    downloadCsv(`${filenameBase}.csv`, csv);
  }

  async function handlePdfExport() {
    const { downloadPdf } = await import("@/lib/export/pdf");
    downloadPdf(`${filenameBase}.pdf`, title, rows, columns);
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={handleCsvExport}
        aria-label={t("csvAria")}
        className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--muted)] transition-colors hover:border-[var(--club-blue)] hover:text-[var(--club-blue)] dark:hover:border-[var(--club-yellow)] dark:hover:text-[var(--club-yellow)]"
      >
        {t("csv")}
      </button>
      <button
        type="button"
        onClick={handlePdfExport}
        aria-label={t("pdfAria")}
        className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--muted)] transition-colors hover:border-[var(--club-blue)] hover:text-[var(--club-blue)] dark:hover:border-[var(--club-yellow)] dark:hover:text-[var(--club-yellow)]"
      >
        {t("pdf")}
      </button>
    </div>
  );
}
