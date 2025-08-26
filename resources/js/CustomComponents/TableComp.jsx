import { useState,useRef } from 'react';

import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useSort } from "@table-library/react-table-library/sort";

import IconButton from '@/CustomComponents/button/IconButton';
import TextInput from '@/CustomComponents/form/TextInput';
import ActionDropdown from '@/CustomComponents/ActionDropdown';

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

import { FaFileCsv, FaFilePdf, FaGear } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";


function TableComp({ id_table, table_name, columns, dataRaw, downloadBtns, actionBtns, useFormatDate = true, showTime = false, customActions=[] }) {

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
                filteredUser[newKey] = formatDate(user[originalKey],showTime);
            } else {
                filteredUser[newKey] = user[originalKey];
            }
        });
        
        return filteredUser;
    });

    const data = {
        nodes: processData.map((item, index) => ({
            id: item.id ?? index+1, ...item,
        })),
    };


    //--------------------------------------------
    // GENERAL AND USESTATE
    const exportName = `${id_table}_${new Date().toISOString().split("T")[0]}`;

    const theme = useTheme(getTheme());

    const [search, setSearch] = useState('');

    //--------------------------------------------
    // HANDLES
    const handleSearch = (event) => setSearch(event.target.value);

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
    // MAP COLUMNS AND SORT
    const keys = Object.keys(data.nodes[0] || {});
    const sortFns = {};
    const createColumns = (keys, actionBtns = false, actionHandlers = {}) => {
      const mapColumns = keys.map((key) => {
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
            key,
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
    
      if (actionBtns) {
        const actionsColumn = {
        key:'action',
          label: "Acciones",
          renderCell: (item) => (
            <ActionDropdown
              item={item}
              onView={actionHandlers.onView}
              onEdit={actionHandlers.onEdit}
              onDelete={actionHandlers.onDelete}
              customActions={customActions}
            />
          ),
          accessor: () => "",
            sort: false,
            resize: false,
            width: 30
        };
    
        mapColumns.push(actionsColumn);
      }
    
      return mapColumns;
    };
    
    const mapColumns = createColumns(keys, actionBtns, actionHandlers);

    const sort = useSort(data, {}, { sortFns });
    
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
            .map(({ accessor }) => escapeCsvCell(accessor(rowItem)))
            .join(",") + "\r\n"
        );
        }, columns.map(({ name }) => escapeCsvCell(name)).join(",") + "\r\n");
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
        downloadAsCsv(mapColumns, data.nodes, filename);
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
    // SEARCH FILTER
    const filteredNodes = data.nodes.filter((item) => {
        return keys.some((key) =>
            item[key]?.toString().toLowerCase().includes(search.toLowerCase())
        );
    });

    const filteredData = { nodes: filteredNodes };

    //---------------------------------------------
    // MOBILE CARDS
    const renderMobileCards = () => (
        <div className="grid gap-4 md:hidden">
        {filteredNodes.map((item, index) => (
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
                            {downloadBtns &&
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
                                    {/* <IconButton className="text-xs px-3 py-2">
                                    <FaGear className="w-4 h-4" />
                                </IconButton> */}
                                </div>
                            }
                
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
                            <div style={{ minWidth: '600px' }}>
                                <CompactTable
                                    columns={mapColumns}
                                    data={filteredData}
                                    sort={sort}
                                    theme={{
                                        ...theme,
                                        Table: `
                                            --data-table-library_grid-template-columns: ${mapColumns.map(() => 'auto').join(' ')};
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
                    </div>
            
                    {/* Mobile */}
                    <div className="md:hidden overflow-y-auto">
                        <div className="space-y-2">
                            {renderMobileCards()}
                        </div>
                    </div>
                
                    {/* Pagination */}
                    <div className="mt-4 text-sm text-gray-500 text-center md:text-left">
                        Mostrando {filteredNodes.length} de {data.nodes.length} resultados
                        {search && (
                        <span> para "{search}"</span>
                        )}
                    </div>
                </div>
            </div>
    
        </div>
    );
}

export default TableComp;