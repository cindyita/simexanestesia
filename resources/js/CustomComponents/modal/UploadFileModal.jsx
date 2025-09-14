import { useState, useRef } from "react";
import Modal from "@/CustomComponents/modal/Modal";
import { FaUpload, FaTimes } from "react-icons/fa";
import Select from '@/CustomComponents/form/Select';

export default function UploadFileModal({ show, onClose, subjects, onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef();

  const MAX_SIZE_MB = 20; // Tamaño máximo
  const ALLOWED_TYPES = ["pdf","doc","docx","xls","xlsx","ppt","pptx","jpg","jpeg","png","gif","mp3","mp4","txt"];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.name.split(".").pop().toLowerCase();
    const fileSizeMB = file.size / (1024 * 1024);

    if (!ALLOWED_TYPES.includes(fileType)) {
      alert("Tipo de archivo no permitido.");
      return;
    }

    if (fileSizeMB > MAX_SIZE_MB) {
      alert(`El archivo supera el tamaño máximo de ${MAX_SIZE_MB} MB.`);
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange({ target: { files: [file] } });
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedSubject) {
      alert("Selecciona un archivo y una materia.");
      return;
    }

    setUploading(true);
    setProgress(0);

    // Simulación de carga (reemplaza con tu lógica real de subida)
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setUploading(false);
          setSelectedFile(null);
          setSelectedSubject("");
          onUpload && onUpload(); // callback al subir
          onClose();
        }
        return Math.min(p + 10, 100);
      });
    }, 200);
  };

  return (
    <>
      <Modal show={show} onClose={onClose} maxWidth="lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[var(--primary)]">Subir nuevo recurso</h3>
            <button onClick={onClose} className="text-[var(--secondary)] hover:text-[var(--primary)]">
              <FaTimes />
            </button>
          </div>

          {/* Selector de materia */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--primary)] mb-1">Materia asociada</label>
            <Select
              className="w-full border border-[var(--secondary)] rounded-md px-3 py-2 focus:ring-2 focus:ring-[var(--secondary)] focus:border-transparent"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">Selecciona una materia</option>
              {subjects.map((subj) => (
                <option key={subj.code} value={subj.name}>{subj.name}</option>
              ))}
            </Select>
          </div>

          {/* Drag & Drop + File input */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="mb-4 border-2 border-dashed border-[var(--secondary)] rounded-lg p-6 text-center cursor-pointer hover:border-[var(--secondary)] transition-colors"
            onClick={() => fileInputRef.current.click()}
          >
            {selectedFile ? (
              <p className="text-[var(--primary)]">{selectedFile.name}</p>
            ) : (
              <p className="text-[var(--secondary)]">Arrastra el archivo aquí o haz click para seleccionar</p>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Restricciones */}
          <p className="text-xs text-[var(--secondary)] mb-4">
            Tipos permitidos: {ALLOWED_TYPES.join(", ")} | Tamaño máximo: {MAX_SIZE_MB} MB
          </p>

          {/* Barra de carga */}
          {uploading && (
            <div className="mb-4">
              <div className="w-full bg-[var(--font)] rounded-full h-2 overflow-hidden">
                <div className="bg-[var(--secondary)] h-2" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-sm text-[var(--primary)] mt-1">Subiendo... {progress}%</p>
            </div>
          )}

          {/* Botón subir */}
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`w-full py-2 px-4 rounded-md text-[var(--textReverse)] font-medium transition-colors ${
              uploading ? "bg-[var(--secondary)] cursor-not-allowed" : "bg-[var(--primary)] hover:bg-[var(--primary)]"
            }`}
          >
            {uploading ? "Subiendo..." : "Subir recurso"}
          </button>
        </div>
        </Modal>
      </>
  );
}
