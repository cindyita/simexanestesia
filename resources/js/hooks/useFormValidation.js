export function useFormValidation(fields) {
    /**
     * Validates a form based on the definition of fields
     * @param {Object} form - data
     * @returns {Object} - errors
     */
    const validateForm = (form) => {
        const errors = {};

        for (const key in fields) {
            const field = fields[key];
            const value = form[key];

            // REQUIRED
            if (field.required && (value === undefined || value === null || value.toString().trim() === "")) {
                errors[key] = `${field.label || key} es requerido`;
                continue;
            }

            // TYPE
            if (field.type && value !== undefined && value !== null && value !== "") {
                switch (field.type) {
                    case "number":
                        if (isNaN(Number(value))) {
                            errors[key] = `${field.label || key} debe ser un número`;
                        }
                        break;
                    case "text":
                    case "textarea":
                        if (typeof value !== "string") {
                            errors[key] = `${field.label || key} debe ser texto`;
                        }
                        break;
                    // case "select":
                    //     if (field.options && !field.options.includes(value)) {
                    //         errors[key] = `${field.label || key} no es una opción válida`;
                    //     }
                    //     break;
                    case "date":
                        if (isNaN(Date.parse(value))) {
                            errors[key] = `${field.label || key} debe ser una fecha válida`;
                        }
                        break;
                    default:
                        break;
                }
            }

            // LONG MIN
            if (field.minLength && value?.toString().length < field.minLength) {
                errors[key] = `${field.label || key} debe tener al menos ${field.minLength} caracteres`;
            }

            // LONG MAX
            if (field.maxLength && value?.toString().length > field.maxLength) {
                errors[key] = `${field.label || key} debe tener como máximo ${field.maxLength} caracteres`;
            }

            // REGEX
            if (field.pattern && value && !field.pattern.test(value)) {
                errors[key] = `${field.label || key} no tiene el formato correcto`;
            }
        }

        return errors;
    };

    return { validateForm };
}
