import { useState, useEffect } from "react";
import Modal from "@/CustomComponents/modal/Modal";
import { FaKey, FaTimes, FaLock } from "react-icons/fa";
import PrimaryButton from "../button/PrimaryButton";
import Select from "../form/Select";

export default function RolePermissionsModal({ show, onClose, idRol, roleName, data = [], onSave }) {

  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setPermissions(data.map(item => ({
        id: item.id,
        name: item.name,
        level: item.level ? +item.level : 0
      })));
    }
    setLoading(false);
  }, [data]);

  const handleLevelChange = (id, level) => {
    setPermissions(prev =>
      prev.map(item =>
        item.id === id ? { ...item, level } : item
      )
    );
  };

  const handleSave = () => {
    if(idRol === 1) return;
    onSave && onSave(permissions,idRol);
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
          <h3 className="text-lg font-semibold text-[var(--primary)]">
            Permisos del rol: {roleName}
          </h3>
          <button onClick={onClose} className="text-[var(--secondary)] hover:text-[var(--primary)]">
            <FaTimes />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-[var(--font)] rounded-lg">
            <thead className="bg-[var(--primary)] text-[var(--textReverse)]">
              <tr>
                <th className="py-2 px-4 text-left">Pantalla</th>
                <th className="py-2 px-4 text-center">Permiso</th>
              </tr>
            </thead>
            <tbody>
              {permissions.length > 0 && permissions.map(screen => (
                <tr key={screen.id} className="border-b border-[var(--font)] hover:bg-[var(--font)]">
                  <td className="py-2 px-4 font-medium text-[var(--primary)]">{screen.name}</td>
                  <td className="py-2 px-4 text-center flex gap-2 items-center justify-center">
                    <Select
                      value={screen.level ?? 0}
                      onChange={(e) => handleLevelChange(screen.id, parseInt(e.target.value))}
                      className="border border-[var(--secondary)] focus:border-[var(--secondary)] rounded-md px-2 py-1 pr-7 sm:pr-8 text-sm" disabled={idRol === 1}
                    >
                      <option value={0}>Sin permiso</option>
                      <option value={1}>Nivel 1 (Visualización)</option>
                      <option value={2}>Nivel 2 (Edición)</option>
                      <option value={3}>Nivel 3 (Eliminación)</option>
                    </Select>
                    {getIcon(screen.level ?? 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {
          loading && (
            <>Cargando información..</>
          )
        }

        <div className="mt-6 flex justify-end">
          <PrimaryButton type="button" onClick={handleSave}>
            Asignar permisos
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}
