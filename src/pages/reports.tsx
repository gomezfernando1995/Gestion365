import React, { useState } from "react";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  TrendingUp,
} from "lucide-react";
import {
  calcularMTTR,
  useClosedIncidentsByMonth,
  useClosedIncidentsByQuarter,
  useClosedIncidentsByYear
} from "../hooks/useReports";

export const Reports: React.FC = () => {
  // Estado para el selector del período ("este_mes" | "ultimo_q" | "anio_actual")
  const [period, setPeriod] = useState<string>("este_mes");

  // Parámetros de año y trimestre actual
  const anio = 2026;
  const trimestreActual = 4; // Q4
  const mesActual = new Date().getMonth(); // 0 al 11

  // Llamada a los 3 hooks personalizados
  const { incidentsByMonth, loading: loadingMonth, error: errorMonth } = useClosedIncidentsByMonth(mesActual, anio);
  const { incidentsByQuarter, loading: loadingQuarter, error: errorQuarter } = useClosedIncidentsByQuarter(trimestreActual, anio);
  const { incidentsByYear, loading: loadingYear, error: errorYear } = useClosedIncidentsByYear(anio);

  // Seleccionar los incidentes y estados de carga según el período elegido en el select
  const getActiveData = () => {
    switch (period) {
      case "este_mes":
        return { incidents: incidentsByMonth, loading: loadingMonth, error: errorMonth };
      case "ultimo_q":
        return { incidents: incidentsByQuarter, loading: loadingQuarter, error: errorQuarter };
      case "anio_actual":
        return { incidents: incidentsByYear, loading: loadingYear, error: errorYear };
      default:
        return { incidents: incidentsByMonth, loading: loadingMonth, error: errorMonth };
    }
  };
  const { incidents, loading, error } = getActiveData();

  const totalTickets = incidents.length;
  const ticketsCumplen = incidents.filter(inc => inc.sla_cumple === true).length;
  const ticketsVencidos = incidents.filter(inc => inc.sla_cumple === false).length;

  // Conteo según tus estados reales (ajusta los IDs según corresponda en tu base de datos)
  const resueltos = incidents.filter(inc => inc.id_estado_incidente === 7).length;   // Ej: ID 7 = Resuelto
  const cerrados = incidents.filter(inc => inc.id_estado_incidente === 8).length;    // Ej: ID 8 = Cerrado
  const cancelados = incidents.filter(inc => inc.id_estado_incidente === 10).length; // Ej: ID 10 = Cancelado

  // Porcentajes calculados dinámicamente
  const porcentajeResueltos = totalTickets > 0 ? Math.round((resueltos / totalTickets) * 100) : 0;
  const porcentajeCerrados = totalTickets > 0 ? Math.round((cerrados / totalTickets) * 100) : 0;
  const porcentajeCancelados = totalTickets > 0 ? Math.round((cancelados / totalTickets) * 100) : 0;

  const mttrCalculado = calcularMTTR(incidents);

  const porcentajeSLA = totalTickets > 0
    ? ((ticketsCumplen / totalTickets) * 100).toFixed(1)
    : "0.0";

  const stats = [
    {
      title: "Cumplimiento SLA",
      value: `${porcentajeSLA}%`,
      change: "+2.4%",
      status: Number(porcentajeSLA) >= 90 ? "positive" : "negative",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50"
    },
    {
      title: "Tiempo Prom. Cierre (MTTR)",
      value: mttrCalculado,
      change: "-1.1 hr",
      status: "positive",
      icon: Clock,
      color: "text-blue-600 bg-blue-50"
    },
    {
      title: "Total Tickets Periodo",
      value: totalTickets.toString(),
      change: "Cerrados",
      status: "positive",
      icon: TrendingUp,
      color: "text-indigo-600 bg-indigo-50"
    },
    {
      title: "Tickets Vencidos (Fuera SLA)",
      value: ticketsVencidos.toString(),
      change: `${ticketsVencidos} tickets`,
      status: ticketsVencidos === 0 ? "positive" : "negative",
      icon: AlertTriangle,
      color: "text-rose-600 bg-rose-50"
    },
  ];

  if (loading) {
    return <div className="p-6 text-center text-slate-500">Cargando reportes...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-rose-600">Error al cargar datos: {error}</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-50 min-h-screen">
      {/* 1. Header y Filtros Globales */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Reporte Ejecutivo de Operaciones</h1>
          <p className="text-xs text-slate-500 mt-1">Métricas clave de rendimiento y nivel de servicio (SLA)</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl text-xs font-medium text-slate-700 border border-slate-200">
            <Calendar className="w-4 h-4 text-slate-500 ml-1" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-transparent outline-none pr-2 cursor-pointer font-semibold text-slate-800"
            >
              <option value="este_mes">Este Mes</option>
              <option value="ultimo_q">Último Trimestre</option>
              <option value="anio_actual">Año 2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Tarjetas de KPIs (Stat Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{stat.title}</span>
                <div className={`p-2 rounded-xl ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-slate-900">{stat.value}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${stat.status === 'positive' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Sección de Gráficos de Ejemplo (Panel Táctico) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribución por Sector */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Volumen de Incidentes por Sector</h3>
            <span className="text-xs font-medium text-slate-400">Total: {incidents.length} tickets en el periodo</span>
          </div>
          <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-xs text-slate-400">Gráfico interactivo de barras (Infraestructura vs Sistemas vs Soporte)</p>
          </div>
        </div>

        {/* Desglose de Motivos de Cierre */}
        {/* Desglose de Motivos de Cierre */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Resolución vs Cierre</h3>
            <span className="text-xs font-medium text-slate-400">Distribución %</span>
          </div>
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Resueltos - Total: {resueltos}</span>
                <span className="font-bold text-slate-900">{porcentajeResueltos}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: `${porcentajeResueltos}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Cerrados - Total: {cerrados}</span>
                <span className="font-bold text-slate-900">{porcentajeCerrados}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${porcentajeCerrados}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Cancelados - Total: {cancelados}</span>
                <span className="font-bold text-slate-900">{porcentajeCancelados}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-rose-500 h-2 rounded-full transition-all duration-500" style={{ width: `${porcentajeCancelados}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};