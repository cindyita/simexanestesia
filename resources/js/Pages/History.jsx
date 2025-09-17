import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router, Head, usePage } from "@inertiajs/react";
import { useState } from 'react';
import TableComp from '@/CustomComponents/table/TableComp';
import { useFetchDetails } from '@/hooks/useFetchDetails';

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

    // HANDLE ACTIONS -----------------
    const handleDelete = async (id) => {
        return new Promise((resolve, reject) => {
            router.visit('/history', {
                method: 'post',
                data: {
                    id_delete: id
                },
                onSuccess: () => resolve(id),
                onError: (errors) => reject(errors),
            });
        });
    }

    const { fetchDetails } = useFetchDetails();

    const handleDetails = async (id, useHeaders = true) => {
        if (useHeaders) {
            const headerMap = {
                id: "id",
                student_name: "Usuario",
                id_exam: "Id del examen",
                exam_name: "Examen",
                attempt_number: "Intento #",
                status: "Estado",
                started_at: "Iniciado el",
                completed_at: "Terminado el",
                time_used: "Tiempo usado",
                score: "Puntuación %",
                correct_answers: "Respuestas correctas",
                passed: "Aprobado",
                answers: "Respuestas",
                question_order: "Órden de las preguntas",
                ip_address: "IP",
                metadata: "metadata"
            };
            return await fetchDetails("/getHistory", { id }, headerMap);
        } else {
            return await fetchDetails("/getHistory", { id });
        }
    };

    //---------------------------------

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
                                handleActionDelete={handleDelete}
                                handleActionDetails={handleDetails}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}