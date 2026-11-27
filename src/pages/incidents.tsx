import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FlagIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  PuzzlePieceIcon,
  FireIcon,
  QuestionMarkCircleIcon,
  LightBulbIcon,
  InboxIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

import { useIncidentes } from "../hooks/useIncidents";
import ModalIncidents from "../components/ModaNewIncidents";
import Loader from "../components/Loader";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/es";
import { textOrganic } from "../utils/textFormat";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("es");
dayjs.tz.setDefault("America/Argentina/Buenos_Aires");

// Helper para tiempo transcurrido
const getElapsedTime = (fechaInicio: string) => {
  if (!fechaInicio) return "N/A";
  return dayjs.utc(fechaInicio).tz("America/Argentina/Buenos_Aires").fromNow();
};

// Helper de estilos por Estado
const getStatusColor = (status?: string) => {
  switch (status) {
    case "Abierto":
      return "bg-red-800 text-white";
    case "En Proceso":
      return "bg-amber-500 text-white";
    case "En análisis":
      return "bg-orange-500 text-white";
    case "Resuelto":
      return "bg-green-600 text-white";
    case "Cerrado":
      return "bg-gray-500 text-white";
    case "Cancelado":
      return "bg-gray-500 text-white";
    case "Pendiente de información":
      return "bg-gray-100 text-yellow-500";
    default:
      return "bg-gray-200 text-gray-700";
  }
};

// Helper de estilos por Prioridad
const getPriorityColor = (priority?: string) => {
  switch (priority) {
    case "Crítica":
      return "bg-red-700 text-white";
    case "Urgente":
      return "bg-red-100 text-red-700";
    case "Media":
      return "bg-amber-100 text-amber-700";
    case "Baja":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getPriorityIcon = (priority?: string) => {
  switch (priority) {
    case "Crítica":
      return <ExclamationTriangleIcon className="w-4 h-4 text-white" />;
    case "Urgente":
      return <ArrowTrendingUpIcon className="w-4 h-4 text-red-600" />;
    case "Media":
      return <FlagIcon className="w-4 h-4 text-amber-600" />;
    case "Baja":
      return <ArrowTrendingDownIcon className="w-4 h-4 text-green-600" />;
    default:
      return <InformationCircleIcon className="w-4 h-4 text-gray-500" />;
  }
};

const getTicketIcon = (tipo?: string) => {
  switch (tipo) {
    case "Incidente":
      return <FireIcon className="w-4 h-4 text-red-600" />;
    case "Problema":
      return <PuzzlePieceIcon className="w-4 h-4 text-orange-600" />;
    case "Pregunta":
      return <QuestionMarkCircleIcon className="w-4 h-4 text-blue-600" />;
    case "Sugerencia":
      return <LightBulbIcon className="w-4 h-4 text-yellow-500" />;
    case "Solicitud de servicio":
      return <InboxIcon className="w-4 h-4 text-green-600" />;
    case "Cambio":
      return <ArrowPathIcon className="w-4 h-4 text-purple-600" />;
    case "Tarea":
      return <CheckCircleIcon className="w-4 h-4 text-teal-600" />;
    default:
      return <InformationCircleIcon className="w-4 h-4 text-gray-500" />;
  }
};



export default function Incidents() {

  const MAPA_ESTADOS = {
    ABIERTOS: [1, 9],
    EN_PROCESO: [2, 3, 4, 5, 6],
    RESUELTOS: [7],
    CERRADOS: [8, 10],
  };

  const { incidents = [], loadingIncidents } = useIncidentes();
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatusGroup, setSelectedStatusGroup] = useState("TODOS");
  const [selectedPriority, setSelectedPriority] = useState("TODAS");

  const statusCounts = useMemo(() => {
    return {
      abiertos: incidents.filter((i) => MAPA_ESTADOS.ABIERTOS.includes(i.id_estado_incidente)).length,
      enProceso: incidents.filter((i) => MAPA_ESTADOS.EN_PROCESO.includes(i.id_estado_incidente)).length,
      resueltos: incidents.filter((i) => MAPA_ESTADOS.RESUELTOS.includes(i.id_estado_incidente)).length,
      cerrados: incidents.filter((i) => MAPA_ESTADOS.CERRADOS.includes(i.id_estado_incidente)).length,
    };
  }, [incidents]);

  // Filtrado reactivo de la tabla
  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      const search = searchTerm.toLowerCase();
      const title = incident.titulo?.toLowerCase() || "";
      const id = String(incident.id_incidente || "");
      const establishment = incident.establecimientos?.nombre?.toLowerCase() || "";
      const user = incident.usuarios?.nombre?.toLowerCase() || "";

      const matchesSearch =
        title.includes(search) ||
        id.includes(search) ||
        establishment.includes(search) ||
        user.includes(search);

      let matchesStatus = true;
      if (selectedStatusGroup === "ABIERTOS") {
        matchesStatus = MAPA_ESTADOS.ABIERTOS.includes(incident.id_estado_incidente);
      } else if (selectedStatusGroup === "EN_PROCESO") {
        matchesStatus = MAPA_ESTADOS.EN_PROCESO.includes(incident.id_estado_incidente);
      } else if (selectedStatusGroup === "RESUELTOS") {
        matchesStatus = MAPA_ESTADOS.RESUELTOS.includes(incident.id_estado_incidente);
      } else if (selectedStatusGroup === "CERRADOS") {
        matchesStatus = MAPA_ESTADOS.CERRADOS.includes(incident.id_estado_incidente);
      }

      const priorityDesc = incident.prioridad_incidentes?.descripcion;
      const matchesPriority =
        selectedPriority === "TODAS" || priorityDesc === selectedPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [incidents, searchTerm, selectedStatusGroup, selectedPriority]);
  if (loadingIncidents) {
    return (
      <Loader
        text="Cargando Incidentes..."
        url="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDJhdGZhZXozcDl1Mm14d3ptN3Z3YnV1YzFoYTNveHB3djJwMmdoNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/sDZ1X9cb9qEMrYU584/giphy.gif"
      />
    );
  }


  return (
    <div className="min-h-screen overflow-y-auto bg-gray-100 p-4 space-y-4">
      {/* Header */}
      <header className="flex flex-col sm:flex-row  justify-between items-center bg-white shadow-sm p-4 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-blue-900">Panel de Incidentes</h1>
          <p className="text-xs text-gray-500">Gestión y seguimiento de solicitudes del sistema</p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="mt-3 sm:mt-0 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition shadow-sm cursor-pointer"
        >
          <PlusIcon className="w-5 h-5" />
          Nuevo Incidente
        </button>
      </header>

      {/* Tarjetas superiores */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => setSelectedStatusGroup(selectedStatusGroup === "ABIERTOS" ? "TODOS" : "ABIERTOS")}
          className={`bg-white shadow-sm rounded-xl p-4 text-center cursor-pointer border transition hover:border-red-500 ${selectedStatusGroup === "ABIERTOS" ? "border-red-700 ring-2 ring-red-700" : "border-gray-100"}`}
        >
          <span className="block text-2xl font-bold text-red-700">{statusCounts.abiertos}</span>
          <span className="text-xs font-semibold text-gray-500 uppercase">Abiertos</span>
        </div>

        <div
          onClick={() => setSelectedStatusGroup(selectedStatusGroup === "EN_PROCESO" ? "TODOS" : "EN_PROCESO")}
          className={`bg-white shadow-sm rounded-xl p-4 text-center cursor-pointer border transition hover:border-amber-500 ${selectedStatusGroup === "EN_PROCESO" ? "border-amber-500 ring-2 ring-amber-500" : "border-gray-100"}`}
        >
          <span className="block text-2xl font-bold text-amber-500">{statusCounts.enProceso}</span>
          <span className="text-xs font-semibold text-gray-500 uppercase">En Proceso</span>
        </div>

        <div
          onClick={() => setSelectedStatusGroup(selectedStatusGroup === "RESUELTOS" ? "TODOS" : "RESUELTOS")}
          className={`bg-white shadow-sm rounded-xl p-4 text-center cursor-pointer border transition hover:border-green-500 ${selectedStatusGroup === "RESUELTOS" ? "border-green-500 ring-2 ring-green-500" : "border-gray-100"}`}
        >
          <span className="block text-2xl font-bold text-green-600">{statusCounts.resueltos}</span>
          <span className="text-xs font-semibold text-gray-500 uppercase">Resueltos</span>
        </div>

        <div
          onClick={() => setSelectedStatusGroup(selectedStatusGroup === "CERRADOS" ? "TODOS" : "CERRADOS")}
          className={`bg-white shadow-sm rounded-xl p-4 text-center cursor-pointer border transition hover:border-gray-500 ${selectedStatusGroup === "CERRADOS" ? "border-gray-500 ring-2 ring-gray-500" : "border-gray-100"}`}
        >
          <span className="block text-2xl font-bold text-gray-500">{statusCounts.cerrados}</span>
          <span className="text-xs font-semibold text-gray-500 uppercase">Cerrados</span>
        </div>
      </section>

      {/* Barra de Filtros y Búsqueda */}
      <section className="bg-white shadow-sm p-4 rounded-xl flex flex-col md:flex-row items-center gap-4">
        {/* Buscador general */}
        <div className="relative flex-1 w-full">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por ID, título, establecimiento o usuario..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Selector Estado */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <FunnelIcon className="w-5 h-5 text-gray-400 hidden sm:block" />
          <select
            value={selectedStatusGroup}
            onChange={(e) => setSelectedStatusGroup(e.target.value)}
            className="w-full md:w-auto text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-600 text-gray-700"
          >
            <option value="TODOS">Todos los Estados</option>
            <option value="ABIERTOS">Abiertos (Reportados / Reabiertos)</option>
            <option value="EN_PROCESO">En Proceso (Asignados, Progreso, etc.)</option>
            <option value="RESUELTOS">Resueltos</option>
            <option value="CERRADOS">Cerrados / Cancelados</option>
          </select>
        </div>

        {/* Selector Prioridad */}
        <div className="w-full md:w-auto">
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full md:w-auto text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-600 text-gray-700"
          >
            <option value="TODAS">Todas las Prioridades</option>
            <option value="Crítica">Crítica</option>
            <option value="Urgente">Urgente</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>

        {/* Limpiar Filtros */}
        {(searchTerm || selectedStatusGroup !== "TODOS" || selectedPriority !== "TODAS") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedStatusGroup("TODOS");
              setSelectedPriority("TODAS");
            }}
            className="text-xs text-blue-600 hover:underline font-medium whitespace-nowrap"
          >
            Limpiar filtros
          </button>
        )}
      </section>

      {/* Tabla de incidentes */}
      <div className="bg-white shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[65vh]">
          <table className="w-full text-center border-collapse">
            <thead className="bg-gray-100 text-gray-600 text-xs uppercase font-semibold sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Prioridad</th>
                <th className="p-3 text-left">Título</th>
                <th className="p-3">Establecimiento</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Responsable</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Creado</th>
                <th className="p-3">Actualizado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    No se encontraron incidentes que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((incident) => (

                  <tr
                    key={incident.id_incidente}
                    onClick={() => navigate(`/incidents/${incident.id_incidente}`)}
                    
                  >
                    <td className={`p-3 font-semibold text-gray-700 ${incident.estado_incidentes?.descripcion?.toLowerCase() === "reportado" ? "border-l-2 border-red-500 bg-red-50/40" : ""}`}>
                      #{incident.id_incidente}
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${getPriorityColor(incident.prioridad_incidentes?.descripcion)}`}>
                        {getPriorityIcon(incident.prioridad_incidentes?.descripcion)}
                        {incident.prioridad_incidentes?.descripcion || "N/A"}
                      </span>
                    </td>
                    <td className="p-3 text-left font-medium text-gray-900 max-w-xs truncate">
                      {incident.titulo}
                    </td>
                    <td className="p-3 text-gray-600">
                      {incident.establecimientos?.nombre || "Sin Asignar"}
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                        {getTicketIcon(incident.tipo_tickets?.descripcion)}
                        {incident.tipo_tickets?.descripcion || "General"}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">
                      {incident.usuario_reporta?.nombre ? `${textOrganic(incident.usuario_reporta.nombre)}` : "Sin asignar"}
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(incident.estado_incidentes?.descripcion)}`}>
                        {incident.estado_incidentes?.descripcion || "Indefinido"}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-gray-500 whitespace-nowrap">
                      {getElapsedTime(incident.created_at)}
                    </td>
                    <td className="p-3 text-xs text-gray-500 whitespace-nowrap">
                      {getElapsedTime(incident.updated_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalIncidents
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSave={() => {
          setOpenModal(false);
        }}
      />
    </div>
  );
}