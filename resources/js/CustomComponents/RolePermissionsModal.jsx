import { useState, useEffect } from "react";
import Modal from "@/CustomComponents/Modal";
import { FaKey, FaTimes, FaLock } from "react-icons/fa";
import PrimaryButton from "./button/PrimaryButton";

export default function RolePermissionsModal({ show, onClose, roleName, data = [], onSave }) {

  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setPermissions(data.map(item => ({
        id: item.id,
        name: item.name,
        level: item.level ?? 0
      })));
    }
  }, [data]);

  const handleLevelChange = (id, level) => {
    setPermissions(prev =>
      prev.map(item =>
        item.id === id ? { ...item, level } : item
      )
    );
  };

  const handleSave = () => {
    onSave && onSave(permissions);
    onClose();
  };

  const getIcon = (level) => {
    switch(+level) {
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
          <h3 className="text-lg font-semibold text-emerald-800">
            Permisos del rol: {roleName}
          </h3>
          <button onClick={onClose} className="text-emerald-400 hover:text-emerald-600">
            <FaTimes />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-emerald-200 rounded-lg">
            <thead className="bg-emerald-700 text-white">
              <tr>
                <th className="py-2 px-4 text-left">Pantalla</th>
                <th className="py-2 px-4 text-center">Permiso</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map(screen => (
                <tr key={screen.id} className="border-b border-emerald-200 hover:bg-emerald-50">
                  <td className="py-2 px-4 font-medium text-emerald-800">{screen.name}</td>
                  <td className="py-2 px-4 text-center flex gap-2 items-center justify-center">
                    <select
                      value={screen.level ?? 0}
                      onChange={(e) => handleLevelChange(screen.id, parseInt(e.target.value))}
                      className="border border-emerald-300 focus:border-emerald-500 rounded-md px-2 py-1 pr-7 sm:pr-8 text-sm"
                    >
                      <option value={0}>Sin permiso</option>
                      <option value={1}>Nivel 1 (Visualización)</option>
                      <option value={2}>Nivel 2 (Edición)</option>
                      <option value={3}>Nivel 3 (Eliminación)</option>
                    </select>
                    {getIcon(screen.level ?? 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <PrimaryButton onClick={handleSave}>
            Asignar permisos
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}
