import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from "@inertiajs/react";
import TableComp from '@/CustomComponents/TableComp';

export default function Logs() {

    const data = usePage().props.data;

    const columns = {
        'id': 'id',
        'log_name': 'Tipo', 
        'description': 'Descripción',
        'causer_id': 'Id usuario',
        'created_at': 'Fecha'
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-emerald-800">
                    Auditoría
                </h2>
            }
        >
            <Head title="Auditoría" />

            <div className="logs">
                <div>
                    <div className="bg-white rounded-lg">
                        <div className="p-6 text-emerald-900">
                            <TableComp
                                id_table={'log_table'}
                                table_name={'Registro de auditoría'}
                                columns={columns}
                                dataRaw={data}
                                downloadBtns={true}
                                actionBtns={true}
                                useFormatDate={true}
                                showTime={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
