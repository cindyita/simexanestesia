import React, { useRef, useState } from 'react';
import { 
  FaPlus, 
  FaTrash, 
  FaEdit, 
  FaSave, 
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaToggleOn,
  FaToggleOff
} from 'react-icons/fa';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, router, usePage } from '@inertiajs/react';
import MiniButton from '@/CustomComponents/button/MiniButton';
import TextInput from '@/CustomComponents/form/TextInput';
import InputInputLabel from '@/CustomComponents/form/InputLabel';
import InputLabel from '@/CustomComponents/form/InputLabel';
import PrimaryButton from '@/CustomComponents/button/PrimaryButton';
import SecondaryButton from '@/CustomComponents/button/SecondaryButton';
import Textarea from '@/CustomComponents/form/Textarea';
import Select from '@/CustomComponents/form/Select';
import axios from 'axios';
import { toast } from 'sonner';

const CreateExam = () => {
    const subjects = usePage().props.subjects;
    const edit = usePage().props.edit ?? null;
    const isAdmin = usePage().props.user['mode_admin'];

    if (!isAdmin) return "No tienes permisos para ver esta página";

    // INFO CREATE OR UPDATE STATE
    const [examData, setExamData] = useState( edit ? {
        id: (edit.id ?? null),
        name: (edit.name ?? ''),
        description: (edit.description ?? ''),
        subject_id: (edit.id_subject ?? ''),
        time_limit: (edit.time_limit ?? 0),
        exam_type: (edit.exam_type ?? 'mixed'),
        difficulty: (edit.difficulty ?? 'basic'),
        passing_score: (edit.passing_score ?? 70),
        max_attempts: (edit.max_attempts ?? 1),
        shuffle_questions: (edit.shuffle_questions ?? false),
        shuffle_options: (edit.shuffle_options ?? false),
        show_results: (edit.show_results ?? false),
        is_active: (edit.is_active ?? 1)
    } : {
        id: (null),
        name: (''),
        description: (''),
        subject_id: (''),
        time_limit: (0),
        exam_type: ('mixed'),
        difficulty: ('basic'),
        passing_score: (70),
        max_attempts: (1),
        shuffle_questions: (false),
        shuffle_options: (false),
        show_results: (false),
        is_active: (1)
    });

    // QUESTIONS STATE
    const [questions, setQuestions] = useState(edit ? (edit.questions ?? []).map(q => ({
        ...q,
        options: JSON.parse(q.options),
        correct_answers: JSON.parse(q.correct_answers),
    })) : []);
    const [currentQuestion, setCurrentQuestion] = useState({
        question: '',
        question_type: 'multiple_choice',
        options: ['', '', '', ''],
        correct_answers: [],
        explanation: '',
        order: 0
    });

    const questionForm = useRef(null);

    // STEP STATE
    const [activeStep, setActiveStep] = useState(1); // 1: Info, 2: Question
    const [editingQuestionIndex, setEditingQuestionIndex] = useState(-1);
    const [showQuestionForm, setShowQuestionForm] = useState(false);

    // HANDLES
    const handleExamChange = (field, value) => {
        setExamData(prev => ({
        ...prev,
        [field]: value
        }));
    };

    const handleQuestionChange = (field, value) => {
        setCurrentQuestion(prev => ({
        ...prev,
        [field]: value
        }));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...currentQuestion.options];
        newOptions[index] = value;
        setCurrentQuestion(prev => ({
        ...prev,
        options: newOptions
        }));
    };

    const handleCorrectAnswerToggle = (index) => {
        const currentCorrect = [...currentQuestion.correct_answers];
        const optionIndex = currentCorrect.indexOf(index);
        
        if (currentQuestion.question_type === 'multiple_choice' || currentQuestion.question_type === 'true_false') {
            // MULTIPLE CHOICE 1 ANSWER
            setCurrentQuestion(prev => ({
                ...prev,
                correct_answers: [index]
            }));
        } else {
            // MULTIPLE ANSWER
            if (optionIndex > -1) {
                currentCorrect.splice(optionIndex, 1);
            } else {
                currentCorrect.push(index);
            }
            setCurrentQuestion(prev => ({
                ...prev,
                correct_answers: currentCorrect
            }));
        }
    };

    // CREATE OR UPDATE QUESTION
    const saveQuestion = () => {
        if (!currentQuestion.question.trim()) {
            toast.error('La pregunta no puede estar vacía');
            return;
        }

        if (currentQuestion.correct_answers.length === 0) {
            toast.error('Debe seleccionar al menos una respuesta correcta');
            return;
        }

        const questionToSave = {
            ...currentQuestion,
            order: editingQuestionIndex >= 0 ? questions[editingQuestionIndex].order : questions.length + 1
        };

        if (editingQuestionIndex >= 0) {
            // UPDATE
            const updatedQuestions = [...questions];
            updatedQuestions[editingQuestionIndex] = questionToSave;
            setQuestions(updatedQuestions);
            setEditingQuestionIndex(-1);
        } else {
            // ADD
            setQuestions(prev => [...prev, questionToSave]);
        }

        // CLEAN FORM
        setCurrentQuestion({
            question: '',
            question_type: 'multiple_choice',
            options: ['', '', '', ''],
            correct_answers: [],
            explanation: '',
            order: 0
        });
        setShowQuestionForm(false);
    };

    // CREATE ANSWER
    const createAnswer = () => {
        setCurrentQuestion({
            question: '',
            question_type: 'multiple_choice',
            options: ['', '', '', ''],
            correct_answers: [],
            explanation: '',
            order: 0
        });
        setEditingQuestionIndex(-1);
        setShowQuestionForm(true);
        questionForm.current?.scrollIntoView({ behavior: "smooth" });
    }

    // UPDATE ANSWER
    const editQuestion = (index) => {
        setCurrentQuestion(questions[index]);
        setEditingQuestionIndex(index);
        setShowQuestionForm(true);
        questionForm.current?.scrollIntoView({ behavior: "smooth" });
    };

    // DELETE ANSWER
    const deleteQuestion = (index) => {
        if (confirm('¿Eliminar esta pregunta?')) {
            const updatedQuestions = questions.filter((_, i) => i !== index);
            setQuestions(updatedQuestions);
        }
    };

    // CHANGE TYPE
    const handleQuestionTypeChange = (type) => {
        let newOptions = ['', '', '', ''];
            if (type === 'true_false') {
            newOptions = ['Verdadero', 'Falso'];
        }
        
        setCurrentQuestion(prev => ({
            ...prev,
            question_type: type,
            options: newOptions,
            correct_answers: []
        }));
    };

    // SAVE EXAM-------------------------------
    const saveExam = async () => {
        if (!examData.name) {
            toast.error('El nombre del examen es obligatorio');
            return;
        }
        if (!examData.subject_id) {
            toast.error('Debe seleccionar una materia');
            return;
        }
        if (questions.length === 0) {
            toast.error('Debe agregar al menos una pregunta');
            return;
        }

        const examToSave = {
            ...examData,
            total_questions: questions.length,
            questions: questions,
            edit: edit ? 1 : 0
        };

        const response = await axios.post('/saveExam', {
            exam: examToSave
        });

        if ((response['status'] ?? false) === 200) {
            toast.success(edit ? "Se actualizó el exámen" : "Se creó el exámen");
            setTimeout(() => {
                router.visit('/exams'); 
            }, 700);
        } else {
            toast.error("Hubo un problema");
            console.log(response);
        }
    };
    // RETURN-----------------------------
    return (
      <AuthenticatedLayout title="Nuevo examen">
        <div className="p-3 sm:p-6 bg-[var(--fontBox)] rounded-lg shadow">

            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4 justify-between">
                        <h3 className="text-xl font-semibold text-[var(--primary)]">
                            {edit ? 'Editar Examen' : 'Crear Nuevo Examen'}
                        </h3> 
                    <Link href="/exams">   
                        <MiniButton className="flex items-center gap-2 text-[var(--primary)]">
                            <FaArrowLeft />
                            Volver a Exámenes
                        </MiniButton>
                    </Link> 
                </div>    
            </div>

            {/* NAV */}
            <div className="flex items-center mb-8">
                <div className={`flex items-center ${activeStep >= 1 ? 'text-[var(--primary)]' : 'text-[var(--secondary)]'}`}>
                <div className={`min-w-8 min-h-8 rounded-full flex items-center justify-center text-[var(--textReverse)] font-bold ${activeStep >= 1 ? 'bg-[var(--primary)]' : 'bg-[var(--secondary)]'}`}>
                    1
                </div>
                <span className="ml-2 font-medium">Información del Examen</span>
                </div>
                <div className={`w-16 h-1 mx-4 ${activeStep >= 2 ? 'bg-[var(--primary)]' : 'bg-[var(--secondary)]'}`}></div>
                <div className={`flex items-center ${activeStep >= 2 ? 'text-[var(--primary)]' : 'text-[var(--secondary)]'}`}>
                <div className={`min-w-8 min-h-8 rounded-full flex items-center justify-center text-[var(--textReverse)] font-bold ${activeStep >= 2 ? 'bg-[var(--primary)]' : 'bg-[var(--secondary)]'}`}>
                    2
                </div>
                <span className="ml-2 font-medium">Preguntas</span>
                </div>
            </div>

            {/* INFO ------------------------ */}
            {activeStep === 1 && (
                <div className="bg-[var(--fontBox)] rounded-lg p-1 sm:p-6">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        Información General
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="md:col-span-2">
                            <InputLabel className="block text-sm font-medium text-[var(--primary)] mb-2">
                                Nombre del Examen *
                            </InputLabel>
                            <TextInput
                                type="text"
                                value={examData.name}
                                onChange={(e) => handleExamChange('name', e.target.value)}
                                className="w-full"
                                placeholder="Nombre del examen"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <InputInputLabel className="block text-sm font-medium text-[var(--primary)] mb-2">
                                Descripción
                            </InputInputLabel>
                            <Textarea
                                value={examData.description}
                                onChange={(e) => handleExamChange('description', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-[var(--secondary)] rounded-md focus:ring-2 focus:ring-[var(--secondary)] focus:border-transparent"
                                placeholder="Describe el contenido del examen"
                            />
                        </div>

                        <div>
                            <InputInputLabel className="block text-sm font-medium text-[var(--primary)] mb-2">
                                Materia asociada
                            </InputInputLabel>
                            <Select
                                value={examData.subject_id}
                                onChange={(e) => handleExamChange('subject_id', e.target.value)}
                                className="w-full px-3 py-2 border border-[var(--secondary)] rounded-md focus:ring-2 focus:ring-[var(--secondary)] focus:border-transparent"
                            >
                                <option value="">Seleccionar materia</option>
                                {subjects.map(subject => (
                                <option key={subject.id} value={subject.id}>
                                    {subject.name} ({subject.code})
                                </option>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <InputInputLabel className="block text-sm font-medium text-[var(--primary)] mb-2">
                                Tiempo Límite (minutos) (opcional)
                            </InputInputLabel>
                            <TextInput
                                type="number"
                                value={examData.time_limit}
                                onChange={(e) => handleExamChange('time_limit', parseInt(e.target.value))}
                                min="1"
                                className="w-full px-3 py-2 border border-[var(--secondary)] rounded-md focus:ring-2 focus:ring-[var(--secondary)] focus:border-transparent"
                            />
                        </div>

                        <div>
                            <InputLabel className="block text-sm font-medium text-[var(--primary)] mb-2">
                                Tipo de Examen
                            </InputLabel>
                            <Select
                                value={examData.exam_type}
                                onChange={(e) => handleExamChange('exam_type', e.target.value)}
                                className="w-full px-3 py-2 border border-[var(--secondary)] rounded-md focus:ring-2 focus:ring-[var(--secondary)] focus:border-transparent"
                            >
                                <option value="multiple_choice">Opción Múltiple</option>
                                <option value="true_false">Verdadero/Falso</option>
                                <option value="essay">Desarrollo</option>
                                <option value="mixed">Mixto</option>
                            </Select>
                        </div>

                        <div>
                            <InputLabel className="block text-sm font-medium text-[var(--primary)] mb-2">
                                Dificultad
                            </InputLabel>
                            <Select
                                value={examData.difficulty}
                                onChange={(e) => handleExamChange('difficulty', e.target.value)}
                                className="w-full px-3 py-2 border border-[var(--secondary)] rounded-md focus:ring-2 focus:ring-[var(--secondary)] focus:border-transparent"
                            >
                                <option value="basic">Básico</option>
                                <option value="intermediate">Intermedio</option>
                                <option value="advanced">Avanzado</option>
                            </Select>
                        </div>

                        <div>
                            <InputLabel className="block text-sm font-medium text-[var(--primary)] mb-2">
                                Puntuación Mínima para Aprobar (%)
                            </InputLabel>
                            <TextInput
                                type="number"
                                value={examData.passing_score}
                                onChange={(e) => handleExamChange('passing_score', parseFloat(e.target.value))}
                                min="0"
                                max="100"
                                step="0.1"
                                className="w-full px-3 py-2 border border-[var(--secondary)] rounded-md focus:ring-2 focus:ring-[var(--secondary)] focus:border-transparent"
                            />
                        </div>

                        <div>
                        <InputLabel className="block text-sm font-medium text-[var(--primary)] mb-2">
                            Intentos Máximos (Opcional)
                        </InputLabel>
                        <TextInput
                            type="number"
                            value={examData.max_attempts}
                            onChange={(e) => handleExamChange('max_attempts', parseInt(e.target.value))}
                            min="1"
                            className="w-full px-3 py-2 border border-[var(--secondary)] rounded-md focus:ring-2 focus:ring-[var(--secondary)] focus:border-transparent"
                        />
                        </div>

                        <div className="md:col-span-2">
                            <h3 className="text-lg font-medium text-[var(--primary)] mb-4">Configuraciones</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleExamChange('shuffle_questions', !examData.shuffle_questions)}
                                        className={`flex items-center ${examData.shuffle_questions ? 'text-[var(--primary)]' : 'text-[var(--secondary)]'}`}
                                    >
                                        {examData.shuffle_questions ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
                                    </button>
                                    <span className="text-sm font-medium text-[var(--primary)]">Randomizar preguntas</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleExamChange('shuffle_options', !examData.shuffle_options)}
                                        className={`flex items-center ${examData.shuffle_options ? 'text-[var(--primary)]' : 'text-[var(--secondary)]'}`}
                                    >
                                        {examData.shuffle_options ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
                                    </button>
                                    <span className="text-sm font-medium text-[var(--primary)]">Randomizar opciones</span>
                                </div>

                                <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleExamChange('show_results', !examData.show_results)}
                                    className={`flex items-center ${examData.show_results ? 'text-[var(--primary)]' : 'text-[var(--secondary)]'}`}
                                >
                                    {examData.show_results ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
                                </button>
                                <span className="text-sm font-medium text-[var(--primary)]">Mostrar resultados al final</span>
                                </div>

                                <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleExamChange('is_active', !examData.is_active)}
                                    className={`flex items-center ${examData.is_active ? 'text-[var(--primary)]' : 'text-[var(--secondary)]'}`}
                                >
                                    {examData.is_active ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
                                </button>
                                <span className="text-sm font-medium text-[var(--primary)]">Disponible</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="flex justify-end mt-8">
                        <PrimaryButton
                        onClick={() => setActiveStep(2)}
                        className="flex items-center gap-2"
                        >
                            Continuar
                            <FaArrowLeft className="rotate-180" />
                        </PrimaryButton>
                    </div>
                </div>
            )}

            {/* ANSWERS ---------------------------- */}
            {activeStep === 2 && (
            <div className="space-y-5">

                <div className="bg-[var(--fontBox)] rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4 flex-col md:flex-row gap-2">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            Preguntas del Examen ({questions.length})
                        </h3>
                        <PrimaryButton
                            onClick={() => createAnswer()}
                            className="flex items-center gap-2"
                        >
                            <FaPlus />
                            Agregar Pregunta
                        </PrimaryButton>
                    </div>

                    {questions.length > 0 && (
                    <div className="space-y-3">
                    {questions.map((question, index) => (
                        <div key={index} className="border border-[var(--font)] rounded-lg p-4">
                            <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                <span className="bg-[var(--font)] text-[var(--primary)] text-xs font-medium px-2 py-1 rounded">
                                    Pregunta {index + 1}
                                </span>
                                <span className="bg-[var(--font)] text-[var(--primary)] text-xs font-medium px-2 py-1 rounded">
                                    {question.question_type === 'multiple_choice' ? 'Opción Múltiple' : 
                                    question.question_type === 'true_false' ? 'Verdadero/Falso' : 'Desarrollo'}
                                </span>
                                </div>
                                <p className="text-[var(--primary)] font-medium mb-2">{question.question}</p>
                                {question.question_type !== 'essay' && (
                                <div className="text-sm text-[var(--primary)]">
                                    <strong>Opciones:</strong> {question.options.filter(opt => opt.trim()).join(', ')}
                                    <br />
                                    <strong>Respuesta correcta:</strong> {question.correct_answers.map(i => question.options[i]).join(', ')}
                                </div>
                                )}
                            </div>
                            <div className="flex items-center gap-1 ml-1">
                                <button
                                onClick={() => editQuestion(index)}
                                className="p-1 text-[var(--primary)] hover:bg-[var(--font)] rounded-lg transition-colors"
                                >
                                <FaEdit />
                                </button>
                                <button
                                onClick={() => deleteQuestion(index)}
                                className="p-1 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                >
                                <FaTrash />
                                </button>
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                    )}
                </div>

                {showQuestionForm && (
                <div ref={questionForm} className="bg-[var(--fontBox)] rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        {editingQuestionIndex >= 0 ? 'Editar Pregunta' : 'Nueva Pregunta'}
                    </h3>

                    <div className="space-y-4">

                        <div>
                            <InputLabel className="block text-sm font-medium text-[var(--primary)] mb-2">
                                Tipo de Pregunta
                            </InputLabel>
                            <Select
                                value={currentQuestion.question_type}
                                onChange={(e) => handleQuestionTypeChange(e.target.value)}
                                className="w-full px-3 py-2 border border-[var(--secondary)] rounded-md focus:ring-2 focus:ring-[var(--secondary)] focus:border-transparent"
                            >
                                <option value="multiple_choice">Opción Múltiple</option>
                                <option value="true_false">Verdadero/Falso</option>
                                {/* <option value="essay">Desarrollo</option> */}
                            </Select>
                        </div>
                        {/* ANSWER QUESTIONS --------------------PENDING */}
                        {/* <div>
                            <ImageDropInput />
                        </div> */}

                        <div>
                        <InputLabel className="block text-sm font-medium text-[var(--primary)] mb-2">
                            Pregunta *
                        </InputLabel>
                        <Textarea
                            value={currentQuestion.question}
                            onChange={(e) => handleQuestionChange('question', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-[var(--secondary)] rounded-md focus:ring-2 focus:ring-[var(--secondary)] focus:border-transparent"
                            placeholder="Escribe la pregunta aquí..."
                        />
                        </div>

                        {currentQuestion.question_type !== 'essay' && (
                        <div>
                            <InputLabel className="block text-sm font-medium text-[var(--primary)] mb-2">
                            Opciones de Respuesta *
                            </InputLabel>
                            <div className="space-y-2">
                            {currentQuestion.options.map((option, index) => (
                                <div key={index} className="flex items-center gap-3">
                                <button
                                    onClick={() => handleCorrectAnswerToggle(index)}
                                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                                    currentQuestion.correct_answers.includes(index)
                                        ? 'bg-[var(--secondary)] border-[var(--secondary)] text-[var(--textReverse)]'
                                        : 'border-[var(--secondary)] hover:border-[var(--secondary)]'
                                    }`}
                                >
                                    {currentQuestion.correct_answers.includes(index) && <FaCheck size={12} />}
                                </button>
                                <TextInput
                                    type="text"
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-[var(--secondary)] rounded-md focus:ring-2 focus:ring-[var(--secondary)] focus:border-transparent"
                                    placeholder={`Opción ${String.fromCharCode(65 + index)}`}
                                    disabled={currentQuestion.question_type === 'true_false'}
                                />
                                </div>
                            ))}
                            </div>
                            <p className="text-xs text-[var(--primary)] mt-2">
                            Click en el círculo para marcar la(s) respuesta(s) correcta(s)
                            </p>
                        </div>
                        )}

                        <div>
                            <InputLabel className="block text-sm font-medium text-[var(--primary)] mb-2">
                                Explicación (opcional)
                            </InputLabel>
                            <Textarea
                                value={currentQuestion.explanation}
                                onChange={(e) => handleQuestionChange('explanation', e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 border border-[var(--secondary)] rounded-md focus:ring-2 focus:ring-[var(--secondary)] focus:border-transparent"
                                placeholder="Explica por qué esta es la respuesta correcta..."
                            />
                        </div>
                        <div>
                            <InputLabel className="block text-sm font-medium text-[var(--primary)] mb-2">
                                Órden
                            </InputLabel>
                            <TextInput
                                    type="number"
                                    value={currentQuestion.order}
                                    onChange={(e) => handleQuestionChange('order', e.target.value)}
                                    className="flex-1 px-3 py-2 border border-[var(--secondary)] rounded-md focus:ring-2 focus:ring-[var(--secondary)] focus:border-transparent"
                                />
                        </div>
                                    

                        <div className="flex justify-between md:justify-end gap-3 pt-4 border-t">
                            <SecondaryButton
                                onClick={() => {
                                setShowQuestionForm(false);
                                setEditingQuestionIndex(-1);
                                setCurrentQuestion({
                                    question: '',
                                    question_type: 'multiple_choice',
                                    options: ['', '', '', ''],
                                    correct_answers: [],
                                    explanation: '',
                                    order: 0
                                });
                                }}
                                className="flex items-center gap-2"
                            >
                                <FaTimes />
                                Cancelar
                            </SecondaryButton>
                            <PrimaryButton
                                onClick={saveQuestion}
                                className="flex items-center gap-2"
                            >
                                <FaSave />
                                {editingQuestionIndex >= 0 ? 'Actualizar' : 'Guardar'}
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
                )}

                <div className="bg-[var(--fontBox)] rounded-lg shadow p-6">
                    <div className="flex justify-between gap-3">
                    <SecondaryButton
                        onClick={() => setActiveStep(1)}
                        className="flex items-center gap-2"
                    >
                        <FaArrowLeft />
                        Información
                    </SecondaryButton>
                    <PrimaryButton
                        onClick={saveExam}
                        className="flex items-center gap-2"
                        disabled={questions.length === 0}
                    >
                        {edit ? 'Editar Examen' : 'Crear Examen'}
                    </PrimaryButton>
                    </div>
                </div>
            </div>
            )}
        </div>
    </AuthenticatedLayout>
  );
};

export default CreateExam;