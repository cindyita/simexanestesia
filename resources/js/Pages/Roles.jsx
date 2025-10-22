import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router,Head, usePage } from "@inertiajs/react";
import { useState } from 'react';
import TableComp from '@/CustomComponents/table/TableComp';
import PrimaryButton from '@/CustomComponents/button/PrimaryButton';

import RolePermissionsModal from '@/CustomComponents/modal/RolePermissionsModal';
import RoleSettingsModal from '@/CustomComponents/modal/RoleSettingsModal';

import { FaKey, FaTimes } from "react-icons/fa";

import { useFetchDetails } from "@/hooks/useFetchDetails";
import { useFormValidation } from '@/hooks/useFormValidation';

import FormModal from '@/CustomComponents/modal/FormModal';
import { toast } from 'sonner';

export default function Roles() {
    if (!usePage().props.menu[8]) return;
    
    const data = usePage().props.data;
    const pageLevel = usePage().props.menu[8]['level'];

    const isAdmin = usePage().props.user['mode_admin'] ? true : false;

    const [modalKeyOpen, setModalKeyOpen] = useState(false);
    const [modalSettingsOpen, setModalSettingsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(data.current_page);
    const [permissions, setPermissions] = useState([]);
    const [idRol, setIdRol] = useState([]);
    const [roleName, setRoleName] = useState([]);
    const [modalNewOpen, setModalNewOpen] = useState(false);

    const [roles, setRoles] = useState(
        data.data.map(role => ({
            ...role,
            mode_admin: role.mode_admin === 1 ? 'Sí' : 'No'
        }))
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
        router.get('roles', { page }, {});
    };

    const columns = {
        'id_rol': 'id',
        'rol_name': 'Nombre',
        'mode_admin': 'Admin',
        'total_menus': 'Permisos',
        'total_levels': 'Niveles'
    };

    const permissionAction = [{
        label: "Permisos",
        icon: <FaKey className="mr-3 h-4 w-4 text-yellow-400 group-hover:text-yellow-500" />,
        callback: async (item) => {
            setModalKeyOpen(true);
            setIdRol(item.id);
            setRoleName(item.Nombre);
            try {
                const response = await axios.post('/getRolPermission', {
                    id: item.id
                });
                setPermissions(response.data.permissions || []);
            } catch (error) {
                console.error("Error al obtener permisos:", error);
            }
        }
    }];

    const handleSavePermissions = (permissions, id_rol) => {
        router.visit('/roles', {
            method: 'post',
            data: {
                permissions: permissions,
                id_rol: id_rol,
                page: currentPage
            },
        });
    }

    // HANDLE ACTIONS ----------------------------
    let handleDelete = async (id) => {
        if (id == 1) {
            return Promise.reject(["El superadmin no se puede eliminar"]);
        }

        return new Promise((resolve, reject) => {
            router.visit('/roles', {
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
                mode_admin: "Modo administrador",
                created_at: "Fecha de creación",
                updated_at: "Última actualización"
            };
            return await fetchDetails("/getRol", { id }, headerMap);
        } else {
            return await fetchDetails("/getRol", { id });
        }
    };

    const handleActionFields = {
        id: { label: "id", type: "number", editable: false,show: false },
        name: { label: "Nombre", type: "text", editable: true, show: true , required: true},
        mode_admin: { label: "Modo administrador", type: "select", options: ["Si", "No"], editable: true, show: true, required: true }
    };
    const { validateForm } = useFormValidation(handleActionFields);

    const handleUpdate = async (form) => {

        const errors = validateForm(form);

        if (form.id === 1) {
            return Promise.reject(["El superadmin no se puede modificar"]);
        }

        if (Object.keys(errors).length > 0) {
            console.error(errors);
            return Promise.reject(errors);
        }

        return new Promise((resolve, reject) => {
            router.visit('/roles', {
                method: 'post',
                data: { update: form },
                onSuccess: () => resolve(form),
                onError: (errors) => reject(errors),
            });
        });

    };

    const handleCreate = async (form) => {

        const errors = validateForm(form);

        if (Object.keys(errors).length > 0) {
            console.error(errors);
            return Promise.reject(errors);
        }

        return new Promise((resolve, reject) => {
            router.visit('/roles', {
                method: 'post',
                data: { create: form },
                onSuccess: () => resolve(form),
                onError: (errors) => reject(errors),
            });
        });
    };

    if (!isAdmin) {
        handleDelete = "";
    }

    return (
        <AuthenticatedLayout
            title="Roles"
        >

            <div className="roles">
                <div>
                    <div className="bg-[var(--fontBox)] rounded-lg shadow">
                        <div className="flex justify-between px-6 md:px-10 pt-6">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">
                                    Roles
                                </h3>
                            </div>
                            <div className="flex items-center gap-2">
                                {isAdmin && <PrimaryButton onClick={() => setModalNewOpen(true)}>Nuevo rol</PrimaryButton>}
                            </div>
                        </div>
                        <div className="px-3 md:px-6 pb-6 text-[var(--primary)]">
                            <TableComp
                                id_table={'roles_table'}
                                columns={columns}
                                dataRaw={roles}
                                downloadBtns={true}
                                actionBtns={true}
                                customActions={permissionAction}
                                currentPage={currentPage}
                                totalPages={data.last_page}
                                onPageChange={handlePageChange}
                                pageLevel={pageLevel}
                                handleActionDelete={handleDelete}
                                handleActionDetails={handleDetails}
                                handleActionUpdate={handleUpdate}
                                handleActionUpdateFields={handleActionFields}
                            ></TableComp>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            <RolePermissionsModal
                show={modalKeyOpen}
                onClose={() => setModalKeyOpen(false)}
                idRol= {idRol}
                roleName={roleName}
                data={permissions}
                onSave={handleSavePermissions}
            />
            <RoleSettingsModal show={modalSettingsOpen} onClose={() => setModalSettingsOpen(false)} />

            {/* NEW ROW MODAL */}
            <FormModal
                open={modalNewOpen}
                setOpen={setModalNewOpen}
                title="Nuevo rol"
                btn="Crear rol"
                fields={handleActionFields}
                initialData={{}}
                onSubmit={handleCreate}
                success="Se ha creado el rol"
            />

        </AuthenticatedLayout>
    );
}
