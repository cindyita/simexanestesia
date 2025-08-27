import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router, Head, usePage } from "@inertiajs/react";
import { useState } from 'react';
import ExamManager from '@/CustomComponents/ExamManager';

export default function Exams() {

    const data = usePage().props.data;
    const exams = data.data;

    const [currentPage, setCurrentPage] = useState(data.current_page);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        router.get('exams', { page }, {});
    };

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
                <ExamManager
                    exams={exams}
                    currentPage={currentPage}
                    totalPages={data.last_page}
                    onPageChange={handlePageChange}
                ></ExamManager>
            </div>
        </AuthenticatedLayout>
    );
}
