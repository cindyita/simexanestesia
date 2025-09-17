import PrimaryButton from "../button/PrimaryButton";
import SecondaryButton from "../button/SecondaryButton";
import Modal from "./Modal";
import { FaTimes } from "react-icons/fa";

export default function ConfirmDeleteModal({ show, onClose, onConfirm, id }) {

    const handleConfirm = () => {
        onConfirm(id);
        onClose();
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="sm">
            <div className="p-4 space-y-4 text-center bg-red-50 rounded-lg">
                <div className="flex flex-col justify-center items-center mb-4 gap-2">
                    <button type="button" onClick={onClose} className="text-[var(--secondary)] hover:text-[var(--primary)]">
                        <FaTimes />
                    </button>
                    <h3 className="text-lg font-semibold text-red-600">
                        Confirma la eliminación del registro
                    </h3>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                    Esta acción no se puede deshacer. Se borrarán también todos los elementos ligados (Por ejemplo si borras un rol se borraran las claves relacionadas con ese rol).
                </p>

                <div className="mt-6 flex justify-center gap-4">
                    <SecondaryButton
                        onClick={onClose}
                        className=""
                    >
                        Cancelar
                    </SecondaryButton>
                    <PrimaryButton
                        onClick={handleConfirm}
                        className="bg-red-600 hover:bg-red-700 transition"
                    >
                        Eliminar
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
}
