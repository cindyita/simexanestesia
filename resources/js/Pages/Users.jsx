import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from "@inertiajs/react";
import TableComp from '@/CustomComponents/TableComp';
import PrimaryButton from '@/CustomComponents/button/PrimaryButton';

export default function Users() {

    const data = usePage().props.data;

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
                    <div className="bg-white rounded-lg">
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
                        <div className="px-6 pb-6 text-emerald-900">
                            <TableComp
                                id_table={'users_table'}
                                columns={columns}
                                dataRaw={data}
                                downloadBtns={true}
                                actionBtns={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
