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
            header={
                <h2 className="text-xl font-semibold leading-tight text-emerald-800">
                    {isAdmin ? 'Historial de intentos de alumnos' : 'Mi Historial de Intentos'}
                </h2>
            }
        >
            <Head title="Historial" />
            <div className="logs">
                <div>
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6 text-emerald-900">

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