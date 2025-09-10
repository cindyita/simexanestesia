import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import { router, Head, usePage, useForm } from "@inertiajs/react";
import { useState, useEffect } from 'react';
import TableComp from '@/CustomComponents/table/TableComp';
import PrimaryButton from '@/CustomComponents/button/PrimaryButton';
import SecondaryButton from '@/CustomComponents/button/SecondaryButton';
import Modal from '@/CustomComponents/modal/Modal';
import FileDropInput from '@/CustomComponents/form/FileDropInput';
import CsvImporter from '@/Functions/CsvImporter';
import { FaTimes } from "react-icons/fa";
import DownloadCsvExample from '@/Functions/DownloadCsvExample';
import { copyToClipboard } from '@/Functions/CopyToClipboard';

export default function RegisterKeys() {
    // if (!usePage().props.menu[10]) return;
    const [modalKeysOpen, setModalKeysOpen] = useState(false);
    const [modalLoteKeysOpen, setModalLoteKeysOpen] = useState(false);
    const [modalKeysGenerateOpen, setModalKeysGenerateOpen] = useState(false);
    
    const keys = usePage().props.data;
    const roles = usePage().props.roles;
    const show = usePage().props.show ?? 'noused';
    const dataImported = usePage().props.imported ?? {};

    const registerkeys = keys['data'];

    const isAdmin = usePage().props.user['mode_admin'] ? true : false;
    const pageLevel = usePage().props.menu[10]['level'] ?? 1;

    const [currentPage, setCurrentPage] = useState(keys.current_page ?? 1);

    const [file, setFile] = useState(null);
    const [dataCsv, setDataCsv] = useState([]);

    const [successEmail, setSuccessEmail] = useState(0);

    const [typeKeys, setTypeKeys] = useState('unique');

    const { data, setData, post, put, errors, processing } = useForm({
        email: '',
        note: '',
        id_rol: roles[0]['id'],
        imported: dataCsv,
        type: typeKeys
    });

    useEffect(() => {
        if (dataCsv && dataCsv.length > 0) {
            setData('imported', dataCsv);
        }
    }, [dataCsv]);

    useEffect(() => {
        setData('type', 'imported');
    }, [modalLoteKeysOpen]);

    useEffect(() => {
        setData('type', 'unique');
    }, [modalKeysOpen]);
    
    const handlePageChange = (page) => {
        setCurrentPage(page);
        router.get('/registerkeys/'+show, { page }, {});
    };

    const handleKeysSave = (e) => {
        e.preventDefault();
        post(route('registerkeys'), {
            onSuccess: () => {
                setModalKeysOpen(false);
                setModalKeysGenerateOpen(true);
            },
        });
    };

    const handleKeysImportSave = async (e) => {
        e.preventDefault();
        
        post(route('registerkeys'), {
            onSuccess: () => {
                setModalLoteKeysOpen(false);
                setModalKeysGenerateOpen(true);
            },
        });
    }

    const handleFile = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleSendEmails = async (e) => {
        e.preventDefault();
        setSuccessEmail(1);

        try {
            const response = await axios.post(
                "/registerkeys/send",
                { keys: dataImported },
                {
                    headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                    },
                }
            );

            setSuccessEmail(2);

        } catch (error) {
            console.error("Error:", error);
            setSuccessEmail(0);
        }
    };

    const handleCopy = () => {
        const texto = dataImported
            .map(item => Object.values(item).join(" - "))
            .join("\n");

        copyToClipboard(texto);
    };

    const handleChangeShowKeys = (value) => {
        router.get('/registerkeys/'+value, {});
    }

    let columns = {
            'id': 'id',
            'key': 'Clave', 
            'rol': 'Rol al registro',
            'email': 'Email',
            'note': 'Nota'
    };

    let columnsHidden = ['Nota'];

    if (show && show === 'all') {
        columns.used_by = 'Usado por';
    }
    
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
                        <div className="flex gap-3 flex-col md:flex-row md:justify-between px-6 md:px-10 pt-6">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">
                                    Claves de registro
                                </h3>
                            </div>
                            <div className="flex gap-2 flex-col md:flex-row">
                                <select
                                    name="view_keys"
                                    className="px-3 py-2 pr-8 border border-emerald-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    onChange={(e) => handleChangeShowKeys(e.target.value)}
                                    value={show}
                                >
                                    <option value="noused">
                                        Claves sin usar
                                    </option>
                                    <option value="all">
                                        Todas las claves
                                    </option>
                                </select>
                                <PrimaryButton className="whitespace-nowrap" onClick={() => setModalLoteKeysOpen(true)}>Crear lote de claves</PrimaryButton>
                                <PrimaryButton className="whitespace-nowrap" onClick={() => setModalKeysOpen(true)}>Nueva clave</PrimaryButton>
                            </div>
                        </div>
                        <div className="px-3 md:px-6 pb-6 text-emerald-900">
                            <TableComp
                                id_table={'registerkeys_table'}
                                columns={columns}
                                columnsHidden = {columnsHidden}
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
                            <button type="button" onClick={() => setModalKeysOpen(false)} className="text-emerald-400 hover:text-emerald-600">
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
                                {roles && roles.map(el => (
                                    <option key={el.id} value={el.id}>
                                        {el.name}
                                    </option>
                                ))}
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

                        <div className="flex gap-2 mt-4 justify-end">
                            <PrimaryButton onClick={() => handleKeysSave}>
                                Generar
                            </PrimaryButton>
                        </div>
                    </form>
                    }
                </Modal>
                    
                <Modal show={modalKeysGenerateOpen} onClose={() => { setModalKeysGenerateOpen(false); setSuccessEmail(0); }}>
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

                                <div className="overflow-x-auto max-w-[80vh] md:max-w-full">
                                    {dataImported.length > 0 && (
                                        <>
                                            <label className="block text-sm font-medium mb-1">Claves creadas:</label>
                                            
                                            <table className="table-auto border-collapse border border-emerald-300 w-full">
                                                <thead>
                                                    <tr>
                                                    {Object.keys(dataImported[0]).map((key, i) => (
                                                        <th key={i} className="border border-emerald-300 px-2 py-1 bg-emerald-200 text-emerald-700">
                                                        {key}
                                                        </th>
                                                    ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {dataImported.map((row, i) => (
                                                    <tr key={i}>
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
                                    <PrimaryButton
                                        type="button"
                                        onClick={handleSendEmails} 
                                    >
                                        Enviar por correo
                                    </PrimaryButton>
                                    <PrimaryButton onClick={handleCopy}>
                                        Copiar al portapapeles
                                    </PrimaryButton>
                                </div>
                                {successEmail == 2 && (
                                    <p className="text-green-600">¡Se han enviado las claves por correo!</p>
                                )}
                                {successEmail == 1 && (
                                    <p className="text-gray-500">Enviando claves...</p>
                                )}
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
                                    <h4>Importar .CSV con emails <DownloadCsvExample /></h4>
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
                                        {roles && roles.map(el => (
                                            <option key={el.id} value={el.id}>
                                                {el.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div key={file ? file.name : 'empty'} className="overflow-x-auto max-w-[80vh] md:max-w-full">
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

                                <div className="flex gap-2 mt-4 justify-end">
                                    <PrimaryButton type="submit" onClick={handleKeysImportSave}>
                                        Generar
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
