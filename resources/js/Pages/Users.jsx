import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router, Head, usePage } from "@inertiajs/react";
import { useState } from 'react';
import TableComp from '@/CustomComponents/table/TableComp';
import PrimaryButton from '@/CustomComponents/button/PrimaryButton';
import { useFetchDetails } from '@/hooks/useFetchDetails';
import { useFormValidation } from '@/hooks/useFormValidation';
import FormModal from '@/CustomComponents/modal/FormModal';

export default function Users() {
    if (!usePage().props.menu[7]) return;

    const data = usePage().props.data;
    const pageLevel = usePage().props.menu[7]['level'];

    const roles = usePage().props.roles;

    const [currentPage, setCurrentPage] = useState(data.current_page);
    const [modalNewOpen, setModalNewOpen] = useState(false);
    
    const handlePageChange = (page) => {
        setCurrentPage(page);
        router.get('users', { page }, {});
    };

    const users = data.data;

    const columns = {
        'id': 'id',
        'name': 'Nombre', 
        'email': 'Email',
        'role_name': 'Rol',
        'created_at': 'Creado en'
    };

    // HANDLE ACTIONS -----------------
    const handleDelete = async (id) => {
        return new Promise((resolve, reject) => {
            router.visit('/users', {
                method: 'post',
                data: {
                    id_delete: id
                },
                onSuccess: () => resolve(id),
                onError: (errors) => reject(errors),
            });
        });
    }

    const { fetchDetails } = useFetchDetails();

    const handleDetails = async (id, useHeaders = true) => {
        if (useHeaders) {
            const headerMap = {
                id: "id",
                name: "Nombre",
                email: "Email",
                role_name: "Rol",
                created_at: "Fecha de creación",
                updated_at: "Última actualización"
            };
            return await fetchDetails("/getUser", { id }, headerMap);
        } else {
            return await fetchDetails("/getUser", { id });
        }
    };

    const handleActionFields = {
        id: { label: "id", type: "number", editable: false, show: false },
        name: { label: "Nombre", type: "text", editable: true, show: true, required: true },
        email: { label: "Email", type: "text", editable: true, show: true, required: true },
        id_company: { label: "id_company", type: "text", editable: false, show: false },
        id_rol: { label: "Rol", type: "select", options: roles, editable: true, show: true, required: true },
        passw: { label: "contraseña", type: "password", editable: true, show: true, required: true },
    };

    const handleActionFieldsUpdate = {
        id: { label: "id", type: "number", editable: false, show: false },
        name: { label: "Nombre", type: "text", editable: true, show: true, required: true },
        email: { label: "Email", type: "text", editable: true, show: true , required: true},
        id_rol: { label: "Rol", type: "select", options: roles, editable: true, show: true, required: true }
    };

    const { validateForm: validateFormCreate } = useFormValidation(handleActionFields);
    const { validateForm: validateFormUpdate } = useFormValidation(handleActionFieldsUpdate);

    const handleUpdate = async (form) => {

        const errors = validateFormUpdate(form);

        if (Object.keys(errors).length > 0) {
            console.error(errors);
            return Promise.reject(errors);
        }

        return new Promise((resolve, reject) => {
            router.visit('/users', {
                method: 'post',
                data: { update: form },
                onSuccess: () => resolve(form),
                onError: (errors) => reject(errors),
            });
        });

    };

    const handleCreate = async (form) => {

        const errors = validateFormCreate(form);

        if (Object.keys(errors).length > 0) {
            console.error(errors);
            return Promise.reject(errors);
        }

        return new Promise((resolve, reject) => {
            router.visit('/users', {
                method: 'post',
                data: { create: form },
                onSuccess: () => resolve(form),
                onError: (errors) => reject(errors),
            });
        });
    };
    //---------------------------------

    return (
        <AuthenticatedLayout
            title="Usuarios"
        >

            <div className="users">
                <div>
                    <div className="bg-[var(--fontBox)] rounded-lg shadow">
                        <div className="flex justify-between px-6 md:px-10 pt-6">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">
                                    Usuarios
                                </h3>
                            </div>
                            <div>
                                <PrimaryButton onClick={() => setModalNewOpen(true)}>Nuevo usuario</PrimaryButton>
                            </div>
                        </div>
                        <div className="px-3 md:px-6 pb-6 text-[var(--primary)]">
                            <TableComp
                                id_table={'users_table'}
                                columns={columns}
                                dataRaw={users}
                                downloadBtns={true}
                                actionBtns={true}
                                useFormatDate={true}
                                showTime={true}
                                currentPage={currentPage}
                                totalPages={data.last_page}
                                onPageChange={handlePageChange}
                                pageLevel={pageLevel}
                                handleActionDelete={handleDelete}
                                handleActionDetails={handleDetails}
                                handleActionUpdate={handleUpdate}
                                handleActionUpdateFields={handleActionFieldsUpdate}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* NEW ROW MODAL */}
            <FormModal
                open={modalNewOpen}
                setOpen={setModalNewOpen}
                title="Nuevo usuario"
                btn="Crear usuario"
                fields={handleActionFields}
                initialData={{}}
                onSubmit={handleCreate}
                success="Se ha creado el usuario"
            />
        </AuthenticatedLayout>
    );
}
