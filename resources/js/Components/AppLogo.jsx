import { usePage } from '@inertiajs/react';

export default function AppLogo(props) {
    const iconurl = usePage().props.company.icon;
    return (
        <>
            <img src={`/storage/img/${iconurl}`} alt="Logo" className="logo" {...props} />
        </>
    );
}
