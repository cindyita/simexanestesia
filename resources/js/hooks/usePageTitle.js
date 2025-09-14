import { useEffect } from "react";
import { usePage } from "@inertiajs/react";

/**
 * usePageTitle - Hook para cambiar el título de la página dinámicamente
 * @param {string} title - Título de la página
 */
export function usePageTitle(title) {
    const { company } = usePage().props;

    useEffect(() => {
        const companyName = company?.name || "SIMEXANESTESIA";
        document.title = title ? `${title} - ${companyName}` : companyName;
    }, [title, company]);
}
