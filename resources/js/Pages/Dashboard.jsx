import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-emerald-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-2">
                <div>
                    <div className="bg-white sm:rounded-lg">
                        <div className="p-6 text-emerald-900">
                            HOME
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
