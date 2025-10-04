import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router, Head, usePage } from "@inertiajs/react";
import { useState } from 'react';
import TableComp from '@/CustomComponents/table/TableComp';
import { useFetchDetails } from '@/hooks/useFetchDetails';
import { useFormValidation } from '@/hooks/useFormValidation';
import FormModal from '@/CustomComponents/modal/FormModal';
import PrimaryButton from '@/CustomComponents/button/PrimaryButton';

export default function Subjects() {
    if (!usePage().props.menu[15]) return;
    
    const data = usePage().props.data;
    const pageLevel = usePage().props.menu[15]['level'];
    
    const subjects = data.data;

    const [currentPage, setCurrentPage] = useState(data.current_page);
    const [modalNewOpen, setModalNewOpen] = useState(false);
        
    const handlePageChange = (page) => {
        setCurrentPage(page);
        router.get('subjects', { page }, {});
    };

    const handleDelete = (id) => {
        router.visit('/subjects', {
            method: 'post',
            data: {
                id_delete: id
            },
        });
    }

    const { fetchDetails, loading, error } = useFetchDetails();

    const handleDetails = async (id, useHeaders = true) => {
        if (useHeaders) {
                const headerMap = {
                id: "id",
                name: "Nombre",
                code: "Código",
                description: "Descripción",
                created_at: 'Fecha de creación'
            };
            return await fetchDetails("/getSubject", { id }, headerMap);
        } else {
            return await fetchDetails("/getSubject", { id });
        }
    };

    const handleActionFields = {
        id: { label: "id", type: "number", editable: false,show: false },
        name: { label: "Nombre", type: "text", editable: true, show: true , required: true},
        code: { label: "Código", type: "text", editable: true, show: true, required: true },
        description: { label: "Descripción", type: "textarea", editable: true, show: true, required: false }
    };
    const { validateForm } = useFormValidation(handleActionFields);

    const handleUpdate = async (form) => {

        const errors = validateForm(form);

        if (Object.keys(errors).length > 0) {
            console.error(errors);
            return Promise.reject(errors);
        }

        return new Promise((resolve, reject) => {
            router.visit('/subjects', {
                method: 'post',
                data: { update: form },
                onSuccess: () => resolve(form),
                onError: (errors) => reject(errors),
            });
        });

    };

    const handleCreate = async (form) => {

        const errors = validateForm(form);

        if (Object.keys(errors).length > 0) {
            console.error(errors);
            return Promise.reject(errors);
        }

        return new Promise((resolve, reject) => {
            router.visit('/subjects', {
                method: 'post',
                data: { create: form },
                onSuccess: () => resolve(form),
                onError: (errors) => reject(errors),
            });
        });
    };

    const columns = {
        'id': "id",
        'name': "Nombre",
        'code': "Código"
    };

    return (
        <AuthenticatedLayout
            title="Materias"
        >

            <div className="subjects">
                <div>
                    <div className="bg-[var(--fontBox)] rounded-lg shadow">
                        <div className="flex justify-between px-6 md:px-10 pt-6">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">
                                    Materias
                                </h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <PrimaryButton onClick={() => setModalNewOpen(true)}>Nueva materia</PrimaryButton>
                            </div>
                        </div>
                        <div className="px-3 md:px-6 pb-6 text-[var(--primary)]">
                            <TableComp
                                id_table={'subjects_table'}
                                columns={columns}
                                dataRaw={subjects}
                                downloadBtns={true}
                                actionBtns={true}
                                useFormatDate={true}
                                showTime={true}
                                currentPage={currentPage}
                                totalPages={data.last_page}
                                onPageChange={handlePageChange}
                                pageLevel={pageLevel}
                                handleActionDetails={handleDetails}
                                handleActionDelete={handleDelete}
                                handleActionUpdate={handleUpdate}
                                handleActionUpdateFields={handleActionFields}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* NEW ROW MODAL */}
            <FormModal
                open={modalNewOpen}
                setOpen={setModalNewOpen}
                title="Nueva materia"
                btn="Crear materia"
                fields={handleActionFields}
                initialData={{}}
                onSubmit={handleCreate}
                success="Se ha creado la materia"
            />
            

        </AuthenticatedLayout>
    );
}
