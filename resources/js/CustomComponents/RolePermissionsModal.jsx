import { useState } from "react";
import Modal from "@/CustomComponents/Modal";
import { FaKey, FaTimes, FaLock } from "react-icons/fa";
import PrimaryButton from "./button/PrimaryButton";

export default function RolePermissionsModal({ show, onClose, roleName, screens = [], onSave }) {
  // Inicializamos los permisos en 0 (sin permiso)
  const [permissions, setPermissions] = useState(
    () => screens.reduce((acc, screen) => ({ ...acc, [screen]: 0 }), {})
  );

  const handleLevelChange = (screen, level) => {
    setPermissions(prev => ({ ...prev, [screen]: level }));
  };

  const handleSave = () => {
    onSave && onSave(permissions); // callback con los permisos
    onClose();
  };

  const getIcon = (level) => {
    switch(level) {
      case 0: return <FaLock className="text-gray-400" />;
      case 1: return <FaKey className="text-yellow-500" />;
      case 2: return <FaKey className="text-blue-500" />;
      case 3: return <FaKey className="text-red-500" />;
      default: return <FaLock className="text-gray-400" />;
    }
  };

  return (
    <Modal show={show} onClose={onClose} maxWidth="xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-emerald-800">Permisos del rol: {roleName}</h3>
          <button onClick={onClose} className="text-emerald-400 hover:text-emerald-600">
            <FaTimes />
          </button>
        </div>

        {/* Tabla de permisos */}
        <div className="overflow-x-auto">
          <table className="w-full border border-emerald-200 rounded-lg">
            <thead className="bg-emerald-700 text-white">
              <tr>
                <th className="py-2 px-4 text-left">Pantalla</th>
                <th className="py-2 px-4 text-center">Permiso</th>
              </tr>
            </thead>
            <tbody>
              {screens.map(screen => (
                <tr key={screen} className="border-b border-emerald-200 hover:bg-emerald-50">
                  <td className="py-2 px-4 font-medium text-emerald-800">{screen}</td>
                  <td className="py-2 px-4 text-center flex gap-2 items-center justify-center">
                    <select
                      value={permissions[screen]}
                      onChange={(e) => handleLevelChange(screen, parseInt(e.target.value))}
                      className="border border-emerald-300 focus:border-emerald-500 rounded-md px-2 py-1 pr-7 sm:pr-8 text-sm"
                    >
                      <option value={0}>Sin permiso</option>
                      <option value={1}>Nivel 1 (Visualización)</option>
                      <option value={2}>Nivel 2 (Edición)</option>
                      <option value={3}>Nivel 3 (Eliminación)</option>
                    </select>
                     {getIcon(permissions[screen])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Botón guardar */}
        <div className="mt-6 flex justify-end">
          <PrimaryButton onClick={handleSave}>
            Asignar permisos
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}
