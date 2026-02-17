"use client";

function escapeCSV(value) {
  const stringValue = value === null || value === undefined ? "" : String(value);
  const normalized = stringValue.replace(/\r?\n/g, " ").trim();
  if (normalized.includes(",") || normalized.includes("\"") || normalized.includes("\n")) {
    return `"${normalized.replace(/"/g, "\"\"")}"`;
  }
  return normalized;
}

export function downloadCSV(filename, headers, rows) {
  const headerLine = headers.map((h) => escapeCSV(h.label)).join(",");
  const bodyLines = rows.map((row) =>
    headers.map((h) => escapeCSV(row[h.key])).join(",")
  );
  const csvContent = [headerLine, ...bodyLines].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, filename.endsWith(".csv") ? filename : `${filename}.csv`);
}

export function downloadExcel(filename, headers, rows) {
  const headerRow = `<tr>${headers
    .map((h) => `<th>${escapeHTML(h.label)}</th>`)
    .join("")}</tr>`;
  const bodyRows = rows
    .map(
      (row) =>
        `<tr>${headers
          .map((h) => `<td>${escapeHTML(row[h.key])}</td>`)
          .join("")}</tr>`
    )
    .join("");
  const table = `<table>${headerRow}${bodyRows}</table>`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8" /></head><body>${table}</body></html>`;
  const blob = new Blob([html], { type: "application/vnd.ms-excel" });
  triggerDownload(blob, filename.endsWith(".xls") ? filename : `${filename}.xls`);
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function escapeHTML(value) {
  const stringValue = value === null || value === undefined ? "" : String(value);
  return stringValue
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
