import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router,Head, usePage } from "@inertiajs/react";
import { useState } from 'react';
import TableComp from '@/CustomComponents/table/TableComp';
import PrimaryButton from '@/CustomComponents/button/PrimaryButton';

import RolePermissionsModal from '@/CustomComponents/modal/RolePermissionsModal';
import RoleSettingsModal from '@/CustomComponents/modal/RoleSettingsModal';

import { FaKey } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import IconButton from '@/CustomComponents/button/IconButton';

export default function Roles() {
    if (!usePage().props.menu[8]) return;
    
    const data = usePage().props.data;
    const pageLevel = usePage().props.menu[8]['level'];

    const [modalKeyOpen, setModalKeyOpen] = useState(false);
    const [modalSettingsOpen, setModalSettingsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(data.current_page);
    const [permissions, setPermissions] = useState([]);
    const [roleName, setRoleName] = useState([]);

    const roles = data.data.map(role => ({
        ...role,
        mode_admin: role.mode_admin === 1 ? 'Sí' : 'No'
    }));


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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-emerald-800">
                    Roles
                </h2>
            }
        >
            <Head title="Roles" />

            <div className="roles">
                <div>
                    <div className="bg-white rounded-lg shadow">
                        <div className="flex justify-between px-6 md:px-10 pt-6">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">
                                    Roles
                                </h3>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* <IconButton onClick={() => setModalSettingsOpen(true)}><FaGear className="w-4 h-4 mx-1" /></IconButton> */}
                                <PrimaryButton>Nuevo rol</PrimaryButton>
                            </div>
                        </div>
                        <div className="px-3 md:px-6 pb-6 text-emerald-900">
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
                            ></TableComp>
                        </div>
                    </div>
                </div>
            </div>

            <RolePermissionsModal show={modalKeyOpen} onClose={() => setModalKeyOpen(false)} roleName={roleName} data={permissions} />
            <RoleSettingsModal show={modalSettingsOpen} onClose={() => setModalSettingsOpen(false)} />

        </AuthenticatedLayout>
    );
}
