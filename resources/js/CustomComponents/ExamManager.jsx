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
  FaCalendarAlt
} from 'react-icons/fa';

import PrimaryButton from './button/PrimaryButton';
import SecondaryButton from './button/SecondaryButton';

import { Link } from '@inertiajs/react';

const ExamManager = ({exams}) => {
  const [viewType, setViewType] = useState('grid'); // 'grid' o 'list'
  const [filterSubject, setFilterSubject] = useState('');
  const [filterStatus, setFilterStatus] = useState(''); // 'completed', 'pending'


  // Color por dificultad
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Básico':
        return 'bg-green-100 text-green-800';
      case 'Intermedio':
        return 'bg-yellow-100 text-yellow-800';
      case 'Avanzado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Función para obtener el color según el score
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-teal-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Función para obtener el icono según el tipo de examen
  const getExamTypeIcon = (type) => {
    switch (type) {
      case 'Opción Múltiple':
        return <FaListUl className="min-w-3 h-3" />;
      case 'Verdadero/Falso':
        return <FaCheckCircle className="min-w-3 h-3" />;
      case 'Desarrollo':
        return <FaQuestionCircle className="min-w-3 h-3" />;
      case 'Mixto':
        return <FaStar className="min-w-3 h-3" />;
      default:
        return <FaQuestionCircle className="min-w-3 h-3" />;
    }
  };

  // Obtener listas únicas para los filtros
  const subjects = [...new Set(exams.map(exam => exam.subject))].sort();

  // Filtrar exámenes
  const filteredExams = useMemo(() => {
    return exams.filter(exam => {
      const matchesSubject = !filterSubject || exam.subject === filterSubject;
      const matchesStatus = !filterStatus || 
        (filterStatus === 'completed' && exam.lastAttempt) ||
        (filterStatus === 'pending' && !exam.lastAttempt);
      return matchesSubject && matchesStatus;
    });
  }, [filterSubject, filterStatus]);

  const clearFilters = () => {
    setFilterSubject('');
    setFilterStatus('');
  };

  const startExam = (examId, examName) => {
    alert(`Iniciando examen: ${examName}`);
    // iniciar el examen
  };

  const retakeExam = (examId, examName) => {
    alert(`Reiniciando examen: ${examName}`);
    // repetir el examen
  };

  return (
    <div className="px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between gap-1 items-center pb-2">
            <h3 className="text-xl font-semibold text-emerald-800 mb-4">Exámenes</h3>
            <Link href="/newexam"><PrimaryButton>Crear examen</PrimaryButton></Link>
          </div>
          
          {/* Controles */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white p-4 rounded-lg shadow">
            {/* Filtros */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <FaFilter className="text-emerald-500" />
                <span className="text-sm font-medium text-emerald-700">Filtros:</span>
              </div>
              
              <select 
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="px-3 py-2 pr-8 border border-emerald-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Todas las materias</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 pr-8 border border-emerald-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Todos</option>
                <option value="pending">No realizados</option>
                <option value="completed">Completados</option>
              </select>
              
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
            <div className="flex bg-emerald-100 rounded-lg p-1">
              <button
                onClick={() => setViewType('grid')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  viewType === 'grid' 
                    ? 'bg-white text-teal-600 shadow-sm' 
                    : 'text-emerald-600 hover:text-emerald-800'
                }`}
              >
                <FaTh className="w-4 h-4" />
                Tarjetas
              </button>
              <button
                onClick={() => setViewType('list')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  viewType === 'list' 
                    ? 'bg-white text-teal-600 shadow-sm' 
                    : 'text-emerald-600 hover:text-emerald-800'
                }`}
              >
                <FaList className="w-4 h-4" />
                Lista
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 hidden">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="bg-teal-100 p-3 rounded-full">
                <FaQuestionCircle className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{filteredExams.length}</p>
                <p className="text-sm text-gray-600">Exámenes disponibles</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
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
          <div className="bg-white p-4 rounded-lg shadow">
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
        </div>

        {/* Vista de Tarjetas */}
        {viewType === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map(exam => (
              <div key={exam.id} className="bg-white rounded-lg shadow hover:shadow-lg hover:border-emerald-500 transition-shadow p-2 cursor-pointer border border-gray-200 flex flex-col">
                {/* Header de la tarjeta */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <h3 className="font-semibold text-gray-800 text-lg leading-tight">
                      {exam.name}
                    </h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exam.difficulty)}`}>
                      {exam.difficulty}
                    </span>
                  </div>
                  <span className="inline-block bg-teal-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium mb-2">
                    {exam.subject}
                  </span>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {exam.description}
                  </p>
                </div>

                {/* Detalles del examen */}
                <div className="p-4 flex flex-col h-full">
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaClock className="w-4 h-4" />
                      <span>{exam.timeLimit} min</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaQuestionCircle className="w-4 h-4" />
                      <span>{exam.questionCount} preguntas</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 col-span-2">
                      {getExamTypeIcon(exam.type)}
                      <span>{exam.type}</span>
                    </div>
                  </div>

                  {/* Estado del examen */}
                  {exam.lastAttempt ? (
                    <div className="border border-emerald-300 p-3 rounded-lg mb-4 flex-1 h-full">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-emerald-700">Último intento:</span>
                        <span className={`font-bold text-lg ${getScoreColor(exam.lastAttempt.score)}`}>
                          {exam.lastAttempt.score}%
                        </span>
                      </div>
                      <div className="text-xs text-emerald-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Fecha:</span>
                          <span>{exam.lastAttempt.completedAt}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tiempo usado:</span>
                          <span>{exam.lastAttempt.timeUsed} min</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Intentos:</span>
                          <span>{exam.lastAttempt.attempts}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-emerald-100 p-2 rounded-lg mb-4 text-center flex-1">
                      <span className="text-emerald-700 h-full text-sm font-medium flex items-center justify-center">
                        Sin intentos
                      </span>
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="flex gap-2">
                    {exam.lastAttempt ? (
                      <SecondaryButton
                        onClick={() => retakeExam(exam.id, exam.name)}
                        className="flex-1 flex items-center justify-center gap-2 py-3"
                      >
                        <FaRedo className="w-4 h-4" />
                        Repetir Examen
                      </SecondaryButton>
                    ) : (
                      <PrimaryButton
                        onClick={() => startExam(exam.id, exam.name)}
                        className="flex-1 flex items-center justify-center gap-2 py-3"
                      >
                        <FaPlay className="w-4 h-4" />
                        Comenzar Examen
                      </PrimaryButton>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Vista de Lista */}
        {viewType === 'list' && (
          <div className="bg-white rounded-lg shadow overflow-hidden border border-emerald-300">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-emerald-700 border-b border-emerald-300">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-white">Examen</th>
                    <th className="text-left py-3 px-4 font-semibold text-white">Detalles</th>
                    <th className="text-left py-3 px-4 font-semibold text-white">Estado</th>
                    <th className="text-left py-3 px-4 font-semibold text-white">Realizar</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExams.map((exam, index) => (
                    <tr key={exam.id} className={`border-b border-emerald-100 hover:bg-emerald-100 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-emerald-50'}`}>
                      <td className="py-4 px-4">
                        <div>
                          <h4 className="font-semibold text-emerald-800">{exam.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-block bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
                              {exam.subject}
                            </span>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exam.difficulty)}`}>
                              {exam.difficulty}
                            </span>
                          </div>
                          <p className="text-emerald-600 text-sm mt-1 line-clamp-1">
                            {exam.description}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-emerald-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <FaClock className="min-w-3 h-3" />
                            <span>{exam.timeLimit} min</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaQuestionCircle className="min-w-3 h-3" />
                            <span>{exam.questionCount} preguntas</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getExamTypeIcon(exam.type)}
                            <span>{exam.type}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {exam.lastAttempt ? (
                          <div className="text-sm">
                            <div className={`font-bold text-lg ${getScoreColor(exam.lastAttempt.score)}`}>
                              {exam.lastAttempt.score}%
                            </div>
                            <div className="text-emerald-600 text-xs">
                              <div className="flex items-center gap-1">
                                <FaCalendarAlt className="w-3 h-3" />
                                {exam.lastAttempt.completedAt}
                              </div>
                              <div>Intento #{exam.lastAttempt.attempts}</div>
                            </div>
                          </div>
                        ) : (
                          <span className="inline-block bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
                            Sin intentos
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {exam.lastAttempt ? (
                          <SecondaryButton
                            onClick={() => retakeExam(exam.id, exam.name)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg"
                          >
                            <FaRedo className="w-3 h-3" />
                            Repetir
                          </SecondaryButton>
                        ) : (
                          <PrimaryButton
                            onClick={() => startExam(exam.id, exam.name)}
                            className="flex items-center gap-2"
                          >
                            <FaPlay className="w-3 h-3" />
                            Comenzar
                          </PrimaryButton>
                        )}
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
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700 mb-2">No se encontraron exámenes</h3>
            <p className="text-gray-500">Intenta cambiar los filtros para ver más resultados</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamManager;