import React, { useRef, useState } from "react";
import { FaFileUpload } from "react-icons/fa";

export default function FileDropInput({
  onChange,
  accept = ".csv",
  className = "",
  label = "Arrastra tu archivo aquí o haz clic para seleccionar"
}) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const handleClick = () => {
    inputRef.current?.click();
  };

  const isFileAccepted = (file) => {
    if (!file) return false;
    const acceptedTypes = accept.split(",").map((a) => a.trim().toLowerCase());

    // Revisar por extensión
    const fileExtension = "." + file.name.split(".").pop().toLowerCase();
    if (acceptedTypes.includes(fileExtension)) return true;

    // Revisar por tipo MIME
    if (acceptedTypes.includes(file.type.toLowerCase())) return true;

    return false;
  };

  const handleFiles = (files) => {
    if (files?.[0]) {
      const file = files[0];

      if (!isFileAccepted(file)) {
        setError(`El archivo "${file.name}" no es un tipo válido. Solo se aceptan: ${accept}`);
        setFileName("");
        return;
      }

      setError("");
      setFileName(file.name);

      if (onChange) {
        const event = { target: { files } };
        onChange(event);
      }
    }
  };

  const handleChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      <div
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition ${
          dragActive
            ? "border-[var(--secondary)] bg-[var(--font)]"
            : "border-gray-300 hover:border-[var(--secondary)] hover:bg-gray-50"
        } ${className}`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <FaFileUpload className="text-3xl mb-2 text-[var(--primary)]" />

        <p className="text-sm text-gray-600">{label}</p>

        {fileName && !error && (
          <p className="mt-2 text-xs text-gray-500">
            Archivo seleccionado: <span className="font-semibold">{fileName}</span>
          </p>
        )}

        {error && (
          <p className="mt-2 text-xs text-red-500 font-semibold">{error}</p>
        )}
      </div>
    </div>
  );
}
