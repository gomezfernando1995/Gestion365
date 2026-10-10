import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserCheck, X, Loader2 } from "lucide-react";
import { updateIncident } from "../services/incidentsService";
import Swal from "sweetalert2";

export interface UserOption {
  id: number | string;
  name: string;
}

interface SimpleAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserOption[];
  incident: string | number | undefined;
}

export const ModalAssignUserByTicket: React.FC<SimpleAssignModalProps> = ({
  isOpen,
  onClose,
  users,
  incident,
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string | number>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !incident) return;

    setIsLoading(true);
    try {
      const payload = {
        id_usuario_asignado: Number(selectedUserId),
        updated_at: new Date().toISOString(), // Fecha ISO válida para la base de datos
      };

      updateIncident(Number(incident), payload);
      onClose();
      Swal.fire({
        title: "¡Ticket Reasignado!",
        text: `El incidente #${incident} fue reasignado correctamente.`,
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#2563eb", // Azul estilo Tailwind (bg-blue-600)
        customClass: {
          popup: "rounded-2xl", // Aplica bordes redondeados al popup
        },
      }).then((result) => {
        // 3. Si quieres recargar la página tras presionar "Aceptar"
        if (result.isConfirmed) {
          setSelectedUserId("");
          window.location.reload();
        }
      });

    } catch (err) {
      console.error("Error al actualizar Incidente:", err);
      alert("Error al actualizar el incidente ❌");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    setSelectedUserId("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Fondo traslúcido con cierre al hacer clic */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-slate-200 z-10"
          >
            {/* Encabezado */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Escalado de Ticket #{incident}
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

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Seleccionar Usuario
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition"
                >
                  <option value="" disabled>
                    Elegir un usuario...
                  </option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
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
                  disabled={isLoading || !selectedUserId}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserCheck className="h-4 w-4" />
                  )}
                  <span>{isLoading ? "Asignando..." : "Asignar"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};