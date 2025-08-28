import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaEdit, FaTrash, FaEye, FaEllipsisV } from "react-icons/fa";

const ActionDropdown = ({ item, onView, onEdit, onDelete, customActions = [],pageLevel=1 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right + window.scrollX - 192, // ancho ~ w-48
      });
    }
    setIsOpen(!isOpen);
  };

  const handleAction = (action) => {
    setIsOpen(false);

    switch (action.type) {
      case "view":
        onView?.(item);
        break;
      case "edit":
        if(pageLevel > 1) onEdit?.(item);
        break;
      case "delete":
        if(pageLevel > 2) onDelete?.(item);
        break;
      case "custom":
        action.callback?.(item);
        break;
      default:
        console.warn("Acción desconocida:", action);
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
        className="inline-flex justify-center w-7 h-6 text-sm font-medium text-emerald-700"
      >
        <FaEllipsisV className="w-3 h-4 self-center text-emerald-600" />
      </button>

      {isOpen &&
        createPortal(
          <>
            {/* Fondo para cerrar */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <div
              className="absolute z-50 mt-2 w-48 rounded-md shadow-lg bg-[var(--fontWhite)] ring-1 ring-emerald-300 focus:outline-none"
              style={{ top: position.top, left: position.left }}
            >
              <div className="py-1">
                <button
                  onClick={() => handleAction({ type: "view" })}
                  className="group flex items-center px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900 w-full text-left"
                >
                  <FaEye className="mr-3 h-4 w-4 text-emerald-400 group-hover:text-emerald-500" />
                  Ver Detalles
                </button>
                {( pageLevel > 1 ? 
                  (<button
                    onClick={() => handleAction({ type: "edit" })}
                    className="group flex items-center px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900 w-full text-left"
                  >
                    <FaEdit className="mr-3 h-4 w-4 text-emerald-400 group-hover:text-emerald-500" />
                    Editar
                  </button>) : ""
                )}

                {customActions?.map((action, index) => (
                  <button
                    key={index}
                    onClick={(e) => { e.stopPropagation(); setIsOpen(false); action.callback(item); }}
                    className="group flex items-center px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900 w-full text-left"
                  >
                    {action.icon && action.icon}
                    {action.label}
                  </button>
                ))}
                {(pageLevel > 2 ? 
                  (
                    <>
                      <hr className="border-emerald-200" />

                      <button
                        onClick={() => handleAction({ type: "delete" })}
                        className="group flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-100 hover:text-red-900 w-full text-left"
                      >
                        <FaTrash className="mr-3 h-4 w-4 text-red-400 group-hover:text-red-500" />
                        Eliminar
                      </button>
                  </>  
                ) : "")}
              </div>
            </div>
          </>,
          document.body
        )}
    </div>
  );
};

export default ActionDropdown;
