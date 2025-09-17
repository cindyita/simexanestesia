import { usePage } from '@inertiajs/react';

export default function AppLogoFull(props) {
    const logourl = usePage().props.company.logo ?? 'img/default/logo.png';
    return (
        <>
            <img src={`/storage/${logourl}`} alt="Logo" className="logo" {...props} />
        </>
    );
}
