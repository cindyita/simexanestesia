import AppLogoFull from '@/CustomComponents/AppLogoFull';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-[var(--font)] pt-6 sm:justify-center sm:pt-0">
            <div className="mt-6 w-full overflow-hidden bg-[var(--font)] px-6 py-4 sm:max-w-md sm:rounded-lg">
                
                <div className='flex justify-center p-2'>
                    <Link href="/">
                        <AppLogoFull className="h-40 w-40" />
                    </Link>
                </div>
                    
                {children}
            </div>
        </div>
    );
}
