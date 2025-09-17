import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import Select from "../form/Select";
import PrimaryButton from "../button/PrimaryButton";
import Modal from "./Modal";
import Textarea from "../form/Textarea";
import TextInput from "../form/TextInput";
import { toast } from "sonner";

export default function FormModal({
    open,
    setOpen,
    title = "Formulario",
    btn = "Guardar",
    fields = {},
    initialData = {},
    onSubmit,
    success = "Listo"
}) {
    const [form, setForm] = useState({});
     const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (open) {
            const defaultForm = {};
            for (const key in fields) {
                const field = fields[key];
                if (field.type === "select") {
                    defaultForm[key] = initialData[key] ?? field.options?.[0] ?? "";
                } else {
                    defaultForm[key] = initialData[key] ?? "";
                }
            }
            setForm(defaultForm);
        }
    }, [open, fields, initialData]);
        
    const handleChange = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!onSubmit) return;

        try {
            await onSubmit(form);
            setTimeout(() => {
                toast.success(success);
            }, 150);
        } catch (err) {
            if (err && typeof err === "object") {
                setTimeout(() => { Object.values(err).forEach(msg => {
                    toast.error(msg);
                }); }, 150);
            } else {
                setTimeout(() => { toast.error(err?.message || "Ocurrió un error"); }, 150);
            }
        }
    };


    const renderField = (key, field) => {
        const value = form[key] ?? "";
        if (field.show === false) return null;

        switch (field.type) {
            case "text":
            case "number":
            case "date":
                return (
                    <div key={key} className="flex flex-col">
                        <label className="font-medium">{field.label}</label>
                        <TextInput
                            type={field.type}
                            value={value}
                            onChange={e => handleChange(key, e.target.value)}
                            disabled={!field.editable}
                            autoComplete="newuser"
                        />
                    </div>
                );
            case "password":
                return (
                    <div key={key} className="flex flex-col">
                        <label className="font-medium">{field.label}</label>
                        <span className="relative">
                            <TextInput
                                type={showPassword ? "text" : "password"}
                                value={value}
                                onChange={e => handleChange(key, e.target.value)}
                                disabled={!field.editable}
                                className="w-full"
                                autoComplete="newpassword"
                            />
                            <span
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-5 transform -translate-y-1/2 text-[var(--secondary)]"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </span>
                        
                    </div>
                );
            case "select":
                 return (
                    <div key={key} className="flex flex-col">
                        <label className="font-medium">{field.label}</label>
                        <Select
                            value={value}
                            onChange={e => handleChange(key, e.target.value)}
                            disabled={!field.editable}
                        >
                            {field.options && field.options.map(opt => (
                                <option key={opt.id ?? opt} value={opt.id ?? opt}>
                                    {opt.name ?? opt}
                                </option>
                            ))}
                        </Select>
                    </div>
                );
            case "textarea":
                return (
                    <div key={key} className="flex flex-col">
                        <label className="font-medium">{field.label}</label>
                        <Textarea
                            value={value}
                            onChange={e => handleChange(key, e.target.value)}
                            disabled={!field.editable}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Modal show={open} onClose={() => setOpen(false)}>
            <form onSubmit={handleSubmit} className="p-6 space-y-4" autoComplete="off">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-[var(--primary)]">{title}</h3>
                    <button type="button" onClick={() => setOpen(false)} className="text-[var(--secondary)] hover:text-[var(--primary)]">
                        <FaTimes />
                    </button>
                </div>

                <div className="space-y-3">
                    {fields && Object.entries(fields).map(([key, field]) => renderField(key, field))}
                </div>

                <div className="flex justify-end mt-2">
                    <PrimaryButton type="submit">{btn}</PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
