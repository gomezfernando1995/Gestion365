import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, X, Loader2 } from "lucide-react";
import { updateIncident } from "../services/incidentsService";
import Swal from "sweetalert2";
import { getStateIncidentNeq, type StateIncident } from "../services/stateIncidentService";

interface SimpleAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: any; // O una interfaz Incident si la tienes definida
}

export const ModalUpdateStateIncident: React.FC<SimpleAssignModalProps> = ({
  isOpen,
  onClose,
  incident,
}) => {
  const [statesList, setStatesList] = useState<StateIncident[]>([]);
  const [selectedStateId, setSelectedStateId] = useState<string | number>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStates = async () => {
      // Guard clause para evitar errores al evaluar un objeto no definido
      if (!isOpen || !incident?.id_estado_incidente) return;

      setIsLoading(true);
      try {
        const states = await getStateIncidentNeq(Number(incident.id_estado_incidente));
        setStatesList(states || []);
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
    if (!selectedStateId || !incident?.id_incidente) return;

    setIsLoading(true);
    try {
      const payload = {
        id_estado_incidente: Number(selectedStateId),
        updated_at: new Date().toISOString(),
      };

      await updateIncident(Number(incident.id_incidente), payload);

      onClose();

      await Swal.fire({
        title: "¡Estado Actualizado!",
        text: `El estado del incidente #${incident.id_incidente} fue actualizado correctamente.`,
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#2563eb",
        customClass: {
          popup: "rounded-2xl",
        },
      });

      setSelectedStateId("");
      window.location.reload();
    } catch (err) {
      console.error("Error al actualizar el estado del incidente:", err);
      Swal.fire({
        title: "Error",
        text: "No se pudo cambiar el estado del incidente.",
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
                Cambiar Estado del Ticket #{incident?.id_incidente}
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
                      ? "Cargando estados..."
                      : "Seleccionar estado..."}
                  </option>
                  {statesList.map((state) => (
                    <option key={state.id_estado_incidente} value={state.id_estado_incidente}>
                      {state.descripcion}
                    </option>
                  ))}
                </select>
              </div>

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
                  disabled={isLoading || !selectedStateId}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  <span>{isLoading ? "Guardando..." : "Cambiar Estado"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};