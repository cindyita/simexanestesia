import { useState, useRef } from 'react';
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useSort } from "@table-library/react-table-library/sort";
import { FaFileCsv, FaFilePdf, FaGear, FaSearch } from "react-icons/fa6";

// Componentes UI simulados
const IconButton = ({ onClick, children, className = "" }) => (
  <button 
    onClick={onClick}
    className={`p-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors ${className}`}
  >
    {children}
  </button>
);

const TextInput = ({ value, onChange, placeholder, type = "text", className = "" }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  />
);

function ResponsiveTableComp({ id_table = "table", table_name = "Tabla de Datos", data }) {
  // Datos de ejemplo si no se proporcionan
  const defaultData = {
    nodes: [
      { id: 1, nombre: "Juan Pérez", email: "juan@example.com", edad: 25, departamento: "Ventas", fecha: new Date('2023-01-15') },
      { id: 2, nombre: "María García", email: "maria@example.com", edad: 32, departamento: "Marketing", fecha: new Date('2023-02-20') },
      { id: 3, nombre: "Carlos López", email: "carlos@example.com", edad: 28, departamento: "IT", fecha: new Date('2023-03-10') },
      { id: 4, nombre: "Ana Martínez", email: "ana@example.com", edad: 35, departamento: "Recursos Humanos", fecha: new Date('2023-04-05') },
      { id: 5, nombre: "Pedro Rodríguez", email: "pedro@example.com", edad: 29, departamento: "Finanzas", fecha: new Date('2023-05-12') },
    ]
  };

  const tableData = data || defaultData;
  const exportName = `${id_table}_${new Date().toISOString().split("T")[0]}`;

  const theme = useTheme(getTheme());
  const [search, setSearch] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);

  const handleSearch = (event) => setSearch(event.target.value);

  const keys = Object.keys(tableData.nodes[0] || {});
  const sortFns = {};
  const COLUMNS = keys.map((key) => {
    sortFns[key.toUpperCase()] = (array) =>
      array.sort((a, b) => {
        const valA = a[key];
        const valB = b[key];

        if (typeof valA === "string" && typeof valB === "string") {
          return valA.localeCompare(valB);
        }
        if (typeof valA === "number" && typeof valB === "number") {
          return valA - valB;
        }
        if (valA instanceof Date && valB instanceof Date) {
          return valA.getTime() - valB.getTime();
        }
        return 0;
      });

    return {
      label: key.charAt(0).toUpperCase() + key.slice(1),
      renderCell: (item) =>
        item[key] instanceof Date
          ? item[key].toLocaleDateString()
          : item[key]?.toString(),
      accessor: (item) => item[key],
      sort: { sortKey: key.toUpperCase() },
      resize: true
    };
  });

  const sort = useSort(tableData, {}, { sortFns });
  
  // Funciones de descarga (simuladas)
  const escapeCsvCell = (cell) => {
    if (cell == null) return "";
    const sc = cell.toString().trim();
    if (sc === "" || sc === '""') return sc;
    if (sc.includes('"') || sc.includes(",") || sc.includes("\n") || sc.includes("\r")) {
      return '"' + sc.replace(/"/g, '""') + '"';
    }
    return sc;
  };

  const makeCsvData = (columns, data) => {
    return data.reduce((csvString, rowItem) => {
      return (
        csvString +
        columns
          .map(({ accessor }) => escapeCsvCell(accessor(rowItem)))
          .join(",") +
        "\r\n"
      );
    }, columns.map(({ label }) => escapeCsvCell(label)).join(",") + "\r\n");
  };

  const downloadAsCsv = (columns, data, filename) => {
    const csvData = makeCsvData(columns, data);
    const csvFile = new Blob([csvData], { type: "text/csv" });
    const downloadLink = document.createElement("a");
    downloadLink.style.display = "none";
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleDownloadCsv = () => {
    const filename = `${exportName}.csv`;
    downloadAsCsv(COLUMNS, tableData.nodes, filename);
  };

  const handleDownloadPdf = async () => {
    // Simulación de descarga PDF
    console.log("Descargando PDF...");
  };

  const printRef = useRef();

  const filteredNodes = tableData.nodes.filter((item) => {
    return keys.some((key) =>
      item[key]?.toString().toLowerCase().includes(search.toLowerCase())
    );
  });

  const filteredData = { nodes: filteredNodes };

  // Renderizado mobile como cards
  const renderMobileCards = () => (
    <div className="grid gap-4 md:hidden">
      {filteredNodes.map((item, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          {keys.map((key) => (
            <div key={key} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
              <span className="font-medium text-gray-600 text-sm">
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </span>
              <span className="text-gray-900 text-sm">
                {item[key] instanceof Date
                  ? item[key].toLocaleDateString()
                  : item[key]?.toString()}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div id={id_table} ref={printRef} className="w-full max-w-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header responsive */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Título */}
            <div className="flex items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {table_name}
              </h3>
            </div>

            {/* Controles */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              {/* Botones de acción */}
              <div className="flex gap-2 justify-center sm:justify-start">
                <IconButton 
                  onClick={handleDownloadCsv}
                  className="text-xs px-3 py-2"
                >
                  <FaFileCsv className="w-4 h-4" />
                </IconButton>
                <IconButton 
                  onClick={handleDownloadPdf}
                  className="text-xs px-3 py-2"
                >
                  <FaFilePdf className="w-4 h-4" />
                </IconButton>
                <IconButton className="text-xs px-3 py-2">
                  <FaGear className="w-4 h-4" />
                </IconButton>
              </div>

              {/* Buscador */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <TextInput
                  type="text"
                  value={search}
                  placeholder="Buscar en la tabla..."
                  onChange={handleSearch}
                  className="pl-10 w-full sm:w-64 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contenido de la tabla */}
        <div className="p-4">
          {/* Vista desktop - tabla normal */}
          <div className="hidden md:block overflow-x-auto">
            <div style={{ minWidth: '600px' }}>
              <CompactTable
                columns={COLUMNS}
                data={filteredData}
                sort={sort}
                theme={{
                  ...theme,
                  Table: `
                    --data-table-library_grid-template-columns: ${COLUMNS.map(() => 'minmax(120px, 1fr)').join(' ')};
                    background-color: white;
                    border-radius: 8px;
                    font-size: 14px;
                  `,
                  Header: {
                    backgroundColor: '#f8fafc',
                    color: '#374151',
                    fontWeight: '600',
                    borderBottom: '2px solid #e5e7eb',
                  },
                  Row: {
                    backgroundColor: 'white',
                    '&:nth-of-type(even)': {
                      backgroundColor: '#f9fafb',
                    },
                    '&:hover': {
                      backgroundColor: '#f3f4f6',
                    },
                  },
                  Cell: {
                    padding: '12px',
                    borderRight: '1px solid #e5e7eb',
                    '&:last-child': {
                      borderRight: 'none',
                    },
                  },
                }}
                layout={{ 
                  fixedHeader: true,
                  horizontalScroll: true 
                }}
              />
            </div>
          </div>

          {/* Vista mobile - cards */}
          <div className="md:hidden">
            {renderMobileCards()}
          </div>

          {/* Información de resultados */}
          <div className="mt-4 text-sm text-gray-500 text-center md:text-left">
            Mostrando {filteredNodes.length} de {tableData.nodes.length} resultados
            {search && (
              <span className="ml-2">
                para "{search}"
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Estilos CSS adicionales */}
      <style jsx>{`
        .table-library_table {
          width: 100%;
        }
        
        .table-library_header {
          position: sticky;
          top: 0;
          z-index: 10;
        }
        
        @media (max-width: 768px) {
          .table-library_table {
            display: none;
          }
        }
        
        /* Mejoras para el scroll horizontal en móviles */
        .overflow-x-auto {
          -webkit-overflow-scrolling: touch;
        }
        
        /* Ocultar handles de resize en móviles */
        @media (max-width: 768px) {
          .resizer-handle {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ResponsiveTableComp;