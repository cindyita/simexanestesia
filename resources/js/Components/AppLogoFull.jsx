//import { usePage } from '@inertiajs/react';

export default function AppLogoFull(props) {
    //const logourl = usePage().props.company.logo;
    return (
        <>
            <img src={`/storage/img/logo-sime-complete.png`} alt="Logo" className="logo" {...props} />
        </>
    );
}
