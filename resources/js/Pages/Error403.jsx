import PrimaryButton from "@/CustomComponents/button/PrimaryButton";
import AppLogoFull from '@/CustomComponents/AppLogoFull';
import { Link } from '@inertiajs/react';

export default function Error403() {
  return (
    <div className="flex items-center justify-center p-5 h-screen bg-gray-100">
          <h1 className="text-2xl font-bold text-emerlad-600 flex flex-col gap-4 items-center">
              <Link href="/">
                <AppLogoFull className="h-40 w-40" />
            </Link>
              <span className="text-center">ERROR 403 - No tienes permisos para acceder a esta página</span>
              <Link href="/"><PrimaryButton>Regresar al dashboard</PrimaryButton></Link>
      </h1>
    </div>
  );
}