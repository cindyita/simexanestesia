import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ExamLayout from '@/Layouts/ExamLayout';
import { FaClock, FaQuestionCircle, FaCheckCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import PrimaryButton from '@/CustomComponents/button/PrimaryButton';
import SecondaryButton from '@/CustomComponents/button/SecondaryButton';
import TertiaryButton from '@/CustomComponents/button/TertiaryButton';
import IconButton from '@/CustomComponents/button/IconButton';
import MiniButton from '@/CustomComponents/button/MiniButton';
import { toast } from 'sonner';
import Modal from '@/CustomComponents/modal/Modal';
import axios from 'axios';
import ViewQuestionsModal from '@/CustomComponents/modal/ViewQuestionsModal';

export default function StartExam () {
    const exam = usePage().props.data;

    const [statusExam, setStatusExam] = useState(exam.last_attempt.status ?? null);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    // check time limit 0
    const [timeRemaining, setTimeRemaining] = useState(exam.time_limit == 0 ? 0 : exam.time_limit * 60);
    const [examStarted, setExamStarted] = useState(false);
    const [examCompleted, setExamCompleted] = useState(false);
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
    const [actualHistory, setActualHistory] = useState(null);

    const [modalQuestionsOpen, setModalQuestionsOpen] = useState(false);
    const [viewQuestions, setViewQuestions] = useState([]);

    const hasTimeLimit = exam.time_limit > 0;

    const openModalViewAnswers = async () => {
        const questions = await axios.get('/getExamQuestions', { params: { id: exam.id } });
        setViewQuestions(questions.data);
        setModalQuestionsOpen(true);
    }

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

    const checkStatus = async () => {
        const res = await axios.post('/getExamStatus', {
                id: exam.id,
                started_at: exam.last_attempt.started_at,
                time_limit: exam.time_limit
        });
        if (res.data.status === "expired" && hasTimeLimit) {
            setStatusExam("expired");
            settingHistory();
            handleSubmitExam();
        } else {
            if (hasTimeLimit) {
                setTimeRemaining((res.data.time_remaining));
            } else {
                setTimeRemaining((res.data.time_used));
            }
            startExam();
        }
    }

    useEffect(() => {
        if (exam.last_attempt && exam.last_attempt.status === "in_progress") {
            checkStatus();
        }
    }, [exam]); 

    // Timer countdown
    useEffect(() => {
        let timer;
        if (examStarted && !examCompleted) {
            timer = setInterval(() => {
                setTimeRemaining(prev => {
                    if (hasTimeLimit) {
                        if (prev <= 1) {
                            setExamCompleted(true);
                            handleSubmitExam();
                            return 0;
                        }
                        return prev - 1;
                    } else {
                        // no limit time
                        return prev + 1;
                    }
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [examStarted, examCompleted, hasTimeLimit]);

    const formatTime = (seconds) => {
        const totalSeconds = Math.floor(seconds);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };


    const handleAnswerChange = (questionId, selectedOption) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: selectedOption
        }));
    };

    useEffect(() => {
        updateAnswers();
    }, [answers]);

    const goToQuestion = (index) => {
        setCurrentQuestionIndex(index);
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < exam.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const previousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmitExam = async () => {
        // CHECK TIME USED
        const timeUsed = hasTimeLimit 
            ? (exam.time_limit * 60) - timeRemaining 
            : timeRemaining;

        const res = await axios.post('/finishExam', {
            id: actualHistory,
            completehistory: {
                'time_used': timeUsed,
                'answers': answers
            },
            minScore: exam.passing_score
        });
        // console.log(res);
        toast.success("El exámen finalizó");
        setExamCompleted(true);
        setShowConfirmSubmit(false);
    };

    const settingHistory = async () => {
        const history = await axios.post(`/createHistory`, {
            id: exam.id,
            numAttempt: exam.last_attempt.attempt_number,
            newhistory: {
                status: 'in_progress'
            }
        });
        setActualHistory(history.data.id);
        setAnswers(JSON.parse(history.data.answers));
        return history;
    }

    const startExam = async () => {
        const history = await settingHistory();
        setAnswers(JSON.parse(history.data.answers));
        setExamStarted(true);
    };

    const updateAnswers = async () => {
        // CHECH TIME USED
        const timeUsed = hasTimeLimit 
            ? (exam.time_limit * 60) - timeRemaining 
            : timeRemaining;

        await axios.post(`/updateHistory`, {
            id: actualHistory,
            updatehistory: {
                'time_used': timeUsed,
                'answers': answers
            }
        });
    }

    const getAnsweredQuestions = () => {
        return Object.keys(answers).length;
    };

    const currentQuestion = exam.questions[currentQuestionIndex];
    const options = currentQuestion ? JSON.parse(currentQuestion.options) : [];

    if (!examStarted) {
        return (
            <ExamLayout name={exam.name}>
                <div className="max-w-4xl mx-auto p-6">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="text-center">
                            <FaQuestionCircle className="mx-auto text-6xl text-[var(--primary)] mb-4" />
                            <h1 className="text-3xl font-bold mb-4">{exam.name}</h1>
                            <p className="text-[var(--secondary)] mb-8">{exam.description}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-[var(--font)] p-4 rounded-lg">
                                <h3 className="font-semibold text-[var(--primary)] mb-2">Información del Examen</h3>
                                <ul className="space-y-2 text-sm text-[var(--primary)]">
                                    <li><strong>Materia:</strong> {exam.subject}</li>
                                    <li><strong>Tipo:</strong> {exam.exam_type}</li>
                                    <li><strong>Dificultad:</strong> {exam.difficulty}</li>
                                    <li><strong>Preguntas:</strong> {exam.total_questions}</li>
                                    <li><strong>Tiempo límite:</strong> {hasTimeLimit ? `${exam.time_limit} minutos` : 'Sin límite'}</li>
                                    <li><strong>Puntuación mínima:</strong> {exam.passing_score}%</li>
                                </ul>
                            </div>

                            <div className="bg-[var(--fontBox)] border border-[var(--tertiary)] p-4 rounded-lg">
                                <h3 className="font-semibold text-[var(--secondary)] mb-2">Instrucciones</h3>
                                <ul className="space-y-2 text-sm text-[var(--secondary)]">
                                    <li>• Lee cada pregunta cuidadosamente</li>
                                    <li>• Selecciona la respuesta que consideres correcta</li>
                                    <li>• Puedes navegar entre preguntas usando los botones</li>
                                    {hasTimeLimit && <li>• El tiempo comenzará a contar al iniciar</li>}
                                    {!hasTimeLimit && <li>• Se registrará el tiempo que tardes en completar el examen</li>}
                                    <li>• Asegúrate de responder todas las preguntas</li>
                                </ul>
                            </div>
                        </div>

                        

                        <div className="flex flex-col gap-2 items-center text-center justify-center">
                            
                            {statusExam && statusExam == 'in_progress' && hasTimeLimit ?
                                    <><strong>Tiempo restante: {formatTime(timeRemaining)}</strong></>
                                    : null
                            }

                            {statusExam == "expired" && hasTimeLimit ? <>El tiempo del exámen expiró</> : null}
                            
                            <PrimaryButton
                                onClick={startExam}
                                className="py-3 px-8"
                                disabled={statusExam == "expired" && hasTimeLimit ? 'disabled' : null}
                            >
                                {statusExam && statusExam == 'in_progress' ?
                                    <>Continuar Exámen</>
                                    : <>Iniciar Exámen</>
                                }
                            </PrimaryButton>

                        </div>
                    </div>
                </div>
            </ExamLayout>
        );
    }

    if (examCompleted) {
        return (
            <ExamLayout name={exam.name}>
                <div className="max-w-4xl mx-auto p-6">
                    <div className="box rounded-lg shadow p-8 text-center">
                        <FaCheckCircle className="mx-auto text-6xl mb-4" />
                        <h1 className="text-3xl font-bold mb-4">¡Examen Completado!</h1>
                        <p className="mb-1"><strong>Exámen: </strong>{exam.name}</p>
                        <p className="text-gray-600 mb-4">Has completado el examen exitosamente.</p>
                        <p className="text-sm text-gray-500 mb-4">
                            Respondiste {getAnsweredQuestions()} de {exam.total_questions} preguntas
                        </p>
                        <div className="flex gap-3 justify-center items-center flex-col md:flex-row">
                            {
                                exam.show_results && (
                                    <SecondaryButton onClick={() => openModalViewAnswers()}>
                                        Ver respuestas
                                    </SecondaryButton>
                                )
                            }
                            
                            <Link href="/exams">   
                                <PrimaryButton className="flex items-center gap-2 text-[var(--primary)]">
                                    Volver a Exámenes
                                </PrimaryButton>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* VIEW QUESTIONS MODAL */}
                {
                    exam.show_results && (
                        <ViewQuestionsModal
                            show={modalQuestionsOpen}
                            onClose={() => setModalQuestionsOpen(false)}
                            questions={viewQuestions}
                            answers={answers}
                            questionType={(type) =>
                                type === "multiple_choice" ? "Opción múltiple" : (type === "true_false" ? "Verdadero/Falso" : "")
                            }
                        />
                    )
                }

            </ExamLayout>
        );
    }
    
    return (
        <ExamLayout name={exam.name}>
            <div className="max-w-6xl mx-auto p-4 pt-2">
                <div className="box rounded-lg shadow p-4 mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            
                            <div className="text-gray-600">
                                Pregunta {currentQuestionIndex + 1} de {exam.questions.length}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Respondidas:</span>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                                {getAnsweredQuestions()}/{exam.questions.length}
                            </span>
                        </div>
                        <div className="flex items-center justify-end text-[var(--primary)]">
                            <FaClock className="mr-2" />
                            <span className="font-mono text-lg font-bold">
                                {hasTimeLimit ? formatTime(timeRemaining) : formatTime(timeRemaining)}
                            </span>
                            {!hasTimeLimit && (
                                <span className="text-xs text-gray-500 ml-2">transcurrido</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* QUESTION NAV */}
                    <div className="lg:col-span-1">
                        <div className="box shadow rounded-lg p-4 sticky top-6">
                            <div className="flex flex-col gap-2">
                                {exam.questions.map((question, index) => (
                                    <button
                                        key={question.id}
                                        onClick={() => goToQuestion(index)}
                                        className={`p-2 rounded-lg text-sm font-medium transition-colors duration-200 flex justify-center ${
                                            index === currentQuestionIndex
                                                ? 'bg-[var(--primary)] text-white'
                                                : answers[question.id]
                                                ? 'bg-[var(--font)] text-[var(--primary)] border border-[var(--primary)]'
                                                : 'bg-[var(--font)] text-gray-500 hover:bg-[var(--secondary)]'
                                        }`}
                                    >
                                        Pregunta {index + 1}
                                    </button>
                                ))}
                            </div>
                            
                            <SecondaryButton
                                onClick={() => setShowConfirmSubmit(true)}
                                className="w-full mt-4 py-2 px-4 flex justify-center"
                                disabled={getAnsweredQuestions() === 0}
                            >
                                Finalizar
                            </SecondaryButton>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="box shadow rounded-lg p-6">
                            {currentQuestion && (
                                <>
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-sm font-semibold text-[var(--secondary)]">
                                                Pregunta {currentQuestionIndex + 1}
                                            </h4>
                                            <span className="text-sm text-gray-500 capitalize bg-gray-100 px-3 py-1 rounded">
                                                {currentQuestion.question_type.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <p className="text-lg text-bold">
                                            {currentQuestion.question}
                                        </p>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        {options.map((option, optionIndex) => (
                                            <label
                                                key={optionIndex}
                                                className={`block p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                                                    answers[currentQuestion.id] === optionIndex
                                                        ? 'border-[var(--primary)] bg-[var(--font)] ring-2 ring-[var(--primary)]'
                                                        : 'border border-[var(--tertiary)]'
                                                }`}
                                            >
                                                <div className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name={`question-${currentQuestion.id}`}
                                                        value={optionIndex}
                                                        checked={answers[currentQuestion.id] === optionIndex}
                                                        onChange={() => handleAnswerChange(currentQuestion.id, optionIndex)}
                                                        className="mr-3 text-[var(--primary)] focus:ring-[var(--primary)]"
                                                    />
                                                    <span>{option}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>

                                    <div className="flex justify-between">
                                        <PrimaryButton
                                            onClick={previousQuestion}
                                            disabled={currentQuestionIndex === 0}
                                            className="px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            ← Anterior
                                        </PrimaryButton>
                                        <div>
                                            {currentQuestionIndex !== exam.questions.length - 1 ?<PrimaryButton
                                                onClick={nextQuestion}
                                                disabled={currentQuestionIndex === exam.questions.length - 1}
                                                className="px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Siguiente →
                                            </PrimaryButton> :
                                                <SecondaryButton
                                                    onClick={() => setShowConfirmSubmit(true)}
                                                    className="px-4 py-2"
                                                    disabled={getAnsweredQuestions() === 0}
                                                >
                                                    Finalizar
                                                </SecondaryButton>
                                            }
                                        </div>
                                        
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Modals */}
                {showConfirmSubmit && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                            <div className="flex items-center mb-4">
                                <h3 className="text-lg font-semibold">Confirmar envío</h3>
                            </div>
                            <p className="text-gray-600 mb-4">
                                ¿Estás seguro de que quieres finalizar el examen? 
                                Has respondido {getAnsweredQuestions()} de {exam.questions.length} preguntas.
                            </p>
                            <div className="flex space-x-3 justify-between">
                                <SecondaryButton
                                    onClick={() => setShowConfirmSubmit(false)}
                                >
                                    Cancelar
                                </SecondaryButton>
                                <PrimaryButton
                                    onClick={handleSubmitExam}
                                >
                                    Finalizar examen
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </ExamLayout>
    );

}