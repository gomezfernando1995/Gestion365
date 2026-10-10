
import React, { useState } from "react";
import { 

  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 

  TrendingUp, 
} from "lucide-react";

export const Reports: React.FC = () => {
  const [period, setPeriod] = useState("este_mes");

  // Datos simulados de ejemplo
  const stats = [
    { title: "Cumplimiento SLA", value: "94.2%", change: "+2.4%", status: "positive", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
    { title: "Tiempo Prom. Cierre (MTTR)", value: "4.8 hrs", change: "-1.1 hr", status: "positive", icon: Clock, color: "text-blue-600 bg-blue-50" },
    { title: "Tickets Reincidentes", value: "3.5%", change: "-0.8%", status: "positive", icon: TrendingUp, color: "text-indigo-600 bg-indigo-50" },
    { title: "Tickets Vencidos (Fuera SLA)", value: "12", change: "+3", status: "negative", icon: AlertTriangle, color: "text-rose-600 bg-rose-50" },
  ];

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
              <option value="este_mes">Este Mes (Octubre)</option>
              <option value="ultimo_q">Último Trimestre (Q3)</option>
              <option value="anio_actual">Año 2026</option>
            </select>
          </div>
        {/* 
          <button className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow-sm">
            <Download className="w-4 h-4" />
            <span>Exportar PDF</span>
          </button>
          */}
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
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  stat.status === 'positive' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
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
            <span className="text-xs font-medium text-slate-400">Total: 410 tickets</span>
          </div>
          {/* Espacio reservado para gráfico de barras */}
          <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-xs text-slate-400">Gráfico interactivo de barras (Infraestructura vs Sistemas vs Soporte)</p>
          </div>
        </div>

        {/* Desglose de Motivos de Cierre */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Resolución vs Cierre</h3>
            <span className="text-xs font-medium text-slate-400">Distribución %</span>
          </div>
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Resueltos (ID: 7)</span>
                <span className="font-bold text-slate-900">78%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "78%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Cancelados (ID: 8)</span>
                <span className="font-bold text-slate-900">14%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-slate-400 h-2 rounded-full" style={{ width: "14%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Duplicados (ID: 10)</span>
                <span className="font-bold text-slate-900">8%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: "8%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};