import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router, Head, usePage, useForm } from "@inertiajs/react";
import { useState } from 'react';
import TableComp from '@/CustomComponents/table/TableComp';
import PrimaryButton from '@/CustomComponents/button/PrimaryButton';
import SecondaryButton from '@/CustomComponents/button/SecondaryButton';
import Modal from '@/CustomComponents/modal/Modal';
import FileDropInput from '@/CustomComponents/form/FileDropInput';
import CsvImporter from '@/Functions/CsvImporter';
import { FaTimes } from "react-icons/fa";

export default function RegisterKeys() {
    // if (!usePage().props.menu[9]) return;
    const [modalKeysOpen, setModalKeysOpen] = useState(false);
    const [modalLoteKeysOpen, setModalLoteKeysOpen] = useState(false);
    const [modalKeysGenerateOpen, setModalKeysGenerateOpen] = useState(false);
    
    const keys = usePage().props.data;
    const isAdmin = usePage().props.user['mode_admin'] ? true : false;
    const pageLevel = usePage().props.menu[9]['level'] ?? 1;

    const [currentPage, setCurrentPage] = useState(keys.current_page ?? 1);

    const { data, setData, post, put, errors, processing } = useForm({
        email: '',
        note: ''
    });
    
    const handlePageChange = (page) => {
        setCurrentPage(page);
        router.get('registerkeys', { page }, {});
    };

    const handleKeysSave = (e) => {
        e.preventDefault();
        // post(route('alert.update', selectedAlert.id), {
        // onSuccess: () => setModalAlertOpen(false),
        // onError: () => console.log(errors),
        // });
        console.log("key save");
        
    };

    const [file, setFile] = useState(null);
    const [dataCsv, setDataCsv] = useState([]);

    const handleFile = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const registerkeys = [{
        'id': '1',
        "key": 'ahl56n24',
        'rol': 'Usuario',
        'used_by': '',
        'created_at': '',
        'used_at':''
    }];

    const columns = {
        'id': 'id',
        'key': 'Clave', 
        'rol': 'Rol al registro',
        'used_by': 'Usado por',
        'created_at': 'Creado en',
        'used_at': 'Usado en'
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-emerald-800">
                    Claves de registro
                </h2>
            }
        >
            <Head title="Claves de registro" />

            <div className="registerkeys">
                <div>
                    <div className="bg-white rounded-lg shadow">
                        <div className="flex justify-between px-6 md:px-10 pt-6">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">
                                    Claves de registro
                                </h3>
                            </div>
                            <div className="flex gap-2">
                                <PrimaryButton onClick={() => setModalLoteKeysOpen(true)}>Crear lote de claves</PrimaryButton>
                                <PrimaryButton onClick={() => setModalKeysOpen(true)}>Nueva clave</PrimaryButton>
                            </div>
                        </div>
                        <div className="px-3 md:px-6 pb-6 text-emerald-900">
                            <TableComp
                                id_table={'registerkeys_table'}
                                columns={columns}
                                dataRaw={registerkeys}
                                downloadBtns={true}
                                actionBtns={true}
                                useFormatDate={true}
                                showTime={false}
                                currentPage={currentPage}
                                totalPages={keys.last_page}
                                onPageChange={handlePageChange}
                                pageLevel={pageLevel}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {(isAdmin ? (
                <>
                <Modal show={modalKeysOpen} onClose={() => setModalKeysOpen(false)}>
                    {data &&
                    <form
                    onSubmit={handleKeysSave}
                    className="p-6 space-y-4"
                        >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-emerald-800">
                                Crear clave de registro
                            </h3>
                            <button onClick={() => setModalKeysOpen(false)} className="text-emerald-400 hover:text-emerald-600">
                                <FaTimes />
                            </button>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Rol de usuario al registro</label>
                            <select
                                name="id_rol"
                                value={data.id_rol}
                                onChange={(e) => setData('id_rol', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            >
                                <option value="5">Usuario</option>
                                <option value="2">Moderador</option>
                                <option value="1">Administrador</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Email (Opcional)</label>
                            <input type="text" name="email" value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Nota</label>
                            <textarea
                                name="note"
                                value={data.note}
                                onChange={(e) => setData('note', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        <div className="flex gap-2 mt-4 justify-between">
                            <PrimaryButton>
                                Solo generar
                            </PrimaryButton>
                            <PrimaryButton
                                type="submit"
                            >
                                Generar y enviar por email
                            </PrimaryButton>
                        </div>
                    </form>
                    }
                </Modal>
                    
                <Modal show={modalKeysGenerateOpen} onClose={() => setModalKeysGenerateOpen(false)}>
                    {data &&
                        <>
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-emerald-800">
                                        Se han creado las claves
                                    </h3>
                                    <button onClick={() => setModalKeysGenerateOpen(false)} className="text-emerald-400 hover:text-emerald-600">
                                        <FaTimes />
                                    </button>
                                </div>
                                <div>
                                    
                                </div>

                                <div className="flex gap-2 mt-4 justify-between">
                                    <SecondaryButton
                                        type="button"
                                        onClick={() => setModalKeysGenerateOpen(false)}
                                    >
                                        Cerrar
                                    </SecondaryButton>
                                    <PrimaryButton>
                                        Copiar
                                    </PrimaryButton>
                                </div>
                            </div>
                        </>
                    }
                </Modal>
                    
                <Modal show={modalLoteKeysOpen} onClose={() => setModalLoteKeysOpen(false)}>
                    {data &&
                        <>
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-emerald-800">
                                        Crear lote de claves de registro
                                    </h3>
                                    <button onClick={() => setModalLoteKeysOpen(false)} className="text-emerald-400 hover:text-emerald-600">
                                        <FaTimes />
                                    </button>
                                </div>
                                    
                                <p>Puedes enviar claves de registro a emails de forma masiva.</p>
                                    
                                <div>
                                    <h4>Importar .CSV con emails</h4>
                                    <FileDropInput onChange={handleFile} />
                                    <CsvImporter file={file} onData={setDataCsv} />    
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Rol de usuario al registro</label>
                                    <select
                                        name="id_rol"
                                        value={data.id_rol}
                                        onChange={(e) => setData('id_rol', e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    >
                                        <option value="5">Usuario</option>
                                        <option value="2">Moderador</option>
                                        <option value="1">Administrador</option>
                                    </select>
                                </div>
                                
                                <div>
                                    {dataCsv.length > 0 && (
                                        <>
                                            <label className="block text-sm font-medium mb-1">Datos importados:</label>
                                            <table className="table-auto border-collapse border border-emerald-300 w-full">
                                                <thead>
                                                    <tr>
                                                        <th className="border border-emerald-300 px-2 py-1 bg-emerald-700">
                                                        </th>
                                                    {Object.keys(dataCsv[0]).map((key, i) => (
                                                        <th key={i} className="border border-emerald-300 px-2 py-1 bg-emerald-700 text-white">
                                                        {key}
                                                        </th>
                                                    ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {dataCsv.map((row, i) => (
                                                    <tr key={i}>
                                                        <td className="border border-emerald-300 px-2 py-1 text-center">{i+1}</td>    
                                                        {Object.values(row).map((value, j) => (
                                                        <td key={j} className="border border-emerald-300 px-2 py-1">
                                                            {value}
                                                        </td>
                                                        ))}
                                                    </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </>
                                    )}
                                </div>

                                <div className="flex gap-2 mt-4 justify-between">
                                    <PrimaryButton>
                                        Solo generar
                                    </PrimaryButton>
                                    <PrimaryButton>
                                        Generar y enviar por email
                                    </PrimaryButton>
                                </div>
                            </div>
                        </>
                        }
                    </Modal>
                        
                    </>
            ): "")}
            {/*---------------------*/}

        </AuthenticatedLayout>
    );
}
