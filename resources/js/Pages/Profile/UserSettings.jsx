import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Checkbox from '@/CustomComponents/form/Checkbox';
import { useEffect, useState } from 'react';

export default function UserSettings({}) {

    const [alwaysOpenMenu, setAlwaysOpenMenu] = useState(() => {
        return JSON.parse(localStorage.getItem('alwaysOpenMenu') || false);
    });

    useEffect(() => {
        localStorage.setItem('alwaysOpenMenu', JSON.stringify(alwaysOpenMenu));
    }, [alwaysOpenMenu]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-[var(--primary)]">
                    Configuración personal
                </h2>
            }
        >
            <Head title="Configuración" />

            <div className="py-1">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">

                    <div className="bg-[var(--fontBox)] p-4 sm:rounded-lg sm:p-8 shadow">
                        <h2 className="text-lg font-medium text-[var(--primary)] pb-5">
                            Configuración personal
                        </h2>
                        <div>
                            <div className="flex gap-2 items-center">
                                <Checkbox
                                    id="use_unique_registerkeys"
                                    name="use_unique_registerkeys"
                                    checked={alwaysOpenMenu}
                                    value={alwaysOpenMenu}
                                    onChange={() => {
                                        setAlwaysOpenMenu(prev => !prev);
                                        window.location.reload();
                                    }}
                                />
                                <span className="text-sm font-medium">
                                    Mantener menú siempre abierto
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
