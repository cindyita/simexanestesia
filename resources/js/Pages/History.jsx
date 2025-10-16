import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router, Head, usePage, Link } from "@inertiajs/react";
import { useState } from 'react';
import TableComp from '@/CustomComponents/table/TableComp';
import { useFetchDetails } from '@/hooks/useFetchDetails';
import { IoDocumentText } from 'react-icons/io5';
import axios from 'axios';
import Modal from '@/CustomComponents/modal/Modal';
import { FaArrowLeft, FaCheckCircle, FaTimes } from 'react-icons/fa';

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
                                <><Link href="/history" className='flex gap-2 items-center'><FaArrowLeft /> Volver a vista general</Link></>
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

            <Modal show={modalQuestionsOpen} onClose={() => setModalQuestionsOpen(false)}>
                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-[var(--primary)]">
                            Preguntas del examen
                        </h3>
                        <button onClick={() => setModalQuestionsOpen(false)} className="text-[var(--secondary)] hover:text-[var(--primary)]">
                            <FaTimes />
                        </button>
                    </div>
            
                    <div className="space-y-6">
                        {viewQuestions.length > 0 && viewQuestions.map((question, index) => {
                        const options = JSON.parse(question.options);
                        const correctAnswers = JSON.parse(question.correct_answers);
                        const userAnswer = answers[question.id];
                        const isUserCorrect = userAnswer !== undefined && correctAnswers.includes(userAnswer);
                        
                        return (
                            <div key={question.id} className={`border rounded-lg p-4 ${
                                userAnswer !== undefined 
                                    ? isUserCorrect 
                                        ? 'border-green-500 bg-green-50' 
                                        : 'border-red-500 bg-red-50'
                                    : 'border-[var(--secondary)] bg-[var(--font)]'
                            }`}>
    
                            <div id={`question_${question.id}`} className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-[var(--primary)] bg-[var(--fontBox)] px-2 py-1 rounded">
                                        Pregunta {index + 1}
                                    </span>
                                    {userAnswer !== undefined && (
                                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                            isUserCorrect 
                                                ? 'bg-green-200 text-green-800' 
                                                : 'bg-red-200 text-red-800'
                                        }`}>
                                            {isUserCorrect ? '✓ Correcta' : '✗ Incorrecta'}
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs text-gray-500 capitalize">
                                    {questionType(question.question_type)}
                                </span>
                            </div>
    
                            <h4 className="font-medium text-gray-900 mb-4">
                                {question.question}
                            </h4>
    
                            <div className="space-y-2 mb-4">
                                {options.map((option, optionIndex) => {
                                const isCorrect = correctAnswers.includes(optionIndex);
                                const isUserSelection = userAnswer === optionIndex;
                                
                                return (
                                    <div 
                                    key={optionIndex}
                                    className={`p-3 rounded-md border ${
                                        isCorrect 
                                            ? 'bg-green-100 border-green-500 font-medium' 
                                            : isUserSelection
                                                ? 'bg-red-100 border-red-500'
                                                : 'bg-[var(--fontBox)] border-gray-200'
                                    }`}
                                    >
                                    <div className="flex items-center justify-between">
                                        <span className={isUserSelection && !isCorrect ? 'line-through' : ''}>
                                            {option}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {isUserSelection && (
                                                <span className={`font-medium text-sm ${
                                                    isCorrect ? 'text-green-700' : 'text-red-700'
                                                }`}>
                                                    Tu respuesta
                                                </span>
                                            )}
                                            {isCorrect && (
                                                <span className="text-green-700 font-medium text-sm">
                                                    <FaCheckCircle />
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    </div>
                                );
                                })}
                            </div>
    
                            {question.explanation && (
                                <div className="bg-blue-50 border-l-4 border-[var(--secondary)] p-3 rounded-r">
                                <div className="flex items-start">
                                    
                                    <div className="flex-shrink-0">
                                    <span className="text-[var(--secondary)] font-bold text-sm">
                                        Explicación:
                                    </span>
                                    <span className="ml-1 text-sm text-[var(--secondary)]">
                                        {question.explanation}
                                    </span>
                                    </div>
                                    
                                </div>
                                </div>
                            )}
                            </div>
                        );
                        })}
    
                    </div>
                </div>
            </Modal>

        </AuthenticatedLayout>
    );
}