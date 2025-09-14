import { usePage } from '@inertiajs/react';
import AppFavicon from './AppFavicon';

export default function AppLogo(props) {
    const iconurl = usePage().props.company.icon;

    return (
        <>
            <AppFavicon src={`/storage/${iconurl}`} />
            
            <img src={`/storage/${iconurl}`} alt="Logo" className="logo" {...props} />
        </>
    );
}
