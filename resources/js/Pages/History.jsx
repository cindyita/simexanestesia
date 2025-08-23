import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from "@inertiajs/react";
import TableComp from '@/Components/TableComp';

export default function History() {

    // const data = usePage().props.data;

    const columns = {
        'id': 'id',
        'name': 'Nombre',
    };

    const data = [{
        'id': 0,
        'name': 'Nombre'
    }];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-emerald-800">
                    Historial
                </h2>
            }
        >
            <Head title="Historial" />

            <div className="logs">
                <div>
                    <div className="bg-white rounded-lg">
                        <div className="p-6 text-emerald-900">
                            <TableComp
                                id_table={'history_table'}
                                table_name={'Historial de intentos'}
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
