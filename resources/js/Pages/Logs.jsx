import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import { router, Head, usePage } from "@inertiajs/react";
import { useState } from 'react';
import TableComp from '@/CustomComponents/table/TableComp';

export default function Logs() {
    if (!usePage().props.menu[12]) return;
    
    const data = usePage().props.data;
    const pageLevel = usePage().props.menu[12]['level'];
    
    const logs = data.data;

    const [currentPage, setCurrentPage] = useState(data.current_page);
        
    const handlePageChange = (page) => {
        setCurrentPage(page);
        router.get('logs', { page }, {});
    };

    const handleActionView = async (id) => {

        const headerMap = {
            id: "id",
            log_name: "Tipo de log",
            description: "Descripción",
            causer_id: "Id usuario causante",
            name_user_causer: "Usuario causante",
            created_at: "Fecha de creación",
            updated_at: "Última actualización",
            properties: "Detalles"
        };

        try {
            const response = await axios.get('/getLog', {
                params: { id: id }
            });
            const formattedData = response.data.map(item => {
                let newItem = {};
                for (const key in headerMap) {
                    if (item.hasOwnProperty(key)) {
                        newItem[headerMap[key]] = item[key];
                    }
                }
                return newItem;
            });

            return formattedData;
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const columns = {
        'id': 'id',
        'log_name': 'Tipo', 
        'description': 'Descripción',
        'name': 'Usuario',
        'created_at': 'Fecha'
    };

    return (
        <AuthenticatedLayout
            title="Auditoría"
        >

            <div className="logs">
                <div>
                    <div className="bg-[var(--fontBox)] rounded-lg shadow">
                        <div className="p-3 md:p-6 text-[var(--primary)]">
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
                                handleActionDetails={handleActionView}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
