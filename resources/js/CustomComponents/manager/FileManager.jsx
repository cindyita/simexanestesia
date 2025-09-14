import React, { useState, useMemo } from 'react';
import { 
    FaFilePdf, 
    FaFileWord, 
    FaFileExcel, 
    FaFilePowerpoint,
    FaFileImage,
    FaFileAudio,
    FaFileVideo,
    FaFileAlt,
    FaList,
    FaTh,
    FaFilter,
    FaTimes
} from 'react-icons/fa';
import ActionFileDropdown from '../dropdown/ActionFileDropdown';
import { Link } from '@inertiajs/react';
import PrimaryButton from '../button/PrimaryButton';
import UploadFileModal from '../modal/UploadFileModal';

import { FormatDate } from '@/Functions/FormatDate';
import Select from '../form/Select';

const FileManager = ({files,subjects, currentPage=1, totalPages=1, onPageChange={},pageLevel=1, isAdmin=0}) => {
  const [viewType, setViewType] = useState('grid');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterFileType, setFilterFileType] = useState('');
  const [modalUpFileOpen, setModalUpFileOpen] = useState(false);

  const getFileIcon = (fileType) => {
    const iconProps = { className: "w-8 h-8" };
    
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FaFilePdf {...iconProps} className="w-8 h-8 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FaFileWord {...iconProps} className="w-8 h-8 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FaFileExcel {...iconProps} className="w-8 h-8 text-green-500" />;
      case 'ppt':
      case 'pptx':
        return <FaFilePowerpoint {...iconProps} className="w-8 h-8 text-orange-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
        return <FaFileImage {...iconProps} className="w-8 h-8 text-[var(--secondary)]" />;
      case 'mp3':
      case 'wav':
      case 'ogg':
        return <FaFileAudio {...iconProps} className="w-8 h-8 text-[var(--secondary)]" />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <FaFileVideo {...iconProps} className="w-8 h-8 text-[var(--secondary)]" />;
      default:
        return <FaFileAlt {...iconProps} className="w-8 h-8 text-[var(--secondary)]" />;
    }
  };

  const subjectsList = [...new Set(files.map(file => file.subject))].sort();
  const fileTypes = [...new Set(files.map(file => file.file_type))].sort();

  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      const matchesSubject = !filterSubject || file.subject === filterSubject;
      const matchesFileType = !filterFileType || file.file_type === filterFileType;
      return matchesSubject && matchesFileType;
    });
  }, [filterSubject, filterFileType]);

  const clearFilters = () => {
    setFilterSubject('');
    setFilterFileType('');
  };

  return (
    <div className="px-3 md:px-6">
      <div>
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between gap-2">
            <h3 className="text-lg font-semibold text-[var(--primary)] mb-4">Recursos escolares</h3>
            <div>
              {(
                isAdmin ? (
                  <>
                    <PrimaryButton onClick={() => setModalUpFileOpen(true)}>
                      Subir recurso
                    </PrimaryButton>
                    <UploadFileModal show={modalUpFileOpen} subjects={subjects} onClose={() => setModalUpFileOpen(false)}></UploadFileModal>
                  </>
                ) : ""
              )}
            
            </div>
          </div>
          
          {/* Controles */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-[var(--fontBox)] p-4 rounded-lg shadow">
            {/* Filtros */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <FaFilter className="text-[var(--secondary)]" />
                <span className="text-sm font-medium text-[var(--primary)]">Filtros:</span>
              </div>
              
              <Select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="px-3 py-2 pr-8 border border-[var(--secondary)] rounded-md text-sm focus:ring-2 focus:ring-[var(--secondary)] focus:border-transparent"
              >
                <option value="">Todas las materias</option>
                {subjectsList.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </Select>
              
              <Select 
                value={filterFileType}
                onChange={(e) => setFilterFileType(e.target.value)}
                className="px-3 py-2 pr-8 border border-[var(--secondary)] rounded-md text-sm focus:ring-2 focus:ring-[var(--secondary)] focus:border-transparent"
              >
                <option value="">Todos los tipos</option>
                {fileTypes.map(type => (
                  <option key={type} value={type}>{type.toUpperCase()}</option>
                ))}
              </Select>
              
              {(filterSubject || filterFileType) && (
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
                    ? 'bg-[var(--fontBox)] text-[var(--primary)] shadow-sm' 
                    : 'text-[var(--primary)] hover:text-[var(--primary)]'
                }`}
              >
                <FaTh className="w-4 h-4" />
                Cuadrícula
              </button>
              <button
                onClick={() => setViewType('list')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  viewType === 'list' 
                    ? 'bg-[var(--fontBox)] text-[var(--primary)] shadow-sm' 
                    : 'text-[var(--primary)] hover:text-[var(--primary)]'
                }`}
              >
                <FaList className="w-4 h-4" />
                Lista
              </button>
            </div>
          </div>
        </div>

        {/* Contador de archivos */}
        <div className="mb-4 text-sm text-gray-600">
          Mostrando {filteredFiles.length} de {files.length} archivos
        </div>

        {/* Vista de Cuadrícula */}
        {viewType === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredFiles.map(file => (
              <div key={file.id} className="bg-[var(--fontBox)] rounded-lg shadow hover:shadow-lg hover:border-[var(--secondary)] transition-shadow p-4 cursor-pointer border border-gray-200">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3">
                    {getFileIcon(file.file_type)}
                  </div>
                  <h3 className="font-medium text-gray-800 text-sm mb-2 line-clamp-2 leading-tight min-h-9">
                    {file.name}
                  </h3>
                  <div className="text-xs text-gray-500 space-y-1 w-full">
                    <div className="flex justify-between">
                      <span>Tamaño:</span>
                      <span className="font-medium">{file.file_size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fecha:</span>
                      <span className="font-medium">{FormatDate(file.created_at)}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between">
                        <span className="inline-block bg-[var(--font)]  text-[var(--primary)] px-2 py-1 rounded-lg text-xs font-medium">
                            {file.subject}
                        </span>
                        <span>
                        <ActionFileDropdown
                          pageLevel={pageLevel}
                        />
                        </span>
                    </div>
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
                    <th className="text-left py-3 px-4 font-semibold text-[var(--textReverse)]">Archivo</th>
                    <th className="text-left py-3 px-4 font-semibold text-[var(--textReverse)]">Tamaño</th>
                    <th className="text-left py-3 px-4 font-semibold text-[var(--textReverse)]">Fecha</th>
                    <th className="text-left py-3 px-4 font-semibold text-[var(--textReverse)]">Materia</th>
                    <th className="text-left py-3 px-4 font-semibold text-[var(--textReverse)]">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file, index) => (
                    <tr key={file.id} className={`border-b border-[var(--secondary)] hover:bg-[var(--font)] cursor-pointer transition-colors ${index % 2 === 0 ? 'bg-[var(--fontBox)]' : 'bg-gray-100'}`}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.file_type)}
                          <span className="font-medium text-[var(--primary)]">{file.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[var(--primary)]">{file.file_size}</td>
                      <td className="py-3 px-4 text-[var(--primary)]">{FormatDate(file.created_at)}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block bg-[var(--font)] text-[var(--primary)] px-2 py-1 rounded-full text-xs font-medium">
                          {file.subject}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span>
                            <ActionFileDropdown pageLevel={pageLevel} />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mensaje cuando no hay archivos */}
        {filteredFiles.length === 0 && (
          <div className="text-center py-12 bg-[var(--fontBox)] rounded-lg shadow">
            <div className="text-gray-400 text-6xl mb-4">📁</div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No se encontraron recursos</h3>
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

    </div>
  );
};

export default FileManager;