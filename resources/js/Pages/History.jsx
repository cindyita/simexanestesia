import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router, Head, usePage } from "@inertiajs/react";
import { useState } from 'react';
import TableComp from '@/CustomComponents/table/TableComp';

export default function History() {
    const { data, auth } = usePage().props;
    const pageLevel = usePage().props.menu[3]['level'];
    const isAdmin = usePage().props.user['mode_admin'] ? true : false;
    // const user = auth.user;

    const [currentPage, setCurrentPage] = useState(data.current_page);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        router.get('history', { page }, {});
    };
    
    const columns = isAdmin ? {
        'id': 'id',
        'student_name': 'Alumno',
        'exam_name': 'Nombre del examen',
        'score': 'P%',
        'time_used': 'Tiempo(Min)',
        'attempt_number': 'Intento #',
        'completed_at': 'Fecha finalización'
    } : {
        'id': 'id',
        'exam_name': 'Nombre del examen',
        'score': 'P%',
        'time_used': 'Tiempo(Min)',
        'attempt_number': 'Intento #',
        'completed_at': 'Fecha finalización'
    };

    const tableData = data.data || exampleData;

    return (
        <AuthenticatedLayout
            title="Historial"
        >
            <div className="logs">
                <div>
                    <div className="bg-[var(--fontBox)] rounded-lg shadow">
                        <div className="p-3 md:p-6 text-[var(--primary)]">

                            <TableComp
                                id_table={'history_table'}
                                table_name={isAdmin ? 'Historial de intentos de alumnos' : 'Mi Historial de Intentos'}
                                columns={columns}
                                dataRaw={tableData}
                                downloadBtns={true}
                                actionBtns={true}
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