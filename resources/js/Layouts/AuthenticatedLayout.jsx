import AppLogo from '@/CustomComponents/logo/AppLogo';
import Dropdown from '@/CustomComponents/dropdown/Dropdown';
import { Link, usePage, Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { MdDashboard, MdClass } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { IoFileTrayFull } from "react-icons/io5";
import { RiCheckboxMultipleFill } from "react-icons/ri";
import { IoSchool } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { FaUserShield } from "react-icons/fa6";
import { FaBook } from "react-icons/fa";
import { GoPasskeyFill } from "react-icons/go";
import { FaUserCog } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
// import { IoMdNotifications } from "react-icons/io";
// import IconButton from '@/Components/IconButton';

import { Toaster } from 'sonner'

export default function AuthenticatedLayout({ header, title, children }) {
    const user = usePage().props.auth.user;
    const company = usePage().props.company;
    const menu = usePage().props.menu ?? { "1": { "id": 1, "name": "Dashboard", "icon": "MdDashboard", "url": "\/", "reg_order": 1, "level": 1, "has_permission": 1 } };
    
    const [openSubMenu1, setOpenSubMenu1] = useState(false);
    const [openSubMenu2, setOpenSubMenu2] = useState(false);
    const [menuSelected1, setMenuSelected1] = useState(0);
    const [menuSelected2, setMenuSelected2] = useState(0);
    
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

    const icons = {
        MdDashboard,
        RiCheckboxMultipleFill,
        FaHistory,
        IoFileTrayFull,
        IoSchool,
        FaUsers,
        FaUserShield,
        FaBook,
        GoPasskeyFill,
        FaUserCog,
        FaGear,
        MdClass
    };

    const handleSubMenu1 = (idParent) => {
        if (menuSelected1 === idParent) {
            setOpenSubMenu1(!openSubMenu1);
            setMenuSelected1(0);
        } else {
            setMenuSelected1(idParent);
            setOpenSubMenu1(true);
        }
        setOpenSubMenu2(false);
        setMenuSelected2(0);
    };

    const handleSubMenu2 = (idParent) => {
        if (menuSelected2 === idParent) {
            setOpenSubMenu2(!openSubMenu2);
            setMenuSelected2(0);
        } else {
            setMenuSelected2(idParent);
            setOpenSubMenu2(true);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (e.target.closest("main")) {
                setOpenSubMenu1(false);
                setOpenSubMenu2(false);
                setMenuSelected1(0);
                setMenuSelected2(0);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

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
                
                <aside className="menu">
                    
                    <div className="menu-nav-content w-full h-full">
                        <nav className="menu-nav">
                            <ul>
                                {menu && Object.values(menu).length > 0
                                    ? Object.values(menu).map((item) => {
                                        if (item.menu_level === 1) {
                                            const Icon = icons[item.icon];
                                            return (
                                                <li key={item.id} className={`${menuSelected1 == item.id ? 'selected' : ''}`}>
                                                {item.url != null ? (
                                                    <Link href={item.url || '#'}>
                                                        <div>{Icon && <Icon />}</div>
                                                        <span>{item.name}</span>
                                                    </Link>
                                                ) : (
                                                    <a
                                                        onClick={() => handleSubMenu1(item.id)}
                                                        className="cursor-pointer"
                                                    >
                                                        <div>{Icon && <Icon />}</div>
                                                        <span>{item.name}</span>
                                                    </a>
                                                )}
                                                </li>
                                            );
                                        }
                                        return null;
                                    })
                                : null}
                            </ul>

                        </nav>
                    </div>
                    <div className="logo-content logo-desktop hidden lg:flex lg:justify-center lg:w-full">
                        <div className="logo">
                            <Link href="/">
                                <AppLogo className="block w-auto fill-current text-[var(--primary)]" />
                            </Link>
                        </div>
                    </div>
                    
                </aside>

                <aside className={`submenu bg-[var(--secondary)] rounded-lg ${openSubMenu1 ? 'open' : ''}`}>
                    <ul className="px-3 py-4">
                        {menu && Object.values(menu).length > 0
                            ? Object.values(menu).map((item) => {
                                if (item.menu_level === 2 && item.id_parent == menuSelected1) {
                                    const Icon = icons[item.icon];
                                    return (
                                        <li key={item.id} className={`${menuSelected2 == item.id ? 'selected' : ''}`}>
                                            {item.url ? (
                                                <Link href={item.url || '#'} className="flex gap-2 items-center">
                                                    <div>{Icon && <Icon />}</div>
                                                    <span>{item.name}</span>
                                                </Link>
                                            ) : (
                                                <a
                                                    onClick={() => handleSubMenu2(item.id)}
                                                    className="cursor-pointer flex gap-2 items-center"
                                                >
                                                    <div>{Icon && <Icon />}</div>
                                                    <span>{item.name}</span>
                                                </a>
                                            )}
                                        </li>
                                    );
                                }
                                return null;
                            })
                        : null}
                    </ul>
                </aside>

                <aside className={`subsubmenu bg-[var(--tertiary)] rounded-lg ${openSubMenu2 ? 'open' : ''}`}>
                    <ul className="px-3 py-4">
                        {menu && Object.values(menu).length > 0
                            ? Object.values(menu).map((item) => {
                                if (item.menu_level === 3 && item.id_parent == menuSelected2) {
                                    const Icon = icons[item.icon];
                                    return (
                                        <li key={item.id}>
                                            <Link href={item.url || '#'} className="flex gap-2 items-center">
                                                <div>{Icon && <Icon />}</div>
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    );
                                }
                                return null;
                            })
                        : null}
                    </ul>
                </aside>

                <main className="overflow-y-auto">
                    <div className="main-content pb-6">
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
