import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router, Head, usePage } from "@inertiajs/react";
import { useState } from 'react';
import TableComp from '@/CustomComponents/TableComp';

export default function Logs() {
    if (!usePage().props.menu[8]) return;
    
    const data = usePage().props.data;
    const pageLevel = usePage().props.menu[8]['level'];
    
    const logs = data.data;

    const [currentPage, setCurrentPage] = useState(data.current_page);
        
    const handlePageChange = (page) => {
        setCurrentPage(page);
        router.get('logs', { page }, {});
    };

    const columns = {
        'id': 'id',
        'log_name': 'Tipo', 
        'description': 'Descripción',
        'name': 'Usuario',
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
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6 text-emerald-900">
                            <TableComp
                                id_table={'log_table'}
                                table_name={'Registro de auditoría'}
                                columns={columns}
                                dataRaw={logs}
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
