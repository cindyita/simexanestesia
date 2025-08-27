import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router,Head, usePage } from "@inertiajs/react";
import { useState } from 'react';
import FileManager from '@/CustomComponents/FileManager';
import UploadFileModal from '@/CustomComponents/UploadFileModal';

export default function Resources() {

    const data = usePage().props.data;
    const subjects = usePage().props.subjects;

    const files = data.data;
    const [currentPage, setCurrentPage] = useState(data.current_page);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        router.get('resources', { page }, {});
    };

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
                <FileManager
                    files={files}
                    subjects={subjects}
                    currentPage={currentPage}
                    totalPages={data.last_page}
                    onPageChange={handlePageChange}
                />
            </div>
        </AuthenticatedLayout>
    );
}
