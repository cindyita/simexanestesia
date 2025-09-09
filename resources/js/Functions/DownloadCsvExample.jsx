import React from "react";

export default function DownloadCsvExample({
  filename = "ejemplo.csv",
  data = [
    { email: 'cindy_al25@hotmail.com', nota: "A001" },
    { email: 'ejemplo@ejemplocsv.com', nota: "A002" },
    { email: 'ejemplo2@ejemplocsv.com', nota: "A003" }
  ]
}) {
  const handleDownload = () => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) =>
      Object.values(row)
        .map((value) => `"${value}"`)
        .join(",")
    );
    const csvContent = [headers, ...rows].join("\n");

    // Creamos un blob y lo descargamos
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <a
      onClick={handleDownload}
      className="text-emerald-400 cursor-pointer text-decoration-underline"
    >
      [Descargar CSV de ejemplo]
    </a>
  );
}
