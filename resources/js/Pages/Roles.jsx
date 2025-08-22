import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from "@inertiajs/react";
import TableComp from '@/Components/TableComp';

export default function Roles() {

    const data = usePage().props.data;

    const columns = {
        'id_rol': 'id',
        'rol_name': 'Nombre',
        'total_menus': 'Permisos',
        'total_levels': 'Niveles'
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-emerald-800">
                    Roles
                </h2>
            }
        >
            <Head title="Roles" />

            <div className="logs">
                <div>
                    <div className="bg-white rounded-lg">
                        <div className="p-6 text-emerald-900">
                            <TableComp
                                id_table={'roles_table'}
                                table_name={'Roles'}
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
