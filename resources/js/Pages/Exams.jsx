import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from "@inertiajs/react";
import ExamManager from '@/CustomComponents/ExamManager';

export default function Exams() {

    const data = usePage().props.data;

        // Datos de ejemplo
        const exams = [
            {
                id: 1,
                name: 'Fundamentos de Anestesia General',
                subject: 'Anestesiología',
                description: 'Examen sobre conceptos básicos de anestesia general: inducción, mantenimiento y recuperación.',
                timeLimit: 60,
                questionCount: 25,
                type: 'Opción Múltiple',
                difficulty: 'Intermedio',
                lastAttempt: {
                completed: true,
                score: 85,
                completedAt: '2024-03-10',
                timeUsed: 45,
                attempts: 2
                }
            },
            {
                id: 2,
                name: 'Farmacología de Agentes Anestésicos',
                subject: 'Farmacología',
                description: 'Evaluación sobre fármacos intravenosos, inhalatorios, opioides y relajantes musculares.',
                timeLimit: 90,
                questionCount: 30,
                type: 'Mixto',
                difficulty: 'Avanzado',
                lastAttempt: {
                completed: true,
                score: 92,
                completedAt: '2024-03-08',
                timeUsed: 78,
                attempts: 1
                }
            },
            {
                id: 3,
                name: 'Historia de la Anestesiología',
                subject: 'Historia Médica',
                description: 'Desarrollo de la anestesia desde el siglo XIX hasta la era moderna, avances y pioneros.',
                timeLimit: 75,
                questionCount: 40,
                type: 'Mixto',
                difficulty: 'Básico',
                lastAttempt: null
            },
            {
                id: 4,
                name: 'Manejo de la Vía Aérea Difícil',
                subject: 'Urgencias',
                description: 'Protocolos de intubación, dispositivos alternativos y algoritmos en vía aérea complicada.',
                timeLimit: 120,
                questionCount: 35,
                type: 'Desarrollo',
                difficulty: 'Avanzado',
                lastAttempt: {
                completed: true,
                score: 78,
                completedAt: '2024-03-12',
                timeUsed: 115,
                attempts: 3
                }
            },
            {
                id: 5,
                name: 'Fisiología de la Ventilación Mecánica',
                subject: 'Cuidados Intensivos',
                description: 'Principios fundamentales de ventilación mecánica y estrategias de protección pulmonar.',
                timeLimit: 100,
                questionCount: 28,
                type: 'Opción Múltiple',
                difficulty: 'Avanzado',
                lastAttempt: null
            },
            {
                id: 6,
                name: 'Monitorización Hemodinámica',
                subject: 'Monitoreo',
                description: 'Evaluación de monitoreo invasivo y no invasivo: presión arterial, capnografía y gases arteriales.',
                timeLimit: 45,
                questionCount: 50,
                type: 'Opción Múltiple',
                difficulty: 'Intermedio',
                lastAttempt: {
                completed: true,
                score: 88,
                completedAt: '2024-03-14',
                timeUsed: 42,
                attempts: 1
                }
            },
            {
                id: 7,
                name: 'Anestesia Regional y Bloqueos Nerviosos',
                subject: 'Técnicas Regionales',
                description: 'Evaluación de técnicas de anestesia espinal, epidural y periféricas.',
                timeLimit: 80,
                questionCount: 15,
                type: 'Desarrollo',
                difficulty: 'Intermedio',
                lastAttempt: null
            },
            {
                id: 8,
                name: 'Fisiología del Dolor y Analgesia',
                subject: 'Manejo del Dolor',
                description: 'Mecanismos neurofisiológicos del dolor, escalas y estrategias de analgesia multimodal.',
                timeLimit: 95,
                questionCount: 32,
                type: 'Mixto',
                difficulty: 'Avanzado',
                lastAttempt: {
                completed: true,
                score: 94,
                completedAt: '2024-03-11',
                timeUsed: 89,
                attempts: 1
                }
            }
        ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-emerald-800">
                    Examenes
                </h2>
            }
        >
            <Head title="Examenes" />

            <div className="exams">
                <ExamManager exams={exams}></ExamManager>
            </div>
        </AuthenticatedLayout>
    );
}
