import { useState, useRef } from "react";
import Modal from "@/CustomComponents/modal/Modal";
import { FaUpload, FaTimes } from "react-icons/fa";
import Select from '@/CustomComponents/form/Select';
import Textarea from "../form/Textarea";
import { toast } from "sonner";
import axios from "axios";

export default function UploadFileModal({ show, onClose, subjects, onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef();

  const MAX_SIZE_MB = 20;
  const ALLOWED_TYPES = ["pdf","doc","docx","xls","xlsx","ppt","pptx","jpg","jpeg","png","gif","mp3","mp4","txt"];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.name.split(".").pop().toLowerCase();
    const fileSizeMB = file.size / (1024 * 1024);

    if (!ALLOWED_TYPES.includes(fileType)) {
      setTimeout(() => { toast.error("Tipo de archivo no permitido."); }, 100);
      return;
    }

    if (fileSizeMB > MAX_SIZE_MB) {
      setTimeout(() => { toast.error(`El archivo supera el tamaño máximo de ${MAX_SIZE_MB} MB.`); }, 100);
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
    // if (!selectedFile || !selectedSubject) {
    //   alert("Selecciona un archivo y una materia.");
    //   return;
    // }
    //-----------------------------------
    try {
      setUploading(true);
      setProgress(0);

      const formData = new FormData();
      formData.append("upfile", 1);
      formData.append("file", selectedFile);
      formData.append("id_subject", selectedSubject);
      formData.append("description", description);

      const response = await axios.post("/resources", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(percent);
          }
        },
      });

      console.log(response.data);
      console.log("Se subió el archivo:", selectedFile);
      setTimeout(() => { toast.success("Se subió el archivo"); }, 100);

      setUploading(false);
      setSelectedFile(null);
      setSelectedSubject("");
      onUpload && onUpload();
      onClose && onClose();
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      setTimeout(() => { toast.error("Error al subir el archivo"); }, 100);
      setUploading(false);
    }
    //-----------------------------------

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
                <option key={subj.id} value={subj.id}>{subj.name}</option>
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--primary)] mb-1">Descripción</label>
            <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-[var(--secondary)] rounded-md focus:ring-2 focus:ring-[var(--secondary)] focus:border-transparent"
                placeholder="Descripción del archivo (opcional)"
            />
          </div>

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
