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
import { Link, router } from '@inertiajs/react';
import PrimaryButton from '../button/PrimaryButton';
import UploadFileModal from '../modal/UploadFileModal';

import { FormatDate } from '@/Functions/FormatDate';
import Select from '../form/Select';
import { useFetchDetails } from '@/hooks/useFetchDetails';
import Modal from '../modal/Modal';
import { toast } from 'sonner';
import ConfirmDeleteModal from '../modal/ConfirmDeleteModal';
import FormModal from '../modal/FormModal';
import { useFormValidation } from '@/hooks/useFormValidation';

const FileManager = ({files,subjects, currentPage=1, totalPages=1, onPageChange={},pageLevel=1, isAdmin=0}) => {
  const [viewType, setViewType] = useState('grid');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterFileType, setFilterFileType] = useState('');
  const [modalUpFileOpen, setModalUpFileOpen] = useState(false);
  const [modalDetailsOpen, setModalDetailsOpen] = useState(false);
  const [viewDetails, setViewDetails] = useState([]);
  const [selectedViewFile, setSelectedViewFile] = useState(null);
  const [modalViewFileOpen, setModalViewFileOpen] = useState([]);

  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const [deleteUrl, setDeleteUrl] = useState(null);
  const [modalEditOpen, setModalEditOpen] = useState(false);

  const [viewDetailsEdit, setViewDetailsEdit] = useState([]);
  const [formEdit, setFormEdit] = useState({});

  const getFileIcon = (fileType, filePath) => {
    
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FaFilePdf className="w-16 h-16 p-2 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FaFileWord className="w-16 h-16 p-2 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FaFileExcel className="w-16 h-16 p-2 text-green-500" />;
      case 'ppt':
      case 'pptx':
        return <FaFilePowerpoint className="w-16 h-16 p-2 text-orange-500" />;
       case "jpg":
        case "jpeg":
        case "png":
        case "svg":
        case "gif":
        case "bmp":
          if (filePath) {
            return (
              <span className="w-16 h-16">
                <img
                  src={`/storage/${filePath}`}
                  alt="preview"
                  loading="lazy"
                  className="w-16 h-16 object-contain rounded shadow"
                />
              </span>
            );
          }
          return <FaFileImage className="w-16 h-16 p-2 text-[var(--secondary)]" />;
      case 'mp3':
      case 'wav':
      case 'ogg':
        return <FaFileAudio className="w-16 h-16 p-2 text-[var(--secondary)]" />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <FaFileVideo className="w-16 h-16 p-2 text-[var(--secondary)]" />;
      default:
        return <FaFileAlt className="w-16 h-16 p-2 text-[var(--secondary)]" />;
    }
  };

  const subjectsList = [...new Set(
    files
      .map(file => file.subject)
      .filter(subject => subject && subject.trim() !== "")
  )].sort();
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

  const formatFileSize = (bytes,decimals = 0) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i];
  }

  const { fetchDetails } = useFetchDetails();
      
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

  const openFile = (file) => {
    setSelectedViewFile(file);
    setModalViewFileOpen(true);
  }

  let selectsubjects = [{ id: 0, name: "SELECCIONA" }, ...subjects];

  const handleActionFields = {
    id: { label: "id", type: "number", editable: false, show: false },
    file_type: { label: "file_type", type: "text", editable: false, show: false },
    name: { label: "Nombre", type: "text", editable: true, show: true, required: true, addEnd: ['.','file_type'] },
    description: { label: "Descripción", type: "textarea", editable: true, show: true },
    id_subject: { label: "Materia asociada", type: "select", options: selectsubjects, editable: true, show: true }
  };

  const handleActionUpdate = async (item) => {
    const details = await handleActionDetails(item.id);
      const row = details[0];

      const [baseName, ...extParts] = row.name.split(".");

      row['name'] = baseName;
    
      setViewDetailsEdit(row);
      setFormEdit(row);
      setModalEditOpen(true);
  }

  const handleActionDetails = async (id) => {
    const headerMap = {
      name: "Nombre",
      description: "Descripción",
      subject: "Materia asociada",
      file_type: "Tipo de archivo",
      download_count: "Descargas",
      view_count: "Vistas",
      uploaded_by: "Subido por",
      created_at: "Fecha de subida",
      updated_at: "Última actualización"
    };
    return await fetchDetails("/getFile", { id },headerMap);
  }

  const handleConfirmDelete = (item) => {
      setDeleteId(item.id);
      setDeleteUrl(item.file_path);
      setModalDeleteOpen(true);
  }
  const handleDelete = async (id,url) => {
      return new Promise((resolve, reject) => {
          router.visit('/resources', {
              method: 'post',
              data: {
                id_delete: id,
                url_delete: url
              },
              onSuccess: () => resolve(id),
              onError: (errors) => reject(errors),
          });
      });
  }

  const { validateForm } = useFormValidation(handleActionFields);

  const handleActionUpdateSend = async (form) => {
        const errors = validateForm(form);

        if (Object.keys(errors).length > 0) {
            console.error(errors);
            return Promise.reject(errors);
        }

        return new Promise((resolve, reject) => {
            router.visit('/resources', {
                method: 'post',
                data: { update: form },
                onSuccess: () => resolve(form),
                onError: (errors) => reject(errors),
            });
        });
  }

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {filteredFiles.map(file => (
              <div key={file.id} className="bg-[var(--fontBox)] rounded-lg shadow hover:shadow-lg hover:border-[var(--secondary)] transition-shadow p-4 pb-3 cursor-pointer border border-gray-200 select-none" onDoubleClick={() => openFile(file)}>
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3">
                    {getFileIcon(file.file_type,file.file_path)}
                  </div>
                  <h3 className="px-1 font-medium text-gray-800 text-sm mb-1 line-clamp-1 leading-tight overflow-hidden text-ellipsis break-all" title={file.name}>
                    {file.name}
                  </h3>
                  <div className="text-xs text-gray-400 space-y-1 w-full">
                    <div className="flex justify-between gap-1">
                      <span className="font-medium">{FormatDate(file.created_at)}</span>
                      <span className="font-medium">{formatFileSize(file.file_size)}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between">
                        <span>
                          {file.subject &&
                            <span className="inline-block bg-[var(--font)] text-[var(--primary)] px-2 py-1 rounded-lg text-xs font-medium max-w-40 lg:max-w-24 2xl:max-w-40 truncate overflow-hidden text-ellipsis break-all">
                              {file.subject}
                            </span>
                          }
                        </span>
                        <span>
                        <ActionFileDropdown
                          item = {file}
                          pageLevel={pageLevel}
                          onView={handleDetails}
                          onDelete={handleConfirmDelete}
                          onEdit={handleActionUpdate}
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
                    <tr key={file.id} className={`border-b border-[var(--secondary)] hover:bg-[var(--font)] cursor-pointer transition-colors select-none bg-[var(--fontBox)]`} onDoubleClick={() => openFile(file)}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.file_type, file.file_path)}
                          <span className="font-medium text-[var(--primary)] overflow-hidden text-ellipsis break-all text-start">{file.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[var(--primary)]">{formatFileSize(file.file_size)}</td>
                      <td className="py-3 px-4 text-[var(--primary)]">{FormatDate(file.created_at)}</td>
                      <td className="py-3 px-4">
                        <span>
                          {file.subject &&
                            <span className="inline-block bg-[var(--font)] text-[var(--primary)] px-2 py-1 rounded-full text-xs font-medium overflow-hidden text-ellipsis break-all text-start">
                              {file.subject}
                            </span>
                          }
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span>
                          <ActionFileDropdown
                            item={file}
                            pageLevel={pageLevel}
                            onView={handleDetails}
                            onDelete={handleConfirmDelete}
                            onEdit={handleActionUpdate}
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

      {(
        isAdmin ? (
          <>
            <UploadFileModal
              show={modalUpFileOpen}
              subjects={subjects}
              onClose={() => setModalUpFileOpen(false)}>
            </UploadFileModal>
          </>
        ) : ""
      )}

      {/* DETAILS MODAL */}
      <Modal show={modalDetailsOpen} onClose={() => setModalDetailsOpen(false)}>
          <div className="p-6 space-y-4">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-[var(--primary)]">
                      Detalles del archivo
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

      {/* VIEW FILE MODAL */}
      { selectedViewFile &&
        <Modal show={modalViewFileOpen} fullscreen={true} onClose={() => setModalViewFileOpen(false)}>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[var(--primary)]">
                {selectedViewFile.name}
              </h3>
              <button onClick={() => setModalViewFileOpen(false)} className="text-[var(--secondary)] hover:text-[var(--primary)]">
                <FaTimes />
              </button>
            </div>

            <div className="flex justify-center items-center">
              {selectedViewFile.file_type.match(/(jpg|jpeg|png|gif|bmp|svg)/i) && (
                <img
                  src={`/storage/${selectedViewFile.file_path}`}
                  alt={selectedViewFile.name}
                  className="max-w-full max-h-[70vh] object-contain"
                />
              )}

              {selectedViewFile.file_type === "pdf" && (
                <iframe
                  src={`/storage/${selectedViewFile.file_path}`}
                  className="w-full h-[86vh]"
                  title={selectedViewFile.name}
                />
              )}

              {selectedViewFile.file_type.match(/(mp4|mov|avi)/i) && (
                <video
                  controls
                  className="w-full max-w-[100%] h-auto max-h-[84vh] rounded shadow-lg"
                  onError={() => {
                    toast.error("El video no se pudo reproducir. Puede estar corrupto o en un formato no soportado.");
                  }}
                >
                  <source src={`/storage/${selectedViewFile.file_path}`} type={`${selectedViewFile.mime_type}`} />
                  Tu navegador no soporta la reproducción de video.
                </video>
              )}

              {selectedViewFile.file_type.match(/(mp3|wav|ogg)/i) && (
                <audio controls className="w-full">
                  <source src={`/storage/${selectedViewFile.file_path}`} type={`audio/${selectedViewFile.file_type}`} />
                  Tu navegador no soporta la reproducción de audio.
                </audio>
              )}

              {/* Para otros tipos de archivo */}
              {!selectedViewFile.file_type.match(/(jpg|jpeg|png|gif|bmp|svg|pdf|mp4|mov|avi|mp3|wav|ogg)/i) && (
                <p className="text-gray-500">No se puede previsualizar este tipo de archivo.</p>
              )}
            </div>
          </div>
        </Modal>
      }
      {/* DELETE MODAL */}
      <ConfirmDeleteModal
          show={modalDeleteOpen}
          onClose={() => setModalDeleteOpen(false)}
          onConfirm={async (id) => {
              try {
                  await handleDelete(id,deleteUrl);
                  setModalDeleteOpen(false);
                  setTimeout(() => {
                      toast.success("Se ha eliminado el archivo");
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
        title="Confirma la eliminación del archivo"
        text = "Esta acción no se puede deshacer."
      />
      {/* EDIT MODAL */}
      <FormModal
          open={modalEditOpen}
          setOpen={setModalEditOpen}
          title="Editar archivo"
          fields={handleActionFields}
          initialData={viewDetailsEdit || {}}
          onSubmit={async (form) => {
              await handleActionUpdateSend(form);
              setModalEditOpen(false);
          }}
      />

    </div>
  );
};

export default FileManager;