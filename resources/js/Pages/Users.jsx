import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router, Head, usePage } from "@inertiajs/react";
import { useState } from 'react';
import TableComp from '@/CustomComponents/table/TableComp';
import PrimaryButton from '@/CustomComponents/button/PrimaryButton';

export default function Users() {
    if (!usePage().props.menu[7]) return;

    const data = usePage().props.data;
    const pageLevel = usePage().props.menu[7]['level'];

    const [currentPage, setCurrentPage] = useState(data.current_page);
    
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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-emerald-800">
                    Usuarios
                </h2>
            }
        >
            <Head title="Usuarios" />

            <div className="users">
                <div>
                    <div className="bg-white rounded-lg shadow">
                        <div className="flex justify-between px-6 md:px-10 pt-6">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">
                                    Usuarios
                                </h3>
                            </div>
                            <div>
                                <PrimaryButton>Nuevo usuario</PrimaryButton>
                            </div>
                        </div>
                        <div className="px-3 md:px-6 pb-6 text-emerald-900">
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
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
