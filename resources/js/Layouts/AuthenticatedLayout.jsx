import AppLogo from '@/Components/AppLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

import { MdDashboard } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { IoFileTrayFull } from "react-icons/io5";
import { RiCheckboxMultipleFill } from "react-icons/ri";
import { IoSchool } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { FaUserShield } from "react-icons/fa6";
import { FaBook } from "react-icons/fa";
// import { IoMdNotifications } from "react-icons/io";
// import IconButton from '@/Components/IconButton';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <>
            <div className="content-layout">
                
                <aside className="menu">
                    
                    <div className="menu-nav-content w-full h-full">
                        <nav className="menu-nav">
                            <ul>
                                <li>
                                    <a href="/">
                                        <div><MdDashboard /></div> <span>Dashboard</span>
                                    </a>
                                </li> 
                                <li>
                                    <a href="exams">
                                        <div><RiCheckboxMultipleFill /></div> <span>Examenes</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="history">
                                        <div><FaHistory /></div> <span>Historial</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="resources">
                                        <div><IoFileTrayFull /></div>
                                        <span>Recursos</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="subjects">
                                        <div><IoSchool /></div>
                                        <span>Materias</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="users">
                                        <div><FaUsers /></div>
                                        <span>Usuarios</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="roles">
                                        <div><FaUserShield /></div>
                                        <span>Roles</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="logs">
                                        <div><FaBook /></div>
                                        <span>Auditoría</span>
                                    </a>
                                </li>
                                
                            </ul>
                        </nav>
                    </div>
                    <div className="logo-content hidden lg:flex lg:justify-center lg:w-full">
                        <div className="logo">
                            <Link href="/">
                                <AppLogo className="block w-auto fill-current text-emerald-800" />
                            </Link>
                        </div>
                    </div>
                    
                </aside>

                <main className="overflow-y-auto">
                    <div className="main-content">
                        <header>
                            <div className="flex gap-2">
                                <li className="lg:hidden">
                                    <div className="logo">
                                        <Link href="/">
                                            <AppLogo className="block w-auto fill-current" />
                                        </Link>
                                    </div>
                                </li>
                                {/* <i className="hidden lg:block">
                                    <h4 className="text-tertiary">Dashboard</h4>
                                </i> */}
                            </div>
                            <div className="flex gap-2">
                                {/* <div>
                                    <IconButton >
                                        <IoMdNotifications />
                                    </IconButton>
                                </div> */}
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

                    {/* <footer>
                        <hr />
                        <i>@ 2025</i>
                    </footer> */}
                </main>
                
            </div>
        </>
    );
}
