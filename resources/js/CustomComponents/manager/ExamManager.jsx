import React, { useState, useMemo } from 'react';
import { 
  FaPlay,
  FaClock,
  FaQuestionCircle,
  FaListUl,
  FaCheckCircle,
  FaFilter,
  FaTimes,
  FaTh,
  FaList,
  FaStar,
  FaRedo,
  FaCalendarAlt,
  FaRandom,
  FaPen
} from 'react-icons/fa';
import { MdOutlineRateReview } from "react-icons/md";

import PrimaryButton from '../button/PrimaryButton';
import SecondaryButton from '../button/SecondaryButton';

import { Link, router } from '@inertiajs/react';
import ActionExamDropdown from '../dropdown/ActionExamDropdown';
import TertiaryButton from '../button/TertiaryButton';
import { FormatDate } from '@/Functions/FormatDate';
import Select from '../form/Select';
import { useFetchDetails } from '@/hooks/useFetchDetails';
import Modal from '../modal/Modal';
import axios from 'axios';
import ConfirmDeleteModal from '../modal/ConfirmDeleteModal';
import { toast } from 'sonner';
import { View } from 'lucide-react';
import ViewQuestionsModal from '../modal/ViewQuestionsModal';

const ExamManager = ({ exams, currentPage = 1, totalPages = 1, onPageChange = {}, pageLevel = 1, isAdmin = false }) => {
  
  const [viewType, setViewType] = useState('grid');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [modalDetailsOpen, setModalDetailsOpen] = useState(false);
  const [viewDetails, setViewDetails] = useState([]);

  const [modalQuestionsOpen, setModalQuestionsOpen] = useState(false);
  const [viewQuestions, setViewQuestions] = useState([]);

  const [modalHistoryOpen, setModalHistoryOpen] = useState(false);
  const [viewHistory, setViewHistory] = useState([]);

  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  const [lastAttemptAnswers, setLastAttemptAnswers] = useState(null);

  const [modeViewQuestions,setModeViewQuestions] = useState(true);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'basic':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficulty = (difficulty) => {
    switch (difficulty) {
      case 'basic':
        return 'Básico';
      case 'intermediate':
        return 'Intermedio';
      case 'advanced':
        return 'Avanzado';
      default:
        return 'Esencial';
    }
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getExamTypeIcon = (type,size = 4) => {
    switch (type) {
      case 'multiple_choice':
        return <FaListUl className={`min-w-${size} h-${size}`} />;
      case 'true_false':
        return <FaCheckCircle className={`min-w-${size} h-${size}`} />;
      case 'essay':
        return <FaPen className={`min-w-${size} h-${size}`} />;
      case 'mixed':
        return <FaStar className={`min-w-${size} h-${size}`} />;
      default:
        return <FaQuestionCircle className={`min-w-${size} h-${size}`} />;
    }
  };

  const subjects = [...new Set(exams.map(exam => exam.subject))].sort();

  const filteredExams = useMemo(() => {
    return exams.filter(exam => {
      const matchesSubject = !filterSubject || exam.subject === filterSubject;
      const matchesStatus = !filterStatus || 
        (filterStatus === 'completed' && exam.lastAttempt && exam.lastAttempt.completed) ||
        (filterStatus === 'pending' && (!exam.lastAttempt || (exam.lastAttempt && !exam.lastAttempt.completed)));
      return matchesSubject && matchesStatus;
    });
  }, [filterSubject, filterStatus]);

  const clearFilters = () => {
    setFilterSubject('');
    setFilterStatus('');
  };

  const startExam = (id) => {
    router.visit(`/startExam/${id}`, {
            method: 'get'
        });
  };

  const retakeExam = (id) => {
    router.visit(`/startExam/${id}`, {
            method: 'get'
        });
  };

  const viewAnswersExam = (id, lastAttempt) => {
    const answers = lastAttempt.answers;

    setLastAttemptAnswers(answers);
    handleViewQuestions(id, false);
  };

  const getExamType = (type) => {
    switch (type) {
      case 'multiple_choice':
        return 'Opción múltiple';
      case 'true_false':
        return 'Verdadero/falso';
      case 'essay':
        return 'Escribir';
      case 'mixed':
        return 'Mixto';
      default:
        return 'Otro';
    }
  }

  const handleDetails = async (item) => {
    const details = await handleActionDetails(item.id);

      const formattedDetails = details.map(row => {
        const newRow = {};  
          for (const [key, value] of Object.entries(row)) {
              if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}(T|\s)/)) {
                  newRow[key] = FormatDate(value, true);
              } else if (typeof value === "object" && value !== null) {
                  newRow[key] = JSON.stringify(value, null, 2);
              } else if (key == "Tamaño") {
                  newRow[key] = formatFileSize(value,2);
              }else{
                  newRow[key] = value;
              }
          }
          return newRow;
      });
      setViewDetails(formattedDetails);
      setModalDetailsOpen(true);
  };

  const { fetchDetails } = useFetchDetails();

  const handleActionDetails = async (id) => {
    
    const headerMapCommons = {
      name: "Nombre",
      description: "Descripción",
      subject: "Materia asociada",
      time_limit_show: "Tiempo límite",
      total_questions: "Total de preguntas",
      exam_type_show: "Tipo de examen",
      difficulty_show: "Dificultad",
      passing_score_show: "Calificación mínima",
      max_attempts: "Máximo de intentos",
      shuffle_questions: "Randomizar preguntas",
      shuffle_options: "Randomizar opciones",
      show_results: "Mostrar respuestas"
    };

    const headerMap = isAdmin 
      ? {
        ...headerMapCommons, ...{
          is_active_show: "Activo",
          created_by_name: "Creado por",
          created_at: "Fecha de creación",
          updated_at: "Última actualización"
    } } : headerMapCommons;

    return await fetchDetails("/getExam", { id },headerMap);
  }

  let handleViewQuestions = async (id, modeView = true) => {
    setModeViewQuestions(modeView);
    const questions = await axios.get('/getExamQuestions', { params: { id } });
    setViewQuestions(questions.data);
    setModalQuestionsOpen(true)
  }

  // let handleViewHistory = async (item) => {
  //   const data = await axios.get('/getHistoryByExam/' + item.id);

  //   const columnsMap = {
  //     id: "id",
  //     attempt_number: "Intento",
  //     status: "Estado",
  //     started_at: "Fecha de inicio",
  //     completed_at: "Completado el",
  //     time_used: "Tiempo usado",
  //     score: "Score"
  //   };

  //   const filteredHistory = data.data.map(row => {
  //     const filtered = {};
  //     Object.keys(columnsMap).forEach(key => {
  //       filtered[columnsMap[key]] = row[key];
  //     });
  //     return filtered;
  //   });

  //   setViewHistory(filteredHistory);
  //   setModalHistoryOpen(true);
  // }

  let handleViewHistory = (item) => {
    router.visit('/history/'+item.id+'/'+item.name);
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

  let handleEdit = async (exam) => {
    const edit = await fetchDetails("/getExam", { id: exam.id });
    router.visit('/newexam', {
            method: 'post',
            data: {
              edit: edit[0]
            }
    });
  }

  let handleConfirmDelete = (item) => {
    setDeleteId(item.id);
    setModalDeleteOpen(true);
  }

  let handleDelete = async (id) => {
    return new Promise((resolve, reject) => {
        router.visit('/exams', {
            method: 'post',
            data: {
              id_delete: id
            },
            onSuccess: () => resolve(id),
            onError: (errors) => reject(errors),
        });
    });
  }

  if (!isAdmin) {
    handleViewQuestions = "";
    handleEdit = "";
    handleDelete = "";
    handleConfirmDelete = "";
  }

  return (
    <div className="px-3 md:px-6">
      <div>
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between gap-1 items-center pb-2">
            <h3 className="text-xl font-semibold text-[var(--primary)] mb-4">Exámenes</h3>
            {(
              isAdmin ? (
                <>
                  <Link href="/newexam"><PrimaryButton>Crear examen</PrimaryButton></Link>
                </>
              ) : (
                  <>
                    {/* <Link href="/testexam"><PrimaryButton>Exámen de prueba</PrimaryButton></Link> */}
                  </>
              )
            )}
          </div>
          
          {/* Controles */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-[var(--fontBox)] p-4 rounded-lg shadow">
            {/* Filtros */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <FaFilter className="text-[var(--secondary)]" />
              </div>
              
              <Select 
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
              >
                <option value="">Todas las materias</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </Select>
              
              <Select  
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="pending">No realizados</option>
                <option value="completed">Completados</option>
              </Select>
              
              {(filterSubject || filterStatus) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <FaTimes className="w-3 h-3" />
                  Limpiar
                </button>
              )}
            </div>

            {/* Selector de vista */}
            <div className="flex bg-[var(--font)] rounded-lg p-1">
              <button
                onClick={() => setViewType('grid')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  viewType === 'grid' 
                    ? 'bg-[var(--fontBox)] text-[var(--secondary)] shadow-sm' 
                    : 'text-[var(--primary)] hover:text-[var(--primary)]'
                }`}
              >
                <FaTh className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewType('list')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  viewType === 'list' 
                    ? 'bg-[var(--fontBox)] text-[var(--secondary)] shadow-sm' 
                    : 'text-[var(--primary)] hover:text-[var(--primary)]'
                }`}
              >
                <FaList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 hidden">
          <div className="bg-[var(--fontBox)] p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="bg-teal-100 p-3 rounded-full">
                <FaQuestionCircle className="w-6 h-6 text-[var(--secondary)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{filteredExams.length}</p>
                <p className="text-sm text-gray-600">Exámenes disponibles</p>
              </div>
            </div>
          </div>
          <div className="bg-[var(--fontBox)] p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-full">
                <FaCheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {filteredExams.filter(exam => exam.lastAttempt).length}
                </p>
                <p className="text-sm text-gray-600">Exámenes completados</p>
              </div>
            </div>
          </div>
          <div className="bg-[var(--fontBox)] p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-3 rounded-full">
                <FaClock className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {filteredExams.filter(exam => !exam.lastAttempt).length}
                </p>
                <p className="text-sm text-gray-600">Exámenes pendientes</p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Vista de Tarjetas */}
        {viewType === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map(exam => (
              <div key={exam.id} className="bg-[var(--fontBox)] rounded-lg shadow hover:shadow-lg hover:border-[var(--secondary)] transition-shadow p-2 border border-gray-200 flex flex-col">
                {/* Header de la tarjeta */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <h3 className="font-semibold text-[var(--primary)] text-lg leading-tight">
                      {exam.name}
                    </h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exam.difficulty)}`}>
                      {getDifficulty(exam.difficulty)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="inline-block border border-[var(--secondary)] text-[var(--secondary)] px-2 py-1 rounded-full text-xs font-medium mb-2">
                      {exam.subject}
                    </span>
                    <span>
                      <ActionExamDropdown
                        item={exam}
                        pageLevel={pageLevel}
                        onView={handleDetails}
                        onViewQuestions={handleViewQuestions}
                        onViewHistory={handleViewHistory}
                        onDelete={handleConfirmDelete}
                        onEdit={handleEdit}
                      />
                    </span>
                  </div>
                  <p title={exam.description} className="text-gray-500 text-sm line-clamp-2">
                    {exam.description}
                  </p>
                </div>

                {/* Detalles del examen */}
                <div className="p-4 flex flex-col h-full">
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex items-center gap-2 text-[var(--primary)]">
                      <FaClock className="w-4 h-4" />
                      <span>{!!exam.timeLimit ? exam.timeLimit+" min": "Sin limite"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--primary)]">
                      <FaQuestionCircle className="w-4 h-4" />
                      <span>{exam.questionCount} preguntas</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--primary)]">
                      {getExamTypeIcon(exam.exam_type)}
                      <span>{getExamType(exam.exam_type)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--primary)]">
                      {exam.shuffle_questions ? <FaRandom className="w-4 h-4" /> : <FaList className="w-4 h-4" />}
                      <span>{exam.shuffle_questions ? "Aleatorias" : "Fijas"}</span>
                    </div>
                  </div>

                  {/* Estado del examen */}
                  {exam.lastAttempt && exam.lastAttempt.completed ? (
                    <div className="border border-[var(--secondary)] p-3 rounded-lg mb-4 flex-1 h-full">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[var(--primary)]">Último intento:</span>
                        <span className={`font-bold text-lg ${getScoreColor(exam.lastAttempt.score)}`}>
                          {exam.lastAttempt.score}%
                        </span>
                      </div>
                      <div className="w-full text-xs text-[var(--primary)] flex gap-2 flex-wrap items-center md:items-start md:flex-col">
                        <div className="w-full flex justify-between">
                          <span>Fecha:</span>
                          <span>{FormatDate(exam.lastAttempt.completedAt,true)}</span>
                        </div>
                        <div className="w-full flex justify-between">
                          <span>Tiempo usado:</span>
                          <span>{exam.lastAttempt.timeUsed} min</span>
                        </div>
                        <div className="w-full flex justify-between">
                          <span>Intentos:</span>
                          <span>{exam.lastAttempt.attempts}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                      exam.lastAttempt && !exam.lastAttempt.completed ? (
                        <>
                          <div className="border border-[var(--secondary)] p-3 rounded-lg mb-4 flex-1 h-full">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-[var(--primary)]">Último intento:</span>
                              <span className={`font-bold text-lg ${getScoreColor(exam.lastAttempt.score)}`}>
                                En progreso
                              </span>
                            </div>
                            <div className="w-full text-xs text-[var(--primary)] flex gap-2 flex-wrap items-center md:items-start md:flex-col">
                              <div className="w-full flex justify-between">
                                <span>Fecha inicio:</span>
                                <span>{FormatDate(exam.lastAttempt.startedAt,true)}</span>
                              </div>
                              <div className="w-full flex justify-between">
                                <span>Intentos:</span>
                                <span>{exam.lastAttempt.attempts}</span>
                              </div>
                            </div>
                          </div>
                        </>
                    ) : (
                      <div className="bg-gray-100 p-2 rounded-lg mb-4 text-center flex-1">
                        <span className="text-gray-400 h-full text-sm font-medium flex items-center justify-center">
                          Sin intentos
                        </span>
                      </div>
                    )
                  )
                  }

                  <span className="text-sm pb-1">{exam.lastAttempt ?
                    ((exam.max_attempts - exam.lastAttempt.attempts) > 0 ?
                      "Puedes realizar " + (exam.max_attempts - exam.lastAttempt.attempts) + " intento/s más" : "") :
                    (exam.max_attempts > 0 ?
                      ("Puedes realizar " + (exam.max_attempts) + " intento/s más")
                      : "Solo tienes un intento")}</span>

                  {/* Botones de acción */}
                  <div className="flex gap-2">
                    {exam.is_active === 1 ? (
                      (exam.lastAttempt && exam.lastAttempt.completed ? (
                        <div className="flex gap-2 justify-between w-full">
                          {!!exam.show_results && <TertiaryButton
                            onClick={() => viewAnswersExam(exam.id, exam.lastAttempt)}
                            className="flex-1 flex items-center justify-center gap-2 py-3"
                          >
                            <MdOutlineRateReview className="w-4 h-4" />
                            Ver respuestas
                          </TertiaryButton>}
                          {
                            exam.max_attempts == 0 || exam.max_attempts > exam.lastAttempt.attempts ? (
                              <SecondaryButton
                                onClick={() => retakeExam(exam.id)}
                                className="flex-1 flex items-center justify-center gap-2 py-3"
                              >
                                <FaRedo className="w-4 h-4" />
                                Repetir Examen
                              </SecondaryButton>
                            ) : ""
                          }
                          
                        </div>
                      ) :
                        (
                          exam.lastAttempt && !exam.lastAttempt.completed ? (
                            <>
                              <SecondaryButton
                                onClick={() => startExam(exam.id)}
                                className="flex-1 flex items-center justify-center gap-2 py-3"
                              >
                                <FaPlay className="w-4 h-4" />
                                Continuar Examen
                              </SecondaryButton>
                            </>
                          ):
                            (
                              <PrimaryButton
                                onClick={() => startExam(exam.id)}
                                className="flex-1 flex items-center justify-center gap-2 py-3"
                              >
                                <FaPlay className="w-4 h-4" />
                                Comenzar Examen
                              </PrimaryButton>
                            )
                        )
                        )
                      ) : (
                        <span className="bg-gray-100 p-2 rounded-lg mb-4 text-center flex-1 text-gray-400">
                          No disponible
                        </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Vista de Lista */}
        {viewType === 'list' && (
          <div className="bg-[var(--fontBox)] rounded-lg shadow overflow-hidden border border-[var(--secondary)]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--primary)] border-b border-[var(--secondary)]">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-[var(--textReverse)]">Examen</th>
                    <th className="text-left py-3 px-4 font-semibold text-[var(--textReverse)]">Descripción</th>
                    <th className="text-left py-3 px-4 font-semibold text-[var(--textReverse)]">Detalles</th>
                    <th className="text-left py-3 px-4 font-semibold text-[var(--textReverse)]">Estado</th>
                    <th className="text-left py-3 px-4 font-semibold text-[var(--textReverse)]">Realizar</th>
                    <th className="text-left py-3 px-2 font-semibold text-[var(--textReverse)]"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExams.map((exam, index) => (
                    <tr key={exam.id} className={`border-b border-[var(--font)] hover:bg-[var(--font)] transition-colors ${index % 2 === 0 ? 'bg-[var(--fontBox)]' : 'bg-gray-100'}`}>
                      <td className="py-4 px-4">
                        <div>
                          <h4 className="font-semibold text-[var(--primary)]">{exam.name}</h4>
                          <div className="flex items-start md:items-center gap-2 mt-1 flex-col md:flex-row">
                            <span className="inline-block bg-[var(--font)] text-[var(--primary)] px-2 py-1 rounded-lg md:rounded-full text-xs font-medium">
                              {exam.subject}
                            </span>
                            <span className={`inline-block px-2 py-1 rounded-lg md:rounded-full text-xs font-medium ${getDifficultyColor(exam.difficulty)}`}>
                              {getDifficulty(exam.difficulty)}
                            </span>
                          </div>
                          {/* <p title={exam.description} className="text-[var(--primary)] text-sm mt-1 line-clamp-2 hidden md:flex">
                            {exam.description}
                          </p> */}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p title={exam.description} className="text-[var(--primary)] text-sm line-clamp-5">
                            {exam.description}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-[var(--primary)] space-y-1 flex gap-1 md:gap-3 items-center justify-start flex-wrap">
                          <div className="flex flex-col gap-1 justify-center">
                            <div className="flex items-center gap-2">
                              <FaClock className="min-w-3 h-3" />
                              <span className="text-xs md:text-sm">{exam.timeLimit > 0 ? exam.timeLimit+" min" : "Sin limite"} </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaQuestionCircle className="min-w-3 h-3" />
                              <span className="text-xs md:text-sm">{exam.questionCount} preguntas</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1 justify-center">
                            <div className="flex items-center gap-2">
                              {getExamTypeIcon(exam.exam_type,3)}
                              <span className="text-xs md:text-sm">{getExamType(exam.exam_type)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {exam.shuffle_questions ? <FaRandom className="w-3 h-3" /> : <FaList className="w-3 h-3" />}
                              <span className="text-xs md:text-sm">{exam.shuffle_questions ? "Aleatorias" : "Fijas"}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {exam.lastAttempt ? (
                          <div className="text-sm">
                            <div className={`font-bold text-lg ${getScoreColor(exam.lastAttempt.score)}`}>
                              {exam.lastAttempt.score}%
                            </div>
                            <div className="text-[var(--primary)] text-xs">
                              <div className="flex items-center gap-1">
                                <FaCalendarAlt className="min-w-3 h-3" />
                                {FormatDate(exam.lastAttempt.completedAt,true)}
                              </div>
                              <div className="font-bold">Intento #{exam.lastAttempt.attempts}</div>
                            </div>
                          </div>
                        ) : (
                          <span className="inline-block bg-[var(--font)] text-[var(--primary)] px-2 py-1 rounded-lg md:rounded-full text-xs font-medium">
                            Sin intentos
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        
                      <span className="text-sm pb-1">{exam.lastAttempt ?
                      ((exam.max_attempts - exam.lastAttempt.attempts) > 0 ?
                        "Tienes " + (exam.max_attempts - exam.lastAttempt.attempts) + " intento/s más" : "") :
                      (exam.max_attempts > 0 ?
                        ("Tienes " + (exam.max_attempts) + " intento/s más")
                        : "Solo tienes un intento")}</span>
                        
                        {exam.is_active === 1 ? (
                          (exam.lastAttempt ? (
                              <div className="flex gap-2 items-start flex-col">
                                <TertiaryButton
                                  onClick={() => viewAnswersExam(exam.id, exam.name)}
                                  className="flex items-center gap-2 px-3 py-2 rounded-lg"
                                >
                                  <MdOutlineRateReview className="w-4 h-4" />
                                  Respuestas
                                </TertiaryButton>
                                {exam.max_attempts == 0 || exam.max_attempts > exam.lastAttempt.attempts ? <SecondaryButton
                                  onClick={() => retakeExam(exam.id, exam.name)}
                                  className="flex items-center gap-2 px-3 py-2 rounded-lg"
                                >
                                  <FaRedo className="w-3 h-3" />
                                  Repetir
                                </SecondaryButton> : ""}
                              </div>
                            ) : (
                              <PrimaryButton
                                onClick={() => startExam(exam.id, exam.name)}
                                className="flex items-center gap-2"
                              >
                                <FaPlay className="w-3 h-3" />
                                Comenzar
                              </PrimaryButton>
                            ))
                        ) : (
                            <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                              No disponible
                            </span>
                        )}
                      </td>
                      <td className="py-4 px-3 w-1">
                        <span>
                          <ActionExamDropdown
                            item={exam}
                            pageLevel={pageLevel}
                            onView={handleDetails}
                            onViewQuestions={handleViewQuestions}
                            onViewHistory={handleViewHistory}
                            onDelete={handleConfirmDelete}
                            onEdit={handleEdit}
                          />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sin datos */}
        {filteredExams.length === 0 && (
          <div className="text-center py-12 bg-[var(--fontBox)] rounded-lg shadow">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No se encontraron exámenes</h3>
            <p className="text-gray-500">Intenta cambiar los filtros para ver más resultados</p>
          </div>
        )}
      </div>
      {/* ------ PAGINATION ------- */}
      <div className="mt-6 flex justify-center items-center gap-4">
          <span className="text-sm text-gray-500">Página {currentPage} de {totalPages}</span>

          <div className="flex gap-1">
              {[...Array(totalPages)].map((_, index) => (
                  <button
                      key={index}
                      className={`px-3 py-1 rounded-lg text-sm ${currentPage === index + 1 ? 'bg-[var(--primary)] text-[var(--textReverse)]' : ''}`}
                      onClick={() => onPageChange(index + 1)}
                  >
                      {index + 1}
                  </button>
              ))}
          </div>
      </div>
      {/* ------------------------ */}

      {/* DETAILS MODAL */}
      <Modal show={modalDetailsOpen} onClose={() => setModalDetailsOpen(false)}>
          <div className="p-6 space-y-4">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-[var(--primary)]">
                      Detalles del examen
                  </h3>
                  <button onClick={() => setModalDetailsOpen(false)} className="text-[var(--secondary)] hover:text-[var(--primary)]">
                      <FaTimes />
                  </button>
              </div>
      
              <div>
                  {/* Table */}
                  {viewDetails.length > 0 && (
                      <div className="overflow-x-auto">
                          <table className="table-auto border-collapse border border-[var(--secondary)] w-full">
                              <tbody>
                                  {Object.entries(viewDetails[0]).map(([key, value], i) => (
                                  <tr key={i}>
                                      <th className="border border-[var(--secondary)] px-2 py-1 bg-[var(--font)] text-[var(--primary)] text-left w-1/3">
                                      {key}
                                      </th>
                                      <td className="border border-[var(--secondary)] px-2 py-1">
                                      {value === null || value === undefined ? "" : String(value)}
                                      </td>
                                  </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  )}

              </div>
          </div>
      </Modal>

      {/* VIEW QUESTIONS MODAL */}
      <ViewQuestionsModal
        show={modalQuestionsOpen}
        onClose={() => setModalQuestionsOpen(false)}
        questions={viewQuestions}
        modeJustView={modeViewQuestions}
        questionType={(type) =>
          type === "multiple_choice" ? "Opción múltiple" : (type === "true_false" ? "Verdadero/Falso" : "")
        }
      />

      {/* HISTORY MODAL */}
      <Modal show={modalHistoryOpen} onClose={() => setModalHistoryOpen(false)}>
          <div className="p-6 space-y-4">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-[var(--primary)]">
                      Historial del examen
                  </h3>
                  <button onClick={() => setModalHistoryOpen(false)} className="text-[var(--secondary)] hover:text-[var(--primary)]">
                      <FaTimes />
                  </button>
              </div>
      
              <div>
                  {/* Table */}
                  {viewHistory.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="table-auto border-collapse border border-[var(--secondary)] w-full">
                        <thead>
                          <tr>
                            {Object.keys(viewHistory[0]).map((key, i) => (
                              <th
                                key={i}
                                className="border border-[var(--secondary)] px-2 py-1 bg-[var(--font)] text-[var(--primary)] text-left"
                              >
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {viewHistory.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {Object.values(row).map((value, colIndex) => (
                                <td
                                  key={colIndex}
                                  className="border border-[var(--secondary)] px-2 py-1"
                                >
                                  {value === null || value === undefined ? "" : String(value)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

              </div>
          </div>
      </Modal>
      
      {/* DELETE MODAL */}
      <ConfirmDeleteModal
          show={modalDeleteOpen}
          onClose={() => setModalDeleteOpen(false)}
          onConfirm={async (id) => {
              try {
                  await handleDelete(id);
                  setModalDeleteOpen(false);
                  setTimeout(() => {
                      toast.success("Se ha eliminado exámen");
                  }, 150);
              } catch (err) {
                  if (err && typeof err === "object") {
                      setTimeout(() => { Object.values(err).forEach(msg => {
                          toast.error(msg);
                      }); }, 150);
                  } else {
                      setTimeout(() => { toast.error(err?.message || "Ocurrió un error"); }, 150);
                  }
              }
          }}
        id={deleteId}
        title="Confirma la eliminación"
        text = "Esta acción no se puede deshacer."
      />

    </div>
  );
};

export default ExamManager;