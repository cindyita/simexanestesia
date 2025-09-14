import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router, Head, usePage } from "@inertiajs/react";
import { useState } from 'react';
import ExamManager from '@/CustomComponents/manager/ExamManager';

export default function Exams() {

    const data = usePage().props.data;
    const pageLevel = usePage().props.menu[2]['level'];
    const isAdmin = usePage().props.user['mode_admin'] ? true : false;
    
    const exams = data.data;

    const [currentPage, setCurrentPage] = useState(data.current_page);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        router.get('exams', { page }, {});
    };

    return (
        <AuthenticatedLayout
            title="Examenes"
        >
            <div className="exams">
                <ExamManager
                    exams={exams}
                    currentPage={currentPage}
                    totalPages={data.last_page}
                    onPageChange={handlePageChange}
                    pageLevel={pageLevel}
                    isAdmin={isAdmin}
                />
            </div>
        </AuthenticatedLayout>
    );
}
