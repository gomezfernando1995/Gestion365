import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, Loader2 } from "lucide-react";
import { updateIncident } from "../services/incidentsService";
import Swal from "sweetalert2";
import { getStateIncidentNeq, type StateIncident } from "../services/stateIncidentService";

// IDs de estados permitidos para el cierre
const ALLOWED_STATE_IDS = [7, 8, 10];

interface SimpleAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: any;
}

export const ModalCerrarIncident: React.FC<SimpleAssignModalProps> = ({
  isOpen,
  onClose,
  incident,
}) => {
  const [statesList, setStatesList] = useState<StateIncident[]>([]);
  const [selectedStateId, setSelectedStateId] = useState<string | number>("");
  const [resolucion, setResolucion] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStates = async () => {
      if (!isOpen || !incident?.id_estado_incidente) return;

      setIsLoading(true);
      try {
        const states = await getStateIncidentNeq(Number(incident.id_estado_incidente));
        // Filtramos solo los estados de cierre/resolución (7, 8, 10)
        const filteredStates = (states || []).filter((state) =>
          ALLOWED_STATE_IDS.includes(Number(state.id_estado_incidente))
        );
        setStatesList(filteredStates);
      } catch (error) {
        console.error("Error al obtener los estados del incidente:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStates();
  }, [incident, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStateId || !incident?.id_incidente || !resolucion.trim()) return;

    setIsLoading(true);

    let cierre: string | undefined = undefined;
    let tiempoResolucionHoras: number | undefined = undefined;
    let cumpleSla: boolean = true;

    const numericStateId = Number(selectedStateId);

   // Si el estado seleccionado es de cierre/resolución
    if (ALLOWED_STATE_IDS.includes(numericStateId)) {
      const fechaCierreDate = new Date();
      cierre = fechaCierreDate.toISOString();

      const fechaInicio = incident.fecha_inicio || incident.created_at;
      if (fechaInicio) {
        const isoFechaInicio = fechaInicio.includes(" ") 
          ? fechaInicio.replace(" ", "T") 
          : fechaInicio;

        const inicioMs = new Date(isoFechaInicio).getTime();
        const finMs = fechaCierreDate.getTime();
        const diffMs = finMs - inicioMs;

        if (!isNaN(inicioMs) && diffMs > 0) {
          // 1. Calculamos horas, minutos y segundos exactos para el tipo INTERVAL de Postgres
          const totalSegundos = Math.floor(diffMs / 1000);
          const horas = Math.floor(totalSegundos / 3600);
          const minutos = Math.floor((totalSegundos % 3600) / 60);
          const segundos = totalSegundos % 60;
          const milisegundos = diffMs % 1000;

          // Formato exacto que acepta Postgres interval: "HH:MM:SS.sss"
          tiempoResolucionHoras = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}.${String(milisegundos).padStart(3, '0')}` as any;

          // Para la validación de SLA, también necesitamos el número en horas flotantes
          const horasFlotantes = Number((diffMs / (1000 * 60 * 60)).toFixed(2));

          // Validación de SLA según prioridad
          const prioridadDesc = incident.prioridad_incidentes?.descripcion?.toLowerCase() || "";
          let limiteHoras = 24; // Valor por defecto (Media)
          
          if (prioridadDesc.includes("crítica") || prioridadDesc.includes("critica")) limiteHoras = 2;
          else if (prioridadDesc.includes("urgente")) limiteHoras = 8;
          else if (prioridadDesc.includes("media")) limiteHoras = 24;
          else if (prioridadDesc.includes("baja")) limiteHoras = 48;

          if (!prioridadDesc.includes("informativa")) {
            cumpleSla = horasFlotantes <= limiteHoras;
          }
        } else {
          tiempoResolucionHoras = "00:00:00" as any;
        }
      }
    }

    try {
      const payload = {
        id_estado_incidente: numericStateId,
        resolucion: resolucion.trim(),
        updated_at: new Date().toISOString(),
        fecha_cierre: cierre,
        tiempo_resolucion: tiempoResolucionHoras, 
        sla_cumple: cumpleSla, 
      };

      await updateIncident(Number(incident.id_incidente), payload);

      onClose();

      await Swal.fire({
        title: "¡Ticket Cerrado/Resuelto!",
        text: `El incidente #${incident.id_incidente} fue actualizado correctamente.`,
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#2563eb",
        customClass: {
          popup: "rounded-2xl",
        },
      });

      setSelectedStateId("");
      setResolucion("");
      window.location.reload();
    } catch (err) {
      console.error("Error al cerrar el incidente:", err);
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar el estado del incidente.",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    setSelectedStateId("");
    setResolucion("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-slate-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Cierre de Ticket #{incident?.id_incidente}
              </h3>
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Selección de Estado */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Nuevo Estado
                </label>
                <select
                  value={selectedStateId}
                  onChange={(e) => setSelectedStateId(e.target.value)}
                  disabled={isLoading || statesList.length === 0}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition disabled:opacity-50"
                >
                  <option value="" disabled>
                    {statesList.length === 0
                      ? "Cargando estados permitidos..."
                      : "Seleccionar estado..."}
                  </option>
                  {statesList.map((state) => (
                    <option key={state.id_estado_incidente} value={state.id_estado_incidente}>
                      {state.descripcion}
                    </option>
                  ))}
                </select>
              </div>

              {/* Justificación del Cierre */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Justificación / Motivo del cierre <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={resolucion}
                  onChange={(e) => setResolucion(e.target.value)}
                  placeholder="Detalla el motivo del cierre o resolución..."
                  disabled={isLoading}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition disabled:opacity-50"
                />
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="rounded-xl px-4 py-2 text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !selectedStateId || !resolucion.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  <span>{isLoading ? "Guardando..." : "Confirmar Cierre"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};