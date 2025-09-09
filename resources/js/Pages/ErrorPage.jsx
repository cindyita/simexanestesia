import PrimaryButton from "@/CustomComponents/button/PrimaryButton";
import AppLogoFull from '@/CustomComponents/logo/AppLogoFull';
import { Link } from '@inertiajs/react';

export default function ErrorPage({ status }) {

  let message = 'Ocurrió un error inesperado.';
  let button = <Link href="/"><PrimaryButton>Regresar al inicio</PrimaryButton></Link>;
  
  switch (status) {
    case 'email_used':
      message = 'Ya existe un usuario con ese email.';
      button = <Link href="/register"><PrimaryButton>Regresar al registro</PrimaryButton></Link>;
      break;
    case 'invalid_key':
      message = 'La clave de registro es inválida o ya se utilizó.';
      button = <Link href="/register"><PrimaryButton>Regresar al registro</PrimaryButton></Link>;
      break;
  }

  switch (+status) {
      case 403: message = 'No tienes permisos para acceder a esta página'; break;
      case 404: message = 'La página no existe'; break;
      case 500: message = 'Error interno del servidor.'; break;
      case 503: message = 'Servicio temporalmente no disponible.'; break;
  }
  
  return (
    <div className="flex items-center justify-center p-5 h-screen bg-gray-100">
          <h1 className="text-2xl font-bold text-emerlad-600 flex flex-col gap-2 items-center">
              <Link href="/">
                <AppLogoFull className="h-40 w-40" />
            </Link>
        <span className="text-center">{message}</span>
        <span className="text-sm text-gray-400">Error: {status}</span>
              {button}
      </h1>
    </div>
  );
}