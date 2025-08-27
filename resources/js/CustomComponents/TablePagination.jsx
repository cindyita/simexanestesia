import { useState, useRef, useMemo } from 'react';

import { 
    Table,
    Header,
    HeaderRow,
    HeaderCell,
    Body,
    Row,
    Cell
} from "@table-library/react-table-library/table";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useSort } from "@table-library/react-table-library/sort";

import IconButton from '@/CustomComponents/button/IconButton';
import TextInput from '@/CustomComponents/form/TextInput';
import ActionDropdown from '@/CustomComponents/ActionDropdown';

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

import { FaFileCsv, FaFilePdf, FaGear, FaSort, FaSortUp, FaSortDown, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

function TableComp({ 
    id_table, 
    table_name, 
    columns, 
    dataRaw, 
    downloadBtns, 
    actionBtns, 
    useFormatDate = true, 
    showTime = false, 
    customActions = [],
    columnWidths = {}, // Nuevo prop para definir anchos de columnas
    pagination = true, // Nuevo prop para habilitar/deshabilitar paginación
    pageSize = 10, // Nuevo prop para tamaño de página
    pageSizeOptions = [5, 10, 25, 50, 100] // Opciones de tamaño de página
}) {

    //--------------------------------------------
    // FORMAT DATE
    const formatDate = (dateString, showTime) => {
        const date = new Date(dateString);

        if (showTime) {
            return date.toLocaleString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } else {
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        }
    };

    //--------------------------------------------
    // PROCESS RAW DATA
    const processData = dataRaw.map(user => {
        const filteredUser = {};
        
        Object.keys(columns).forEach(originalKey => {
            const newKey = columns[originalKey];
            
            if (useFormatDate && (originalKey === 'created_at' || originalKey === 'updated_at')) {
                filteredUser[newKey] = formatDate(user[originalKey], showTime);
            } else {
                filteredUser[newKey] = user[originalKey];
            }
        });
        
        return filteredUser;
    });

    const data = {
        nodes: processData.map((item, index) => ({
            id: item.id ?? index + 1, 
            ...item,
        })),
    };

    //--------------------------------------------
    // GENERAL AND USESTATE
    const exportName = `${id_table}_${new Date().toISOString().split("T")[0]}`;

    const theme = useTheme(getTheme());

    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageSize, setCurrentPageSize] = useState(pageSize);

    //--------------------------------------------
    // HANDLES
    const handleSearch = (event) => {
        setSearch(event.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (event) => {
        setCurrentPageSize(Number(event.target.value));
        setCurrentPage(1); // Reset to first page when changing page size
    };

    const actionHandlers = {
        onView: (item) => {
            console.log('Viendo:', item);
        },
        onEdit: (item) => {
            console.log('Editando:', item);
        },
        onDelete: (item) => {
            if (confirm('¿Eliminar este registro?')) {
                console.log('Eliminando:', item);
            }
        }
    };

    //--------------------------------------------
    // SORT FUNCTIONALITY
    const keys = Object.keys(data.nodes[0] || {});
    
    const sort = useSort(
        data,
        {
            onChange: onSortChange,
        },
        {
            sortFns: keys.reduce((acc, key) => {
                acc[key.toUpperCase()] = (array) =>
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
                return acc;
            }, {})
        }
    );

    function onSortChange(action, state) {
        console.log(action, state);
    }

    //--------------------------------------------
    // COLUMN CONFIGURATION
    const getColumnWidth = (key) => {
        // Si se especifica un ancho personalizado, usarlo
        if (columnWidths[key]) {
            return columnWidths[key];
        }
        
        // Calcular ancho basado en contenido
        const maxLength = Math.max(
            key.length, // Longitud del header
            ...data.nodes.map(item => 
                String(item[key] || '').length
            ).slice(0, 50) // Solo revisar primeras 50 filas para performance
        );
        
        // Establecer un ancho base + factor de caracteres
        const baseWidth = 80;
        const charWidth = 8;
        const calculatedWidth = Math.min(Math.max(baseWidth, maxLength * charWidth), 300);
        
        return `${calculatedWidth}px`;
    };

    const getSortIcon = (key) => {
        if (sort.state?.sortKey === key.toUpperCase()) {
            return sort.state.reverse ? <FaSortDown className="ml-1" /> : <FaSortUp className="ml-1" />;
        }
        return <FaSort className="ml-1 opacity-50" />;
    };

    //--------------------------------------------
    // DOWNLOAD CSV
    const escapeCsvCell = (cell) => {
        if (cell == null) { return ""; }

        const sc = cell.toString().trim();
        if (sc === "" || sc === '""') { return sc; }

        if (sc.includes('"') || sc.includes(",") || sc.includes("\n") || sc.includes("\r")) {
            return `"${sc.replace(/\"/g, '""')}"`;
        }

        return sc;
    };

    const makeCsvData = (columns, data) => {
        return data.reduce((csvString, rowItem) => {
            return (csvString + columns
                .map((key) => escapeCsvCell(rowItem[key]))
                .join(",") + "\r\n"
            );
        }, columns.join(",") + "\r\n");
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
        const csvColumns = actionBtns ? keys : keys; // Excluir columna de acciones
        // Use all filtered data for CSV, not just current page
        downloadAsCsv(csvColumns, filteredNodes, filename);
    };

    //--------------------------------------------
    // DOWNLOAD PDF
    const printRef = useRef();

    const handleDownloadPdf = async () => {
        const element = printRef.current;
        const canvas = await html2canvas(element);
        const data = canvas.toDataURL("image/png");

        const pdf = new jsPDF();
        const imgProperties = pdf.getImageProperties(data);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

        pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${exportName}.pdf`);
    };

    //--------------------------------------------
    // SEARCH FILTER AND PAGINATION
    const filteredNodes = useMemo(() => {
        return data.nodes.filter((item) => {
            return keys.some((key) =>
                item[key]?.toString().toLowerCase().includes(search.toLowerCase())
            );
        });
    }, [data.nodes, keys, search]);

    // Pagination calculations
    const totalPages = pagination ? Math.ceil(filteredNodes.length / currentPageSize) : 1;
    const startIndex = pagination ? (currentPage - 1) * currentPageSize : 0;
    const endIndex = pagination ? startIndex + currentPageSize : filteredNodes.length;
    const paginatedNodes = pagination ? filteredNodes.slice(startIndex, endIndex) : filteredNodes;

    // Pagination component
    const renderPagination = () => {
        if (!pagination || totalPages <= 1) return null;

        const getPageNumbers = () => {
            const pages = [];
            const maxVisiblePages = 5;
            
            if (totalPages <= maxVisiblePages) {
                for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                const start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                const end = Math.min(totalPages, start + maxVisiblePages - 1);
                
                if (start > 1) {
                    pages.push(1);
                    if (start > 2) pages.push('...');
                }
                
                for (let i = start; i <= end; i++) {
                    pages.push(i);
                }
                
                if (end < totalPages) {
                    if (end < totalPages - 1) pages.push('...');
                    pages.push(totalPages);
                }
            }
            
            return pages;
        };

        return (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 p-4 border-t border-gray-200">
                {/* Page size selector */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Mostrar:</span>
                    <select
                        value={currentPageSize}
                        onChange={handlePageSizeChange}
                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                        {pageSizeOptions.map(size => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                    <span>registros por página</span>
                </div>

                {/* Page info */}
                <div className="text-sm text-gray-600">
                    Mostrando {startIndex + 1} a {Math.min(endIndex, filteredNodes.length)} de {filteredNodes.length} resultados
                    {search && <span> para "{search}"</span>}
                </div>

                {/* Pagination buttons */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-1"
                    >
                        <FaChevronLeft className="w-3 h-3" />
                        Anterior
                    </button>

                    <div className="flex gap-1">
                        {getPageNumbers().map((page, index) => (
                            <button
                                key={index}
                                onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                                disabled={typeof page !== 'number'}
                                className={`px-3 py-1 rounded text-sm ${
                                    page === currentPage
                                        ? 'bg-emerald-600 text-white'
                                        : typeof page === 'number'
                                        ? 'border border-gray-300 hover:bg-gray-50'
                                        : 'cursor-default'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-1"
                    >
                        Siguiente
                        <FaChevronRight className="w-3 h-3" />
                    </button>
                </div>
            </div>
        );
    };

    //---------------------------------------------
    // MOBILE CARDS
    const renderMobileCards = () => (
        <div className="grid gap-4 md:hidden">
            {paginatedNodes.map((item, index) => (
                <div key={index} className="bg-white border border-emerald-200 rounded-lg p-4 shadow-sm">
                    {keys.map((key) => (
                        <div key={key} className="flex justify-between items-center py-1 border-b border-emerald-100 last:border-b-0">
                            <span className="font-medium text-emerald-600 text-sm">
                                {key.charAt(0).toUpperCase() + key.slice(1)}:
                            </span>
                            <span className="text-emerald-900 text-sm">
                                {item[key] instanceof Date
                                    ? item[key].toLocaleDateString()
                                    : item[key]?.toString()}
                            </span>
                        </div>
                    ))}
                    {actionBtns && (
                        <div className="flex justify-between items-center py-1">
                            <span className="font-medium text-emerald-600 text-sm">
                                Acciones:
                            </span>
                            <span className="text-emerald-900 text-sm">
                                <div>
                                    <ActionDropdown
                                        item={item}
                                        onView={actionHandlers.onView}
                                        onEdit={actionHandlers.onEdit}
                                        onDelete={actionHandlers.onDelete}
                                        customActions={customActions}
                                    />
                                </div>
                            </span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

    // RETURN --------------------------------------------------------
    return (
        <div id={id_table} ref={printRef} className="w-full max-w-full">
            <div className="overflow-hidden">
                
                <div className="p-2 sm:p-4 sm:pb-0 sm:pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center">
                            <h3 className="text-lg font-semibold">
                                {table_name}
                            </h3>
                        </div>
            
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* DATA DOWNLOAD BUTTONS */}
                            {downloadBtns && (
                                <div className="flex gap-2 justify-start sm:justify-start">
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
                                </div>
                            )}
                
                            {/* SEARCH */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="h-4 w-4 text-emerald-300" />
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
        
                {/* TABLE */}
                <div className="p-2 sm:p-4 sm:pt-2 relative">
                    {/* Desktop */}
                    <div className="hidden md:block overflow-x-auto">
                        <div className="overflow-x-auto max-h-96 overflow-y-auto">
                            <Table 
                                data={{ nodes: paginatedNodes }}
                                sort={sort}
                                theme={{
                                    ...theme,
                                    Table: `
                                        background-color: white;
                                        border-radius: 8px;
                                        font-size: 14px;
                                        border-collapse: collapse;
                                        width: 100%;
                                        table-layout: fixed;
                                    `,
                                    Header: {
                                        backgroundColor: '#f8fafc',
                                    },
                                    HeaderRow: `
                                        background-color: #f8fafc;
                                        border-bottom: 2px solid #e5e7eb;
                                    `,
                                    HeaderCell: `
                                        padding: 12px;
                                        color: #374151;
                                        font-weight: 600;
                                        text-align: left;
                                        border-right: 1px solid #e5e7eb;
                                        cursor: pointer;
                                        user-select: none;
                                        &:hover {
                                            background-color: #f1f5f9;
                                        }
                                        &:last-child {
                                            border-right: none;
                                        }
                                    `,
                                    Row: `
                                        background-color: white;
                                        &:nth-of-type(even) {
                                            background-color: #f9fafb;
                                        }
                                        &:hover {
                                            background-color: #f3f4f6;
                                        }
                                    `,
                                    Cell: `
                                        padding: 12px;
                                        border-right: 1px solid #e5e7eb;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                        &:last-child {
                                            border-right: none;
                                        }
                                    `,
                                }}
                                layout={{ 
                                    fixedHeader: true,
                                    horizontalScroll: true 
                                }}
                            >
                                {(tableList) => (
                                    <>
                                        <Header>
                                            <HeaderRow>
                                                {keys.map((key) => (
                                                    <HeaderCell 
                                                        key={key}
                                                        sortKey={key.toUpperCase()}
                                                        style={{ 
                                                            width: getColumnWidth(key),
                                                            minWidth: getColumnWidth(key)
                                                        }}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            {key.charAt(0).toUpperCase() + key.slice(1)}
                                                            {getSortIcon(key)}
                                                        </div>
                                                    </HeaderCell>
                                                ))}
                                                {actionBtns && (
                                                    <HeaderCell 
                                                        style={{ 
                                                            width: columnWidths.actions || '120px',
                                                            minWidth: columnWidths.actions || '120px'
                                                        }}
                                                    >
                                                        Acciones
                                                    </HeaderCell>
                                                )}
                                            </HeaderRow>
                                        </Header>

                                        <Body>
                                            {tableList.map((item, index) => (
                                                <Row key={item.id || index} item={item}>
                                                    {keys.map((key) => (
                                                        <Cell 
                                                            key={key}
                                                            style={{ 
                                                                width: getColumnWidth(key),
                                                                minWidth: getColumnWidth(key)
                                                            }}
                                                            title={item[key]?.toString()} // Tooltip para contenido truncado
                                                        >
                                                            {item[key] instanceof Date
                                                                ? item[key].toLocaleDateString()
                                                                : item[key]?.toString()}
                                                        </Cell>
                                                    ))}
                                                    {actionBtns && (
                                                        <Cell 
                                                            style={{ 
                                                                width: columnWidths.actions || '120px',
                                                                minWidth: columnWidths.actions || '120px'
                                                            }}
                                                        >
                                                            <ActionDropdown
                                                                item={item}
                                                                onView={actionHandlers.onView}
                                                                onEdit={actionHandlers.onEdit}
                                                                onDelete={actionHandlers.onDelete}
                                                                customActions={customActions}
                                                            />
                                                        </Cell>
                                                    )}
                                                </Row>
                                            ))}
                                        </Body>
                                    </>
                                )}
                            </Table>
                        </div>
                    </div>
            
                    {/* Mobile */}
                    <div className="md:hidden overflow-y-auto">
                        <div className="space-y-2">
                            {renderMobileCards()}
                        </div>
                    </div>
                
                    {/* Pagination for both desktop and mobile */}
                    {renderPagination()}
                </div>
            </div>
        </div>
    );
}

export default TableComp;