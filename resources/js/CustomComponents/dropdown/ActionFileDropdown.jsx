import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaEdit, FaTrash, FaEye, FaEllipsisV, FaLink, FaFileDownload } from "react-icons/fa";
import { toast } from "sonner";

const ActionFileDropdown = ({ item, onView, onEdit, onDelete, onCustomAction,pageLevel=1 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right + window.scrollX - 192,
      });
    }
    setIsOpen(!isOpen);
  };
  const downloadFile = (url, filename = "archivo") => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => { toast.success("Archivo descargado"); }, 150);
  };

  const handleAction = (action, e) => {
    e.stopPropagation();
    setIsOpen(false);

    switch (action) {
      case "view":
        onView?.(item);
        break;
      case "edit":
        if(pageLevel > 1) onEdit?.(item);
        break;
      case "download":
        const path = "storage/"+item.file_path;
        downloadFile(path, item.name);
        break;
      case "delete":
        if(pageLevel > 2) onDelete?.(item);
        break;
      default:
        onCustomAction?.(action, item);
    }
  };

  // Cerrar con ESC
  useEffect(() => {
    const closeOnEsc = (e) => e.key === "Escape" && setIsOpen(false);
    document.addEventListener("keydown", closeOnEsc);
    return () => document.removeEventListener("keydown", closeOnEsc);
  }, []);

  return (
    <div className="relative inline-block text-right w-full">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        className="inline-flex justify-center w-5 h-6 text-sm font-medium text-[var(--primary)] rounded-lg hover:bg-[var(--font)]"
      >
        <FaEllipsisV className="w-3 h-4 self-center text-[var(--primary)]" />
          </button>

      {isOpen &&
        createPortal(
          <>
            {/* Close */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            {/* Dropdown */}
            <div
              className="absolute z-50 mt-2 w-48 rounded-md shadow-lg bg-[var(--fontWhite)] ring-1 ring-[var(--secondary)] focus:outline-none"
              style={{
                top: position.top,
                left: position.left,
                position: "absolute",
              }}
            >
              <div className="py-1">
                <button
                  onClick={(e) => handleAction("view", e)}
                  className="group flex items-center px-4 py-2 text-sm text-[var(--primary)] hover:bg-[var(--font)] hover:text-[var(--primary)] w-full text-left"
                >
                  <FaEye className="mr-3 h-4 w-4 text-[var(--secondary)] group-hover:text-[var(--secondary)]" />
                  Ver detalles
                        </button>
                        
                {/* <button
                  onClick={(e) => handleAction("copy", e)}
                  className="group flex items-center px-4 py-2 text-sm text-[var(--primary)] hover:bg-[var(--font)] hover:text-[var(--primary)] w-full text-left"
                >
                  <FaLink className="mr-3 h-4 w-4 text-[var(--secondary)] group-hover:text-[var(--secondary)]" />
                  Copiar url
                </button> */}
                {( pageLevel > 1 ? 
                (<button
                  onClick={(e) => handleAction("edit", e)}
                  className="group flex items-center px-4 py-2 text-sm text-[var(--primary)] hover:bg-[var(--font)] hover:text-[var(--primary)] w-full text-left"
                >
                  <FaEdit className="mr-3 h-4 w-4 text-[var(--secondary)] group-hover:text-[var(--secondary)]" />
                  Editar
                </button>) : ""
                )}

                <button
                  onClick={(e) => handleAction("download", e)}
                  className="group flex items-center px-4 py-2 text-sm text-[var(--primary)] hover:bg-[var(--font)] hover:text-[var(--primary)] w-full text-left"
                >
                  <FaFileDownload className="mr-3 h-4 w-4 text-[var(--secondary)] group-hover:text-[var(--secondary)]" />
                  Descargar
                </button>

                {( pageLevel > 2 ? 
                  (<>
                    <hr className="border-[var(--font)]" />
                    <button
                  onClick={(e) => handleAction("delete", e)}
                  className="group flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-100 hover:text-red-900 w-full text-left"
                >
                  <FaTrash className="mr-3 h-4 w-4 text-red-400 group-hover:text-red-500" />
                  Eliminar
                </button></>) : ""
                )}
              </div>
            </div>
          </>,
          document.body
        )}
    </div>
  );
};

export default ActionFileDropdown;
