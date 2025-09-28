import PrimaryButton from '@/CustomComponents/button/PrimaryButton';
import SecondaryButton from '@/CustomComponents/button/SecondaryButton';
import Textarea from '@/CustomComponents/form/Textarea';
import TextInput from '@/CustomComponents/form/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router, Head, usePage } from "@inertiajs/react";
import React, { useState, useEffect } from 'react';
import ImageDropInput from '@/CustomComponents/form/ImageDropInput';
import Checkbox from '@/CustomComponents/form/Checkbox';
import { IoIosHelpCircle } from "react-icons/io";
import Select from '@/CustomComponents/form/Select';

export default function AppSettings() {
    const data = usePage().props.data;
    const pageLevel = usePage().props.menu[14]['level'];
    const isAdmin = usePage().props.user['mode_admin'] ? true : false;

    const roles = usePage().props.roles;

    const [logo, setLogo] = useState(null);
    const [previewLogo, setPreviewLogo] = useState(null);

    const [icon, setIcon] = useState(null);
    const [previewIcon, setPreviewIcon] = useState(null);
    const [resetImages, setResetImages] = useState(0);
    
    // FORM
    const [formData, setFormData] = useState({
        settings: true,
        name: data?.name || '',
        title: data?.title || '',
        description: data?.description || '',
        logo: data?.logo || '',
        icon: data?.icon || '',
        url: data?.url || '',
        primary_color: data?.primary_color || '#0d7560',
        secondary_color: data?.secondary_color || '#0ab586',
        tertiary_color: data?.tertiary_color || '#82e0b8',
        font_color: data?.font_color || '#e4f3ed',
        box_color: data?.box_color || '#84e2ba',
        text_color: data?.text_color || '#0d7559',
        text_color_reverse: data?.text_color_reverse || '#ffffff',
        style_type: data?.style_type || '1',
        use_uniquekeys: data?.use_uniquekeys || 0,
        register_key: data?.register_key || '',
        id_rol_register: data?.id_rol_register || roles[0]
    });

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // SAVE CHANGES
    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            router.post('/appsettings', formData, {
                forceFormData: true,
                onSuccess: () => {
                    setMessage({ type: 'success', text: 'Configuración guardada exitosamente' });
                    router.reload({ only: ['company'] });
                },
                onError: (errors) => {
                    setMessage({ type: 'error', text: 'Error al guardar la configuración' });
                    console.error(errors);
                },
                onFinish: () => {
                    setIsLoading(false);
                }
            });
        } catch (error) {
            setMessage({ type: 'error', text: 'Error inesperado al guardar' });
            setIsLoading(false);
        }
    };

    // RESET
    const handleReset = () => {
        setFormData({
            settings: true,
            name: data?.name || 'Simexanestesia',
            title: data?.title || 'Simexanestesia',
            description: data?.description || 'Tu web para examenes de la especialidad',
            url: data?.url || 'simexanestesia.com',
            primary_color: data?.primary_color || '#0d7560',
            secondary_color: data?.secondary_color || '#0ab586',
            tertiary_color: data?.tertiary_color || '#82e0b8',
            font_color: data?.font_color || '#e4f3ed',
            box_color: data?.box_color || '#84e2ba',
            text_color: data?.text_color || '#0d7559',
            text_color_reverse: data?.text_color_reverse || '#ffffff',
            style_type: data?.style_type || '1',
            use_uniquekeys: data?.use_uniquekeys || 0,
            register_key: data?.register_key || 'simexanestesia',
            id_rol_register: data?.id_rol_register || roles[0]
        });
        setLogo(null);
        setPreviewLogo(null);
        setIcon(null);
        setPreviewIcon(null);
        setResetImages(prev => prev + 1);
        setMessage({ type: '', text: '' });
    };

    const handleCheckboxUniqueKeys = (e) => {
        setFormData(prev => ({
            ...prev,
            use_uniquekeys: e.target.checked ? 1 : 0
        }));
        handleInputChange;
    };

    const handleSetLogo = (selectedFile, previewUrl) => {
        setLogo(selectedFile);
        setPreviewLogo(previewUrl);
        setFormData(prev => ({
            ...prev,
            logo: selectedFile
        }));
    }

    const handleSetIcon = (selectedFile, previewUrl) => {
        setIcon(selectedFile);
        setPreviewIcon(previewUrl);
        setFormData(prev => ({
            ...prev,
            icon: selectedFile
        }));
    }

    return (
        <AuthenticatedLayout
            title="Ajustes de app"
        >
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* MESSAGE */}
                    {/* {message.text && (
                        <div className={`mb-4 p-4 rounded-md ${
                            message.type === 'success' 
                                ? 'bg-green-50 text-green-800 border border-green-200' 
                                : 'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                            {message.text}
                        </div>
                    )} */}

                    <form onSubmit={handleSave} className="flex flex-col-reverse gap-6">
                        <div  className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* FORM */}
                            <div className="bg-[var(--fontBox)] overflow-hidden shadow rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium mb-6">
                                        Configuración General
                                    </h3>
                                    
                                    <div className="space-y-6">
                                        {/* INFO */}
                                        <div className="grid grid-cols-1 gap-4">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium">
                                                    Nombre de la aplicación
                                                </label>
                                                <TextInput
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full"
                                                    required
                                                />
                                            </div>

                                            {/* <div>
                                                <label htmlFor="url" className="block text-sm font-medium">
                                                    URL
                                                </label>
                                                <TextInput
                                                    type="url"
                                                    id="url"
                                                    name="url"
                                                    value={formData.url}
                                                    onChange={handleInputChange}
                                                    className="w-full"
                                                    disabled
                                                />
                                            </div> */}

                                            <div>
                                                <label htmlFor="title" className="block text-sm font-medium">
                                                    Título
                                                </label>
                                                <TextInput
                                                    type="text"
                                                    id="title"
                                                    name="title"
                                                    value={formData.title}
                                                    onChange={handleInputChange}
                                                    className="w-full"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="description" className="block text-sm font-medium">
                                                    Descripción
                                                </label>
                                                <Textarea
                                                    id="description"
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleInputChange}
                                                    rows="3"
                                                />
                                            </div>

                                            <div className="flex gap-2 items-center">
                                                <Checkbox
                                                    id="use_unique_registerkeys"
                                                    name="use_unique_registerkeys"
                                                    checked={formData.use_uniquekeys}
                                                    value={formData.use_uniquekeys}
                                                    onChange={handleCheckboxUniqueKeys}
                                                />
                                                <span className="text-sm font-medium">
                                                    Usar claves de registro individuales (Códigos)
                                                </span>
                                            </div>

                                            <div>
                                                <label htmlFor="register_key" className="font-medium flex gap-2 items-center">
                                                    <span className="text-sm">Clave de registro universal</span> <IoIosHelpCircle className="text-gray-300" title="Si se usa una clave de registro universal, cualquier persona que tenga la clave podrá registrarse con ella, si se usan claves de reigstro individual, tendrá que crear cada una de las claves que se usarán individualmente para el registro de cada usuario." />
                                                </label>
                                                <TextInput
                                                    type="text"
                                                    id="register_key"
                                                    name="register_key"
                                                    value={formData.register_key}
                                                    onChange={handleInputChange}
                                                    className="w-full"
                                                    disabled={formData.use_uniquekeys}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium">Rol de usuario al registro universal</label>
                                                <Select
                                                    id="id_rol_register"
                                                    name="id_rol_register"
                                                    className="w-full"
                                                    disabled={formData.use_uniquekeys}
                                                    value={formData.id_rol_register}
                                                    onChange={handleInputChange}
                                                >
                                                    {roles && roles.map(el => (
                                                        <option key={el.id} value={el.id}>
                                                            {el.name}
                                                        </option>
                                                    ))}
                                                </Select>
                                            </div>

                                        </div>

                                        {/* LOGO */}
                                        <div className="border-t pt-6">
                                            <h4 className="text-md font-medium mb-4">
                                                Imagen de logo
                                            </h4>
                                            <ImageDropInput
                                                accept=".jpg,.png,.svg,.ico,.jpeg"
                                                previewSize={'auto'}
                                                reset={resetImages}
                                                onChange={(selectedFile, previewUrl) => {
                                                    handleSetLogo(selectedFile, previewUrl);
                                                }}
                                            />
                                        </div>

                                        {/* ICON */}
                                        <div className="border-t pt-6">
                                            <h4 className="text-md font-medium mb-4">
                                                Imagen de ícono
                                            </h4>
                                            <ImageDropInput
                                                accept=".jpg,.png,.svg,.ico,.jpeg"
                                                previewSize={'auto'}
                                                reset={resetImages}
                                                onChange={(selectedFile, previewUrl) => {
                                                    handleSetIcon(selectedFile, previewUrl);
                                                }}
                                            />
                                        </div>

                                    </div>
                                </div>
                            </div>

                            {/* PREVIEW */}
                            <div className="overflow-hidden shadow rounded-lg bg-[var(--fontBox)]">
                                <div className="p-6">
                                    
                                    {/* COLORS */}
                                        <div className="pb-6">
                                            <h4 className="text-lg font-medium mb-4">
                                                Esquema de colores
                                            </h4>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="primary_color" className="block text-sm font-medium">
                                                        Color primario
                                                    </label>
                                                    <div className="mt-1 flex items-center space-x-2">
                                                        <TextInput
                                                            type="color"
                                                            id="primary_color"
                                                            name="primary_color"
                                                            value={formData.primary_color}
                                                            onChange={handleInputChange}
                                                            className="h-10 w-16 rounded-none cursor-pointer"
                                                        />
                                                        <TextInput
                                                            type="text"
                                                            value={formData.primary_color}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                                                            className="block w-full"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label htmlFor="secondary_color" className="block text-sm font-medium">
                                                        Color secundario
                                                    </label>
                                                    <div className="mt-1 flex items-center space-x-2">
                                                        <TextInput
                                                            type="color"
                                                            id="secondary_color"
                                                            name="secondary_color"
                                                            value={formData.secondary_color}
                                                            onChange={handleInputChange}
                                                            className="h-10 w-16 rounded-none cursor-pointer"
                                                        />
                                                        <TextInput
                                                            type="text"
                                                            value={formData.secondary_color}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, secondary_color: e.target.value }))}
                                                            className="block w-full"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label htmlFor="tertiary_color" className="block text-sm font-medium">
                                                        Color terciario
                                                    </label>
                                                    <div className="mt-1 flex items-center space-x-2">
                                                        <TextInput
                                                            type="color"
                                                            id="tertiary_color"
                                                            name="tertiary_color"
                                                            value={formData.tertiary_color}
                                                            onChange={handleInputChange}
                                                            className="h-10 w-16 rounded-none cursor-pointer"
                                                        />
                                                        <TextInput
                                                            type="text"
                                                            value={formData.tertiary_color}
                                                            onChange={(e) => setFormData(prev => ({...prev, tertiary_color: e.target.value}))}
                                                            className="block w-full"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label htmlFor="font_color" className="block text-sm font-medium">
                                                        Color de fondo
                                                    </label>
                                                    <div className="mt-1 flex items-center space-x-2">
                                                        <TextInput
                                                            type="color"
                                                            id="font_color"
                                                            name="font_color"
                                                            value={formData.font_color}
                                                            onChange={handleInputChange}
                                                            className="h-10 w-16 rounded-none cursor-pointer"
                                                        />
                                                        <TextInput
                                                            type="text"
                                                            value={formData.font_color}
                                                            onChange={(e) => setFormData(prev => ({...prev, font_color: e.target.value}))}
                                                            className="block w-full"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label htmlFor="box_color" className="block text-sm font-medium">
                                                        Color de caja
                                                    </label>
                                                    <div className="mt-1 flex items-center space-x-2">
                                                        <TextInput
                                                            type="color"
                                                            id="box_color"
                                                            name="box_color"
                                                            value={formData.box_color}
                                                            onChange={handleInputChange}
                                                            className="h-10 w-16 rounded-none cursor-pointer"
                                                        />
                                                        <TextInput
                                                            type="text"
                                                            value={formData.box_color}
                                                            onChange={(e) => setFormData(prev => ({...prev, box_color: e.target.value}))}
                                                            className="block w-full"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label htmlFor="text_color" className="block text-sm font-medium">
                                                        Color de texto
                                                    </label>
                                                    <div className="mt-1 flex items-center space-x-2">
                                                        <TextInput
                                                            type="color"
                                                            id="text_color"
                                                            name="text_color"
                                                            value={formData.text_color}
                                                            onChange={handleInputChange}
                                                            className="h-10 w-16 rounded-none cursor-pointer"
                                                        />
                                                        <TextInput
                                                            type="text"
                                                            value={formData.text_color}
                                                            onChange={(e) => setFormData(prev => ({...prev, text_color: e.target.value}))}
                                                            className="block w-full"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label htmlFor="text_color" className="block text-sm font-medium">
                                                        Color de texto en fondo primario
                                                    </label>
                                                    <div className="mt-1 flex items-center space-x-2">
                                                        <TextInput
                                                            type="color"
                                                            id="text_color_reverse"
                                                            name="text_color_reverse"
                                                            value={formData.text_color_reverse}
                                                            onChange={handleInputChange}
                                                            className="h-10 w-16 rounded-none cursor-pointer"
                                                        />
                                                        <TextInput
                                                            type="text"
                                                            value={formData.text_color_reverse}
                                                            onChange={(e) => setFormData(prev => ({...prev, text_color_reverse: e.target.value}))}
                                                            className="block w-full"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    
                                    <h3 className="text-lg font-medium mb-6">
                                        Vista previa
                                    </h3>
                                    
                                    {/* SIM */}
                                    <div className="overflow-hidden overflow-x-auto md:h-96 relative flex justify-center" >
                                        <div className="w-[65%] md:w-full flex h-auto md:h-full flex-col-reverse md:flex-row p-1 rounded-md" style={{backgroundColor: formData.primary_color}}>
                                            {/* MENU */}
                                            <div 
                                                className="w-full md:w-16 flex md:flex-col items-center justify-between"
                                                style={{backgroundColor: formData.primary_color}}
                                            >
                                                <div className="w-full flex md:flex-col gap-1 md:gap-4 p-3 justify-between md:justify-center items-center">
                                                    {[1, 2, 3, 4, 5].map((item) => (
                                                        <div
                                                            key={item}
                                                            className="w-7 h-7 rounded flex items-center justify-center"
                                                            style={{ backgroundColor: item === 2 ? formData.secondary_color : 'transparent' }}
                                                        >
                                                            <div 
                                                                className="w-5 h-5 rounded-full"
                                                                style={{ backgroundColor: formData.text_color_reverse }}
                                                            ></div>
                                                        </div>
                                                    ))}
                                                </div>
                                                {/* LOGO */}
                                                <div className="p-2 hidden md:flex justify-center">
                                                    {
                                                        previewIcon ?
                                                    <img src={previewIcon} alt="preview logo" className="rounded-md" style={{ width: 32 }} /> :
                                                    <div 
                                                        className="w-8 h-8 rounded-full"
                                                        style={{ backgroundColor: formData.text_color_reverse, opacity: 0.8 }}
                                                    ></div>}
                                                </div>
                                            </div>

                                            {/* SUBMENU */}
                                            <div 
                                                className="w-full md:w-24 rounded-lg my-1 md:my-0 md:ml-1 md:mr-1"
                                                style={{ backgroundColor: formData.secondary_color }}
                                            >
                                                <div className="px-2 py-3 md:space-y-2 flex md:block">
                                                    {[1, 2, 3, 4].map((item) => (
                                                        <div
                                                            key={item}
                                                            className="flex items-center gap-2 p-2 rounded"
                                                        >
                                                            <div 
                                                                className="w-4 h-4 rounded-full"
                                                                style={{ backgroundColor: formData.text_color_reverse }}
                                                            ></div>
                                                            <div 
                                                                className="h-3 flex-1 rounded"
                                                                style={{ backgroundColor: formData.text_color_reverse }}
                                                            ></div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* CONTENT */}
                                            <div className="flex-1 flex flex-col rounded-lg"
                                                style={{
                                                        backgroundColor: formData.font_color
                                                }}
                                            >
                                                {/* HEADER */}
                                                <div className="h-16 px-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        {
                                                            previewIcon ?
                                                            <img src={previewIcon} alt="preview logo" className="rounded-md md:hidden" style={{ width: 28 }} /> :
                                                            <div 
                                                                className="md:hidden w-7 h-7 rounded-full"
                                                                style={{ backgroundColor: formData.secondary_color }}
                                                            ></div>}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="rounded h-4 w-16" style={{ backgroundColor: formData.text_color}}>
                                                        
                                                        </span>
                                                        <div 
                                                            className="w-6 h-6 rounded-full"
                                                            style={{ backgroundColor: formData.text_color }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                {/* CONTENT BOX */}
                                                <div className="flex-1 p-4">
                                                    <div className="space-y-4">
                                                        {/* TITLE */}
                                                        <div 
                                                            className="h-4 w-32 rounded text-sm"
                                                            style={{ backgroundColor: formData.text_color }}
                                                        ></div>

                                                        {/* CARD */}
                                                        <div 
                                                            className="p-4 rounded-lg shadow-sm"
                                                            style={{ backgroundColor: formData.box_color }}
                                                        >
                                                            <div 
                                                                className="h-4 w-32 rounded mb-2"
                                                                style={{ backgroundColor: formData.text_color }}
                                                            ></div>
                                                            <div 
                                                                className="h-3 w-full rounded mb-1"
                                                                style={{ backgroundColor: formData.secondary_color }}
                                                            ></div>
                                                            <div 
                                                                className="h-3 w-3/4 rounded"
                                                                style={{ backgroundColor: formData.tertiary_color }}
                                                            ></div>
                                                        </div>

                                                        {/* BUTTONS */}
                                                        <div className="flex gap-2 flex-wrap">
                                                            <div 
                                                                className="w-16 md:w-24 px-3 py-2 rounded-lg text-xs"
                                                                style={{ backgroundColor: formData.primary_color }}
                                                            >
                                                                <div 
                                                                    className="h-3 w-17 rounded"
                                                                    style={{ backgroundColor: formData.text_color_reverse }}
                                                                ></div>
                                                            </div>
                                                            <div 
                                                                className="w-16 md:w-24 px-3 py-2 rounded-lg text-xs"
                                                                style={{ backgroundColor: formData.secondary_color }}
                                                            >
                                                                <div 
                                                                    className="h-3 w-17 rounded"
                                                                    style={{ backgroundColor: formData.text_color_reverse }}
                                                                ></div>
                                                            </div>
                                                            <div 
                                                                className="w-16 md:w-24 px-3 py-2 rounded-lg text-xs"
                                                                style={{ backgroundColor: formData.tertiary_color }}
                                                            >
                                                                <div 
                                                                    className="h-3 w-17 rounded"
                                                                    style={{ backgroundColor: formData.text_color }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* INFO COLORS */}
                                    <div className="mt-4 text-sm space-y-2">
                                        <div className="font-medium">Aplicación de colores:</div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="flex items-center gap-2">
                                                <div 
                                                    className="w-4 h-4 rounded border border-gray-200"
                                                    style={{ backgroundColor: formData.primary_color }}
                                                ></div>
                                                <span>Menú principal</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div 
                                                    className="w-4 h-4 rounded border border-gray-200"
                                                    style={{ backgroundColor: formData.secondary_color }}
                                                ></div>
                                                <span>Submenú</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div 
                                                    className="w-4 h-4 rounded border border-gray-200"
                                                    style={{ backgroundColor: formData.tertiary_color }}
                                                ></div>
                                                <span>Subsubmenú</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div 
                                                    className="w-4 h-4 rounded border border-gray-200"
                                                    style={{ backgroundColor: formData.box_color }}
                                                ></div>
                                                <span>Cajas/Cards</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div 
                                                    className="w-4 h-4 rounded border border-gray-200"
                                                    style={{ backgroundColor: formData.font_color }}
                                                ></div>
                                                <span>Fondo principal</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div 
                                                    className="w-4 h-4 rounded border border-gray-200"
                                                    style={{ backgroundColor: formData.text_color }}
                                                ></div>
                                                <span>Texto/Iconos</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div 
                                                    className="w-4 h-4 rounded border border-gray-200"
                                                    style={{ backgroundColor: formData.text_color_reverse }}
                                                ></div>
                                                <span>Texto/Iconos en fondo primario</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ---------------------------- */}
                        </div>

                        <div className="p-6 box shadow rounded-lg">
                            {/* BTNS */}
                            <div className="flex justify-end space-x-3">
                                <SecondaryButton
                                    type="button"
                                    onClick={handleReset}
                                    disabled={isLoading}
                                >
                                    Restablecer
                                </SecondaryButton>
                                <PrimaryButton
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Guardando...' : 'Guardar cambios'}
                                </PrimaryButton>
                            </div>
                        </div>

                    </form>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}