import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from "@inertiajs/react";
import { useState } from 'react';
import TableComp from '@/CustomComponents/TableComp';
import PrimaryButton from '@/CustomComponents/button/PrimaryButton';

import RolePermissionsModal from '@/CustomComponents/RolePermissionsModal';

import { FaKey } from "react-icons/fa";

export default function Roles() {

    const [modalKeyOpen, setModalKeyOpen] = useState(false);

    const data = usePage().props.data;

    const columns = {
        'id_rol': 'id',
        'rol_name': 'Nombre',
        'total_menus': 'Permisos',
        'total_levels': 'Niveles'
    };

    const permissionAction = [{
        label: "Permisos",
        icon: <FaKey className="mr-3 h-4 w-4 text-yellow-400 group-hover:text-yellow-500" />,
        callback: () => setModalKeyOpen(true)
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
                    <div className="bg-white rounded-lg">
                        <div className="flex justify-between px-6 md:px-10 pt-6">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">
                                    Roles
                                </h3>
                            </div>
                            <div>
                                <PrimaryButton>Nuevo rol</PrimaryButton>
                            </div>
                        </div>
                        <div className="px-6 pb-6 text-emerald-900">
                            <TableComp
                                id_table={'roles_table'}
                                columns={columns}
                                dataRaw={data}
                                downloadBtns={true}
                                actionBtns={true}
                                customActions={permissionAction}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <RolePermissionsModal show={modalKeyOpen} onClose={() => setModalKeyOpen(false)} screens={['Dashboard','Exámenes','Historial','Recursos','Usuarios','Roles','Auditoría']} roleName={'Ejemplo'} />

        </AuthenticatedLayout>
    );
}
