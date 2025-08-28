import Modal from "@/CustomComponents/modal/Modal";
import PrimaryButton from "../button/PrimaryButton";
import { FaTimes } from "react-icons/fa";

export default function RoleSettingsModal({ show, onClose, data = [], onSave }) {

    let rolRegister = 5;

    const handleSave = () => {
        onSave && onSave(permissions);
        onClose();
    };

  return (
    <Modal show={show} onClose={onClose} maxWidth="xl">
      
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-emerald-800">
                    Rol de usuario default al registro:
                </h3>
                <button onClick={onClose} className="text-emerald-400 hover:text-emerald-600">
                    <FaTimes />
                </button>
            </div>
              <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <select
                            name="id_rol_register"
                            value={rolRegister}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      >
                            <option value="1">Administrador</option>
                            <option value="5">Usuario</option>
                        </select>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <PrimaryButton>
                            Guardar
                        </PrimaryButton>
                    </div>
                    
              </form>
        </div>
        
    </Modal>
  );
}
