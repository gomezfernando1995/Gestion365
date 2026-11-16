import { useMemo } from "react";
import {
  CpuChipIcon,
  CheckCircleIcon,
  WrenchScrewdriverIcon,
  BuildingOfficeIcon,
  ClockIcon
} from "@heroicons/react/24/solid";
import type { Equipment } from "../services/equipmentService";
import { useIncidentByEquipment } from "../hooks/useIncidents";

interface EquipmentDetailViewProps {
  equipo: Equipment;
  onBack: () => void;
  onRegisterIncident: () => void;
}

export default function EquipmentDetailView({ equipo }: EquipmentDetailViewProps) {
  
  // Hook personalizado para obtener o filtrar incidentes por equipo si es necesario
  const { incidentsByEquipment } = useIncidentByEquipment(equipo?.id_equipo);

  // Usar los incidentes del hook si están disponibles, de lo contrario usar equipo.incidentes
  const incidentesList = incidentsByEquipment || equipo?.incidentes || [];

  // Cálculo automático de disponibilidad basado en la cantidad de incidentes y tiempo de inactividad
  const disponibilidad = useMemo(() => {
    const horasPlanificadas = 720; // Base de 30 días
    const totalDowntime = incidentesList.length * 2.0; 
    const tiempoOperativo = horasPlanificadas - totalDowntime;
    const porcentaje = (tiempoOperativo / horasPlanificadas) * 100;
    return Math.max(0, porcentaje).toFixed(1);
  }, [incidentesList]);

  if (!equipo) return null;

  return (
    <div className="col-span-12 lg:col-span-12 bg-gray-50 p-2 text-sm space-y-4 animate-fadeIn">
      
      {/* Header superior */}
    

      {/* Grid Principal: Fichas técnicas + Panel Lateral */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* Columna Izquierda (3/4) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Tarjetas de Información Superior */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* Tarjeta 1: Ficha Técnica */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <CpuChipIcon className="h-4 w-4 text-gray-500" /> Información Técnica
              </h2>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-gray-500">Marca/Modelo:</span> <span className="font-semibold text-gray-800">{equipo.marca} {equipo.modelo}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Tipo:</span> <span className="font-semibold text-gray-800">{equipo.tipo_equipos?.descripcion || "Genérico"}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">IP:</span> <span className="font-semibold text-blue-600">{equipo.direccion_ip || "—"}</span></div>
              </div>
            </div>

            {/* Tarjeta 2: Ubicación */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <BuildingOfficeIcon className="h-4 w-4 text-gray-500" /> Ubicación
              </h2>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-gray-500">Sector:</span> <span className="font-semibold text-gray-800 text-right">{equipo.sector?.nombre || "Sector Asignado"}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Descripción:</span> <span className="font-medium text-gray-700">{equipo.descripcion || "—"}</span></div>
              </div>
            </div>

            {/* Tarjeta 3: Estado */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <WrenchScrewdriverIcon className="h-4 w-4 text-gray-500" /> Estado Actual
              </h2>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">ID de Estado:</span> 
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 font-semibold rounded text-xs">Código #{equipo.id_estado_equipo}</span>
                </div>
                <div className="flex justify-between"><span className="text-gray-500">Fecha de Alta:</span> <span className="font-medium text-gray-600">{new Date(equipo.fecha_alta).toLocaleDateString("es-AR")}</span></div>
              </div>
            </div>

          </div>

          {/* Historial de Incidentes Atendidos */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <WrenchScrewdriverIcon className="w-4 h-4 text-blue-600" /> Historial de Incidentes Atendidos
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 text-xs font-semibold text-gray-600 uppercase">
                  <tr>
                    <th className="p-2.5 text-center">Fecha</th>
                    <th className="p-2.5 text-center">ID</th>
                    <th className="p-2.5">Título / Problema</th>
                    <th className="p-2.5 text-center">Técnico Asignado</th>
                    <th className="p-2.5 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-xs">
                  {incidentesList.length > 0 ? (
                    incidentesList.map((inc: any) => (
                      <tr key={inc.id_incidente} className="hover:bg-blue-50 transition-colors">
                        <td className="p-2.5 text-center text-gray-500">
                          {inc.created_at ? new Date(inc.created_at).toLocaleDateString("es-AR") : "—"}
                        </td>
                        <td className="p-2.5 text-center font-semibold text-gray-700">#{inc.id_incidente}</td>
                        <td className="p-2.5 font-medium text-gray-900">{inc.titulo || inc.descripcion}</td>
                        <td className="p-2.5 text-center text-gray-700">{inc.usuario_asignado?.nombre || "Sin asignar"}</td>
                        <td className="p-2.5 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-[11px] font-semibold">
                            <CheckCircleIcon className="h-3.5 w-3.5" /> {inc.estado_incidentes?.descripcion || "Registrado"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400 italic">
                        No hay incidentes registrados para este equipo.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Columna Derecha (Sidebar de Métricas) */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
              <ClockIcon className="h-4 w-4 text-gray-500" /> Resumen de Métricas
            </h2>

            <div className="bg-gray-50 p-3 rounded-xl mb-3">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">TOTAL DE INCIDENTES</span>
              <p className="text-2xl font-bold text-blue-600">{incidentesList.length} <span className="text-xs font-normal text-gray-500">tickets</span></p>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">DISPONIBILIDAD</span>
              <p className="text-2xl font-bold text-green-600">{disponibilidad}%</p>
              <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
                <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${disponibilidad}%` }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}