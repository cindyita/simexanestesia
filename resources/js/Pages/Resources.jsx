import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router,Head, usePage } from "@inertiajs/react";
import { useState } from 'react';
import FileManager from '@/CustomComponents/manager/FileManager';
import UploadFileModal from '@/CustomComponents/modal/UploadFileModal';

export default function Resources() {

    const data = usePage().props.data;
    const pageLevel = usePage().props.menu[4]['level'];
    const isAdmin = usePage().props.user['mode_admin'] ? true : false;
    const subjects = usePage().props.subjects;

    const files = data.data;
    const [currentPage, setCurrentPage] = useState(data.current_page);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        router.get('resources', { page }, {});
    };

    return (
        <AuthenticatedLayout
            title="Recursos"
        >

            <div>
                <FileManager
                    files={files}
                    subjects={subjects}
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
