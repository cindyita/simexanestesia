import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-700 focus:border-emerald-700 focus:bg-emerald-100 focus:text-emerald-800'
                    : 'border-transparent text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 focus:border-emerald-300 focus:bg-emerald-50 focus:text-emerald-800'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
