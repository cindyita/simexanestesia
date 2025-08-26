import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from "@inertiajs/react";
import TableComp from '@/CustomComponents/TableComp';

export default function History() {
    const { data, auth } = usePage().props;
    const user = auth.user;
    const isAdmin = user.id_rol === 1;
    
    const columns = isAdmin ? {
        'id': 'id',
        'student_name': 'Alumno',
        'exam_name': 'Examen',
        'score': 'P%',
        'time_used': 'Tiempo',
        'attempt_number': 'Intento #',
        'completed_at': 'Fecha'
    } : {
        'id': 'id',
        'exam_name': 'Examen',
        'score': 'P%',
        'time_used': 'Tiempo',
        'attempt_number': 'Intento #',
        'completed_at': 'Fecha'
    };

    // Datos de ejemplo
    const exampleData = isAdmin ? [
        {
            'id': 1,
            'student_name': 'María García López',
            'exam_name': 'Fundamentos de React',
            'score': '85%',
            'time_used': 45,
            'attempt_number': 2,
            'completed_at': '2024-03-15 10:15'
        },
        {
            'id': 2,
            'student_name': 'Carlos Rodríguez Pérez',
            'exam_name': 'Álgebra Lineal - Parcial 1',
            'score': '92%',
            'time_used': 78,
            'attempt_number': 1,
            'completed_at': '2024-03-14 15:18'
        },
        {
            'id': 3,
            'student_name': 'Ana Martínez Silva',
            'exam_name': 'Historia Mundial Contemporánea',
            'score': '76%',
            'time_used': 65,
            'attempt_number': 1,
            'completed_at': '2024-03-13 12:20'
        },
        {
            'id': 4,
            'student_name': 'Luis González Torres',
            'exam_name': 'Laboratorio de Química Orgánica',
            'score': '78%',
            'time_used': 115,
            'attempt_number': 3,
            'completed_at': '2024-03-12 18:25'
        },
        {
            'id': 5,
            'student_name': 'Sofía Herrera Morales',
            'exam_name': 'Grammar and Vocabulary Test',
            'score': '88%',
            'time_used': 42,
            'attempt_number': 1,
            'completed_at': '2024-03-11 10:42'
        }
    ] : [
        {
            'id': 1,
            'exam_name': 'Fundamentos de React',
            'score': '85%',
            'time_used': 45,
            'attempt_number': 2,
            'completed_at': '2024-03-15 10:15'
        },
        {
            'id': 2,
            'exam_name': 'Álgebra Lineal - Parcial 1',
            'score': '92%',
            'time_used': 78,
            'attempt_number': 1,
            'completed_at': '2024-03-14 15:18'
        },
        {
            'id': 3,
            'exam_name': 'Historia Mundial Contemporánea',
            'score': '76%',
            'time_used': 65,
            'attempt_number': 1,
            'completed_at': '2024-03-13 12:20'
        },
        {
            'id': 4,
            'exam_name': 'Grammar and Vocabulary Test',
            'score': '88%',
            'time_used': 42,
            'attempt_number': 1,
            'completed_at': '2024-03-11 10:42'
        }
    ];

    const tableData = data || exampleData;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-emerald-800">
                    {isAdmin ? 'Historial de intentos de alumnos' : 'Mi Historial de Intentos'}
                </h2>
            }
        >
            <Head title="Historial" />
            <div className="logs">
                <div>
                    <div className="bg-white rounded-lg">
                        <div className="p-6 text-emerald-900">

                            <TableComp
                                id_table={'history_table'}
                                table_name={isAdmin ? 'Historial de intentos de alumnos' : 'Mi Historial de Intentos'}
                                columns={columns}
                                dataRaw={tableData}
                                downloadBtns={true}
                                actionBtns={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}