import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm } from '@inertiajs/react';
import { MdRadioButtonChecked } from "react-icons/md";
import { IoAlert } from "react-icons/io5";
import { useState } from 'react';

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter, } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

import { MdOutlineTrendingUp, MdOutlineTrendingDown } from "react-icons/md";
import { FaSyringe } from "react-icons/fa";

import MiniButton from '@/CustomComponents/button/MiniButton';
import Modal from '@/CustomComponents/modal/Modal';
import PrimaryButton from '@/CustomComponents/button/PrimaryButton';
import SecondaryButton from '@/CustomComponents/button/SecondaryButton';
import Textarea from '@/CustomComponents/form/Textarea';

export default function Dashboard() {

    const alertsProp = usePage().props.alerts;
    const isAdmin = usePage().props.user['mode_admin'] ? true : false;

    const alerts = alertsProp.length > 0 ? alertsProp : [
        {
            id: 0,
            title: "Funcionamiento normal",
            type: "info",
            description: "La plataforma funciona con normalidad.",
            id_company: null,
            expire: null,
            created_at: null,
            updated_at: null,
        },
    ];

    const [selectedAlert, setSelectedAlert] = useState(null);
    const [modalAlertOpen, setModalAlertOpen] = useState(false);

    const { data, setData, post, put, errors, processing } = useForm({
        id: selectedAlert?.id || '',
        title: selectedAlert?.title || '',
        description: selectedAlert?.description || '',
        type: selectedAlert?.type || 'info',
        expire: selectedAlert?.expire || '',
    });

    const handleAlertEdit = (alert) => {
        setSelectedAlert(alert);
        setData({
            id: alert.id,
            title: alert.title,
            description: alert.description,
            type: alert.type,
            expire: alert.expire || '',
        });
        setModalAlertOpen(true);
    };

    const handleAlertSave = (e) => {
        e.preventDefault();
        post(route('alert.update', selectedAlert.id), {
        onSuccess: () => setModalAlertOpen(false),
        onError: () => console.log(errors),
        });
    };

    const [activeIndex, setActiveIndex] = useState(0);

    const dataStats = [
        { name: "Ene", aciertos: 30, intentos: 40 },
        { name: "Feb", aciertos: 20, intentos: 110 },
        { name: "Mar", aciertos: 50, intentos: 290 },
        { name: "Abr", aciertos: 70, intentos: 200 },
        { name: "May", aciertos: 60, intentos: 305 },
        { name: "Jun", aciertos: 76, intentos: 360 },
        { name: "Jul", aciertos: 68, intentos: 210 },
        { name: "Ago", aciertos: 95, intentos: 450 }
    ]

    const formattedDate = (date) => {
        return date ? new Date(date).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }) : null
    };

    const AlertBgColors = {
        warning: 'bg-[var(--font)]',
        info: 'bg-[var(--fontBox)]',
        precaution: 'bg-yellow-200',
        danger: 'bg-red-300'
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-[var(--primary)]">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-1 w-full">
                
                <div className="pb-4 flex flex-wrap gap-4 w-full">

                    <div className="space-y-4 flex-1 flex flex-col">
                        {alerts && alerts.map((alert) => (
                            <Card key={alert.id} className={`@container/card shadow rounded-lg p-4 ${AlertBgColors[alert.type] || 'bg-[var(--fontBox)]'}`}>
                                <div className="flex items-start space-x-4 flex-1">
                                    <div className="w-10 h-10 flex items-center justify-center rounded-full  text-[var(--primary)] font-bold bg-[var(--font)]">
                                        <IoAlert className="text-2xl" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start md:justify-between md:items-center mb-1 flex-col md:flex-row gap-1">
                                            <CardTitle className="text-lg font-semibold text-[var(--primary)]">{alert.title}</CardTitle>
                                            <span className="text-xs text-gray-500">{formattedDate(alert.created_at)}</span>
                                        </div>
                                        <div className="flex items-end md:justify-between md:items-center mb-1 flex-col md:flex-row gap-1 w-full">
                                            <div className="w-full text-start">
                                                <CardDescription className="text-gray-600 text-sm">
                                                    {alert.description}
                                                </CardDescription>
                                            </div>
                                            {(isAdmin ? (
                                                <div className="w-full text-end">
                                                    <MiniButton className="mt-2 md:mt-0" onClick={() => handleAlertEdit(alert)}>Cambiar aviso</MiniButton>
                                                </div>
                                            ) : "")}
                                            
                                        </div>
                                        
                                    </div>
                                </div>
                            </Card>
                        ))}

                    </div>

                    <div className="box flex gap-2 p-2 shadow rounded-lg max-h-24">
                        <div className="text-[var(--primary)] flex items-center">
                            {activeIndex === 0 && (<li className="animations-pulse-content bg-[var(--primary)] rounded-lg border-4 border-[var(--secondary)]">
                                <div className='animation-pulse'></div>
                                <div className='animation-pulse'></div>
                            </li>)}
                            {activeIndex === 1 && (<li className="animations-pulse-content bg-[var(--primary)] rounded-lg border-4 border-[var(--secondary)]">
                                <div className='animation-pulse2'></div>
                            </li>)}
                            {activeIndex === 2 && (<li className="animations-pulse-content bg-[var(--primary)] rounded-lg border-4 border-[var(--secondary)]">
                                <div className='animation-pulse3'></div>
                            </li>)}
                        </div>
                        <div className="bg-[var(--tertiary)] p-2 rounded-lg max-h-20">
                            <ul className="flex flex-col gap-1 items-center justify-center h-full">
                                <li className="cursor-pointer" onClick={() => setActiveIndex(0)}><MdRadioButtonChecked className="hover:text-[var(--primary)]" /></li>
                                <li className="cursor-pointer" onClick={() => setActiveIndex(1)}><MdRadioButtonChecked className="text-yellow-600 hover:text-yellow-700" /></li>
                                <li className="cursor-pointer" onClick={() => setActiveIndex(2)}><MdRadioButtonChecked className="text-red-500 hover:text-red-600" /></li>
                            </ul>
                        </div>
                    </div>

                    <div className="syringe-icon box flex gap-1 p-2 sm:p-3 shadow rounded-lg flex-col flex-1 md:flex-initial justify-center max-h-24 items-center">
                        <FaSyringe className="text-4xl text-[var(--primary)]" />
                    </div>

                </div>
                
                <div className="flex flex-wrap gap-4">
                    
                    <Card className="@container/card box shadow rounded-lg flex-1">
                        <CardHeader>
                            <CardDescription>Total examenes</CardDescription>
                            <div className="flex gap-2 items-center">
                                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-[var(--primary)]">
                                    15
                                </CardTitle>
                                <div>
                                    <Badge className="bg-[var(--primary)] hover:bg-[var(--secondary)]">
                                        <MdOutlineTrendingUp className="font-bold text-lg pe-1" />
                                        +2
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex-col items-start gap-1.5 text-sm">
                                <div className="flex gap-2 font-medium">
                                    Durante Agosto
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    <Card className="@container/card box shadow rounded-lg flex-1">
                        <CardHeader>
                            <CardDescription>Total intentos</CardDescription>
                            <div className="flex gap-2 items-center">
                                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-[var(--primary)]">
                                    300
                                </CardTitle>
                                <div>
                                    <Badge className="bg-[var(--primary)] hover:bg-[var(--secondary)]">
                                        <MdOutlineTrendingUp className="font-bold text-lg pe-1" />
                                        +12.5%
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex-col items-start gap-1.5 text-sm">
                                <div className="flex gap-2 font-medium">
                                    Durante Agosto
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    <Card className="@container/card box shadow rounded-lg flex-1">
                        <CardHeader>
                            <CardDescription>Total usuarios</CardDescription>
                            <div className="flex gap-2 items-center">
                                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-[var(--primary)]">
                                    450
                                </CardTitle>
                                <div>
                                    <Badge className="bg-[var(--primary)] hover:bg-[var(--secondary)]">
                                        <MdOutlineTrendingUp className="font-bold text-lg pe-1" />
                                        +15%
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex-col items-start gap-1.5 text-sm">
                                <div className="flex gap-2 font-medium">
                                    Durante Agosto
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    <Card className="@container/card box shadow rounded-lg flex-1">
                        <CardHeader>
                            <CardDescription>Porcentaje de aciertos</CardDescription>
                            <div className="flex gap-2 items-center">
                                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-[var(--primary)]">
                                    57%
                                </CardTitle>
                                <div>
                                    <Badge className="bg-red-500 hover:bg-red-600">
                                        <MdOutlineTrendingDown className="font-bold text-lg pe-1" />
                                        -1%
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex-col items-start gap-1.5 text-sm">
                                <div className="flex gap-2 font-medium">
                                    Durante Agosto
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                </div>
                

                <div className="flex flex-wrap gap-4 pt-4 w-full flex-col md:flex-row">
                    {/* GRÁFICAS */}
                    <Card className="box shadow rounded-lg flex-1">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">Estadísticas de aciertos</CardTitle>
                            </CardHeader>
                        <CardContent className="h-60">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dataStats}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="aciertos" stroke="MediumAquaMarine" strokeWidth={3} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Tarjeta de gráfico de barras */}
                    <Card className="flex-1 box shadow rounded-lg">
                        <CardHeader>
                        <CardTitle className="text-lg font-semibold">Estadísticas de intentos</CardTitle>
                        </CardHeader>
                        <CardContent className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dataStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="intentos" fill="MediumAquaMarine" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

            </div>

            {/* Modal */}
            {(isAdmin ? (
                <Modal show={modalAlertOpen} onClose={() => setModalAlertOpen(false)}>
                    {data && <form
                        onSubmit={handleAlertSave}
                        className="p-6 space-y-4"
                    >
                        <input type="hidden" name="id" value={data.id} />
                        <h2 className="text-xl font-bold">Cambiar Aviso</h2>
                        <div>
                            <label className="block text-sm font-medium">Título</label>
                            <input
                                type="text"
                                name="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Descripción</label>
                            <Textarea
                                name="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Expiración</label>
                            <input type="datetime-local" name="expire" value={data.expire}
                                onChange={(e) => setData('expire', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Tipo</label>
                            <select
                                name="type"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            >
                                <option value="warning">Advertencia (Verde)</option>
                                <option value="info">Información (Blanco)</option>
                                <option value="precaution">Precaución (Amarillo)</option>
                                <option value="danger">Peligro (Rojo)</option>
                            </select>
                        </div>

                        <div className="flex gap-2 mt-4 justify-between">
                            <SecondaryButton
                                type="button"
                                onClick={() => setModalAlertOpen(false)}
                            >
                                Cancelar
                            </SecondaryButton>
                            <PrimaryButton
                                type="submit"
                            >
                                Guardar
                            </PrimaryButton>
                        </div>
                    </form>
                    }
                </Modal>
            ): "")}
            {/*---------------------*/}

        </AuthenticatedLayout>
    );
}
