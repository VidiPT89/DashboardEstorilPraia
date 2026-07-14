export interface ExportColumn {
  key: string;
  label: string;
}

export type ExportRow = Record<string, string | number>;

function escapeCell(value: string | number): string {
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export function buildCsv(rows: ExportRow[], columns: ExportColumn[]): string {
  const header = columns.map((column) => escapeCell(column.label)).join(",");
  const lines = rows.map((row) => columns.map((column) => escapeCell(row[column.key] ?? "")).join(","));
  return [header, ...lines].join("\n");
}

export function downloadCsv(filename: string, content: string): void {
  // UTF-8 BOM so Excel correctly detects accented characters (á, ã, ç, ...).
  const blob = new Blob([`﻿${content}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
