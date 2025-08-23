import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from "@inertiajs/react";

export default function Exams() {

    const data = usePage().props.data;

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
                Examenes
            </div>
        </AuthenticatedLayout>
    );
}
