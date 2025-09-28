import AppLogo from '@/CustomComponents/logo/AppLogo';
import Dropdown from '@/CustomComponents/dropdown/Dropdown';
import { Link, usePage, Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { FaUser } from "react-icons/fa";

import { Toaster } from 'sonner'

export default function ExamLayout({ header, title, name, children }) {
    const user = usePage().props.auth.user;
    const company = usePage().props.company;
    
    useEffect(() => {
        if (company) {
            document.documentElement.style.setProperty('--primary', company.primary_color);
            document.documentElement.style.setProperty('--secondary', company.secondary_color);
            document.documentElement.style.setProperty('--tertiary', company.tertiary_color);
            document.documentElement.style.setProperty('--font', company.font_color);
            document.documentElement.style.setProperty('--fontBox', company.box_color);
            document.documentElement.style.setProperty('--text', company.text_color);
            document.documentElement.style.setProperty('--textReverse', company.text_color_reverse);
        }
    }, [company]);

    const pageTitle = title ? `${title} - ${company?.name || "SIMEXANESTESIA"}` 
                            : company?.name || "SIMEXANESTESIA";

    return (
        <>
            <Head title={pageTitle} />
            
            <div className="content-layout">
                
                <Toaster
                    position="top-center"
                    richColors
                    closeButton={true}
                    toastOptions={{
                        classNames: {
                            closeButton: 'toast-closebtn',
                        },
                    }}
                />

                <main className="overflow-y-auto">
                    <div className="main-content pb-6">
                        <header>
                            <div className="flex gap-2 items-center">
                                <li>
                                    <div className="logo">
                                        <AppLogo className="block w-auto fill-current" />
                                    </div>
                                </li>
                                <div>
                                    <strong>EXÁMEN: {name}</strong>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div>
                                    {/*------------------------------*/}
                                    <div className="">
                                        <div className="relative">
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <span className="inline-flex rounded-xl">
                                                        <div className="flex cursor-pointer items-center">
                                                            <span className="lg:hidden text-xl"><FaUser /></span>
                                                            <span className="hidden lg:block">{user.name}</span>

                                                            <svg
                                                                className="hidden lg:block -me-0.5 ms-2 h-4 w-4"
                                                                xmlns="http:www.w3.org/2000/svg"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </div>
                                                    </span>
                                                </Dropdown.Trigger>

                                                <Dropdown.Content>
                                                    <Dropdown.Link
                                                        href={route('account.edit')}
                                                    >
                                                        Mi cuenta
                                                    </Dropdown.Link>
                                                    <Dropdown.Link
                                                        href={route('logout')}
                                                        method="post"
                                                        as="button"
                                                    >
                                                        Cerrar sesión
                                                    </Dropdown.Link>
                                                </Dropdown.Content>
                                            </Dropdown>
                                        </div>
                                    </div>
                                    {/*------------------------------*/}
                                </div>
                            </div>
                        </header>
                        <div className="main-outlet mt-5 pt-5">
                            {children}
                        </div>
                    </div>

                </main>
                
            </div>
        </>
    );
}
