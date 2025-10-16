import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router, Head, usePage, Link } from "@inertiajs/react";
import { useState } from 'react';
import TableComp from '@/CustomComponents/table/TableComp';
import { useFetchDetails } from '@/hooks/useFetchDetails';
import { IoDocumentText } from 'react-icons/io5';
import axios from 'axios';
import Modal from '@/CustomComponents/modal/Modal';
import { FaArrowLeft, FaCheckCircle, FaTimes } from 'react-icons/fa';
import ViewQuestionsModal from '@/CustomComponents/modal/ViewQuestionsModal';

export default function History() {
    const { data, auth } = usePage().props;
    const nameExam = usePage().props.nameExam;

    const pageLevel = usePage().props.menu[3]['level'];
    const isAdmin = usePage().props.user['mode_admin'] ? true : false;
    // const user = auth.user;

    const [modalQuestionsOpen, setModalQuestionsOpen] = useState(false);
    const [viewQuestions, setViewQuestions] = useState([]);
    const [answers, setAnswers] = useState({});

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
            const headerMapCommons = {
                id: "id",
                exam_name: "Examen",
                attempt_number: "Intento #",
                status: "Estado",
                started_at: "Iniciado el",
                completed_at: "Terminado el",
                time_used: "Tiempo usado",
                score: "Puntuación %",
                passed: "Aprobado"
            }
            const headerMap = isAdmin 
                ? {
                ...headerMapCommons, ...{
                    student_name: "Usuario",
                    id_exam: "Id del examen",
                    correct_answers: "Respuestas correctas",
                    answers: "Respuestas",
                    // question_order: "Órden de las preguntas",
                    ip_address: "IP",
                    metadata: "metadata"
                } } : headerMapCommons;
            
            return await fetchDetails("/getHistory", { id }, headerMap);
        } else {
            return await fetchDetails("/getHistory", { id });
        }
    };

    const questionType = (type) => {
        switch (type) {
        case 'multiple_choice':
            return "Opción múltiple";
        case 'true_false':
            return "Verdadero/Falso";
        case 'essay':
            return "Desarrollo";
        case 'mixed':
            return "Mixto";
        }
    }

    const viewAnswersAction = [{
        label: "Ver respuestas",
        icon: <IoDocumentText className="mr-3 h-4 w-4 text-primary group-hover:text-secondary" />,
        callback: async (item) => {
            const history = await axios.get('/getHistory', { params: { id: item.id } });
            setAnswers(JSON.parse(history.data[0].answers));

            const questions = await axios.get('/getExamQuestions', { params: { id: history.data[0].id_exam } });
            
            setViewQuestions(questions.data);
            setModalQuestionsOpen(true);
        }
    }];

    //---------------------------------

    const titleHistory = nameExam ? `Historial de exámen: ${nameExam}` : (isAdmin ? 'Historial de intentos de alumnos' : 'Mi Historial de Intentos');

    return (
        <AuthenticatedLayout
            title="Historial"
        >
            <div className="history">
                <div>
                    <div className="bg-[var(--fontBox)] rounded-lg shadow">
                        <div className="p-3 md:p-6 text-[var(--primary)]">
                            
                            {
                                nameExam &&
                                <>
                                    <div className="flex justify-between p-2">
                                        <Link href="/exams" className='flex gap-2 items-center'>
                                            <FaArrowLeft /> Volver a exámenes
                                        </Link>
                                        <Link href="/history" className='flex gap-2 items-center'>
                                            Volver a vista general
                                        </Link>
                                    </div>
                                </>
                            }

                            <TableComp
                                id_table={'history_table'}
                                table_name={titleHistory}
                                columns={columns}
                                dataRaw={tableData}
                                downloadBtns={true}
                                actionBtns={true}
                                customActions={viewAnswersAction}
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

            <ViewQuestionsModal
                show={modalQuestionsOpen}
                onClose={() => setModalQuestionsOpen(false)}
                questions={viewQuestions}
                answers={answers}
                questionType={(type) =>
                    type === "multiple_choice" ? "Opción múltiple" : (type === "true_false" ? "Verdadero/Falso" : "")
                }
            />

        </AuthenticatedLayout>
    );
}