import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from "@inertiajs/react";
import FileManager from '@/CustomComponents/FileManager';
import UploadFileModal from '@/CustomComponents/UploadFileModal';

export default function Resources() {

    // Datos de ejemplo
    const files = [
        {
            id: 1,
            name: 'Guía Clínica Anestesia General.pdf',
            size: '3.2 MB',
            date: '2024-03-15',
            subject: 'Anestesiología',
            type: 'pdf'
        },
        {
            id: 2,
            name: 'Protocolos Manejo Vía Aérea.docx',
            size: '1.5 MB',
            date: '2024-03-14',
            subject: 'Urgencias',
            type: 'docx'
        },
        {
            id: 3,
            name: 'Presentación Fármacos Anestésicos.pptx',
            size: '12.8 MB',
            date: '2024-03-13',
            subject: 'Farmacología',
            type: 'pptx'
        },
        {
            id: 4,
            name: 'Registro Dosis Pacientes.xlsx',
            size: '950 KB',
            date: '2024-03-12',
            subject: 'Control Clínico',
            type: 'xlsx'
        },
        {
            id: 5,
            name: 'Imagen Monitoreo Intraoperatorio.png',
            size: '2.6 MB',
            date: '2024-03-11',
            subject: 'Monitoreo',
            type: 'png'
        },
        {
            id: 6,
            name: 'Audio Procedimiento Intubación.mp3',
            size: '3.9 MB',
            date: '2024-03-10',
            subject: 'Capacitación',
            type: 'mp3'
        },
        {
            id: 7,
            name: 'Video Bloqueo Epidural.mp4',
            size: '52.3 MB',
            date: '2024-03-09',
            subject: 'Técnicas Regionales',
            type: 'mp4'
        },
        {
            id: 8,
            name: 'Notas Clase Ventilación Mecánica.txt',
            size: '210 KB',
            date: '2024-03-08',
            subject: 'Cuidados Intensivos',
            type: 'txt'
        }
    ];

    const subjects = [
        { id: 1, name: 'Anatomía Humana', code: 'ANAT101' },
        { id: 2, name: 'Fisiología', code: 'FISIO102' },
        { id: 3, name: 'Farmacología', code: 'FARMA103' },
        { id: 4, name: 'Anestesiología', code: 'ANES201' },
        { id: 5, name: 'Medicina Interna', code: 'MEDINT202' },
        { id: 6, name: 'Cirugía General', code: 'CIRUG203' },
        { id: 7, name: 'Urgencias Médicas', code: 'URGEN204' },
        { id: 8, name: 'Cuidados Intensivos', code: 'UCI205' }
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-emerald-800">
                    Recursos
                </h2>
            }
        >
            <Head title="Recursos" />

            <div>
                <FileManager files={files} subjects={subjects} />
            </div>
        </AuthenticatedLayout>
    );
}
