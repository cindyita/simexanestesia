import { useRef, useState } from "react";
import { FaFileUpload } from "react-icons/fa";

export default function ImageDropInput({
  onChange,
  accept = ".jpg,.png,.svg",
  className = "",
  label = "Arrastra tu imagen aquí o haz clic para seleccionar",
  previewSize = 150
}) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const isFileAccepted = (file) => {
    if (!file) return false;
    const acceptedTypes = accept.split(",").map((a) => a.trim().toLowerCase());
    const fileExtension = "." + file.name.split(".").pop().toLowerCase();
    if (acceptedTypes.includes(fileExtension)) return true;
    if (acceptedTypes.includes(file.type.toLowerCase())) return true;
    return false;
  };

  const handleFiles = (files) => {
    if (files?.[0]) {
      const file = files[0];

      const acceptedTypes = accept.split(",").map(a => a.trim().toLowerCase());
      const ext = "." + file.name.split(".").pop().toLowerCase();
      if (!acceptedTypes.includes(ext) && !acceptedTypes.includes(file.type.toLowerCase())) {
        setError(`Archivo inválido. Solo se acepta: ${accept}`);
        setFileName(""); 
        setPreview(null);
        if (onChange) onChange(null, null);
        return;
      }

      setError("");
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        if (onChange) onChange(file, e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => handleFiles(e.target.files);
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); };
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
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      <div
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition ${
          dragActive
            ? "border-[var(--secondary)] bg-emerald-50"
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
            Imagen seleccionada: <span className="font-semibold">{fileName}</span>
          </p>
        )}

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="mt-4"
            style={{ width: previewSize, height: previewSize,maxWidth:180 }}
          />
        )}

        {error && (
          <p className="mt-2 text-xs text-red-500 font-semibold">{error}</p>
        )}
      </div>
    </div>
  );
}
