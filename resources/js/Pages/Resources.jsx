import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from "@inertiajs/react";

export default function Resources() {

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
                Recursos
            </div>
        </AuthenticatedLayout>
    );
}
