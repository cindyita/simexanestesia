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
import Select from '@/CustomComponents/form/Select';

// STAT CARD -------------------------------------
const StatCard = ({ title, value, icon: Icon }) => (
  <Card className="@container/card box shadow rounded-lg flex-1">
    <CardHeader>
      <CardDescription>{title}</CardDescription>
      <div className="flex gap-2 items-center">
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-[var(--primary)]">
          {value}
        </CardTitle>
        <Badge className="bg-[var(--primary)] hover:bg-[var(--secondary)]">
          <Icon className="font-bold text-lg" />
        </Badge>
      </div>
    </CardHeader>
  </Card>
);

// ALERT CARD ----------------------------
const AlertCard = ({ alert, onEdit, isAdmin, formattedDate }) => {
  const AlertBgColors = {
    warning: 'bg-[var(--font)]',
    info: 'bg-[var(--fontBox)]',
    precaution: 'bg-yellow-200',
    danger: 'bg-red-300'
  };

  return (
    <Card className={`@container/card shadow rounded-lg p-4 ${AlertBgColors[alert.type] || 'bg-[var(--fontBox)]'}`}>
      <div className="flex items-start space-x-4 flex-1">
        <div className="w-10 h-10 flex items-center justify-center rounded-full text-[var(--primary)] font-bold bg-[var(--font)]">
          <IoAlert className="text-2xl" />
        </div>
        <div className="flex-1">
          <div className="flex items-start md:justify-between md:items-center mb-1 flex-col md:flex-row gap-1">
            <CardTitle className="text-lg font-semibold text-[var(--primary)]">
              {alert.title}
            </CardTitle>
            <span className="text-xs text-gray-500">{formattedDate(alert.created_at)}</span>
          </div>
          <div className="flex items-end md:justify-between md:items-center mb-1 flex-col md:flex-row gap-1 w-full">
            <CardDescription className="text-gray-600 text-sm w-full text-start">
              {alert.description}
            </CardDescription>
            {isAdmin && (
              <div className="w-full text-end">
                <MiniButton className="mt-2 md:mt-0" onClick={() => onEdit(alert)}>
                  Cambiar aviso
                </MiniButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

// HEART PULSE CARD ----------------------------
const AnimationSelector = ({ activeIndex, setActiveIndex }) => {
  const animations = [
    { index: 0, colorClass: 'hover:text-[var(--primary)]', animation: 'animation-pulse' },
    { index: 1, colorClass: 'text-yellow-600 hover:text-yellow-700', animation: 'animation-pulse2' },
    { index: 2, colorClass: 'text-red-500 hover:text-red-600', animation: 'animation-pulse3' }
  ];

  return (
    <div className="box flex gap-2 p-2 shadow rounded-lg max-h-24">
      <div className="text-[var(--primary)] flex items-center">
        <li className="animations-pulse-content bg-[var(--primary)] rounded-lg border-4 border-[var(--secondary)]">
          {activeIndex === 0 && (
            <>
              <div className='animation-pulse'></div>
              <div className='animation-pulse'></div>
            </>
          )}
          {activeIndex === 1 && <div className='animation-pulse2'></div>}
          {activeIndex === 2 && <div className='animation-pulse3'></div>}
        </li>
      </div>
      <div className="bg-[var(--tertiary)] p-2 rounded-lg max-h-20">
        <ul className="flex flex-col gap-1 items-center justify-center h-full">
          {animations.map(({ index, colorClass }) => (
            <li key={index} className="cursor-pointer" onClick={() => setActiveIndex(index)}>
              <MdRadioButtonChecked className={colorClass} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// CHART CARD ----------------------------
const ChartCard = ({ title, children }) => (
  <Card className="box shadow rounded-lg flex-1">
    <CardHeader>
      <CardTitle className="text-lg font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent className="h-60">
      {children}
    </CardContent>
  </Card>
);

// MAIN ----------------------------------------
export default function Dashboard() {
    const company = usePage().props.company;
    const alertsProp = usePage().props.alerts;
    const isAdmin = usePage().props.user['mode_admin'];
    const company_stats = usePage().props.company_stats;
    const exam_stats = usePage().props.exam_stats;
    const history_stats = usePage().props.history_stats;
    const user_stats = usePage().props.user_stats;

  const alerts = alertsProp.length > 0 ? alertsProp : [{
    id: 0,
    title: "Funcionamiento normal",
    type: "info",
    description: "La plataforma funciona con normalidad.",
    id_company: null,
    expire: null,
    created_at: null,
    updated_at: null,
  }];

  const [selectedAlert, setSelectedAlert] = useState(null);
  const [modalAlertOpen, setModalAlertOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const { data, setData, post, errors } = useForm({
    id: selectedAlert?.id || '',
    title: selectedAlert?.title || '',
    description: selectedAlert?.description || '',
    type: selectedAlert?.type || 'info',
    expire: selectedAlert?.expire || '',
  });

  // FORMAT FUNCTIONS -------------------------------
  const formatMonth = (date) => {
    const month = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const [, m, d] = date.split("-");
    return `${month[parseInt(m, 10) - 1]}-${d}`;
  };

  const formattedDate = (date) => 
    date ? new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) : null;

  // CHART DATA --------------------------------
  const dataStats1 = history_stats?.map(data => ({
    name: formatMonth(data.date),
    score: parseInt(data.avg_score)
  })) || [];

  const dataStats2 = exam_stats?.map(exam => ({
    name: exam.exam_name.length > 7 
      ? `[${exam.id_exam}]${exam.exam_name.substring(0, 7)}...`
      : `[${exam.id_exam}]${exam.exam_name}`,
    intentos: parseInt(exam.total_attempts)
  })) || [];

  // STATS IN ROL -------------------------------
  const adminStats = [
    { title: "Total examenes", value: company_stats.total_exams },
    { title: "Total intentos", value: company_stats.total_exam_attempts },
    { title: "Total usuarios", value: company_stats.total_users },
    { title: "Total recursos", value: company_stats.total_resources }
  ];

  const userStats = [
    { title: "Total Intentos", value: user_stats.total_attempts },
    { title: "Score promedio", value: company_stats.avg_score },
    { title: "Exámenes aprobados", value: company_stats.passed_exams },
    { title: "Exámenes reprobados", value: company_stats.failed_exams }
  ];

  const statsToShow = isAdmin ? adminStats : userStats;

  // HANDLERS --------------------------------
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
    // RETURN -----------------------------------
  return (
    <AuthenticatedLayout title="Dashboard">
      <div className="py-1 w-full space-y-4">
        
        {/* ALERTS AND ANIMATION */}
        <div className="flex flex-wrap gap-4 w-full">
          <div className="space-y-4 flex-1 flex flex-col">
            {alerts.map((alert) => (
              <AlertCard 
                key={alert.id}
                alert={alert}
                onEdit={handleAlertEdit}
                isAdmin={isAdmin}
                formattedDate={formattedDate}
              />
            ))}
          </div>

          <AnimationSelector activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

          <div className="syringe-icon box flex gap-1 p-2 sm:p-3 shadow rounded-lg flex-col flex-1 md:flex-initial justify-center max-h-24 items-center">
            <FaSyringe className="text-4xl text-[var(--primary)]" />
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="flex flex-wrap gap-4">
          {statsToShow.map((stat, index) => (
            <StatCard 
              key={index}
              title={stat.title}
              value={stat.value}
              icon={MdOutlineTrendingUp}
            />
          ))}
        </div>

        {/* CHARTS */}
        {isAdmin && (
          <div className="flex flex-wrap gap-4 w-full flex-col md:flex-row">
            <ChartCard title="Estadísticas de aciertos %">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataStats1}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke={company.primary_color} strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Estadísticas de intentos">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataStats2}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="intentos" fill={company.primary_color} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        )}
      </div>

      {/* MODALS ----------------------------- */}
      {isAdmin && (
        <Modal show={modalAlertOpen} onClose={() => setModalAlertOpen(false)}>
          {data && (
            <form onSubmit={handleAlertSave} className="p-6 space-y-4">
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
                <input 
                  type="datetime-local" 
                  name="expire" 
                  value={data.expire}
                  onChange={(e) => setData('expire', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Tipo</label>
                <Select
                  name="type"
                  value={data.type}
                  onChange={(e) => setData('type', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="warning">Advertencia (Verde)</option>
                  <option value="info">Información (Blanco)</option>
                  <option value="precaution">Precaución (Amarillo)</option>
                  <option value="danger">Peligro (Rojo)</option>
                </Select>
              </div>

              <div className="flex gap-2 mt-4 justify-between">
                <SecondaryButton type="button" onClick={() => setModalAlertOpen(false)}>
                  Cancelar
                </SecondaryButton>
                <PrimaryButton type="submit">
                  Guardar
                </PrimaryButton>
              </div>
            </form>
          )}
        </Modal>
        //------------------------------------
      )}
    </AuthenticatedLayout>
  );
}