import { useState, useEffect } from "react";
import { XMarkIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { updateStation, type Station } from "../services/stationsService";

interface ModalModifyStationProps {
    isOpen: boolean;
    onClose: () => void;
    puesto: Station | null;
    onSubmitSuccess?: () => void;
}

export function ModalModifyPuesto({ isOpen, onClose, puesto, onSubmitSuccess }: ModalModifyStationProps) {
    const [telefono, setTelefono] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Precargar los datos cuando el modal se abre y recibe un puesto
    useEffect(() => {
        if (puesto) {
            setTelefono(puesto.telefono || "");
            setDescripcion(puesto.descripcion || "");
        }
    }, [puesto]);

    if (!isOpen || !puesto) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            await updateStation(puesto.id_puesto, {
                telefono,
                descripcion,
                updated_at: new Date().toISOString(),
            });

            onClose();
            await Swal.fire({
                title: "¡Puesto Actualizado!",
                text: "Los cambios se guardaron correctamente.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
                customClass: {
                    popup: "rounded-2xl",
                },
            });

            if (onSubmitSuccess) {
                onSubmitSuccess()
            }

        } catch (err: any) {
            console.error("Error al actualizar puesto:", err);
            setError(err.message || "Ocurrió un error al actualizar el puesto.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <PencilSquareIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Editar Puesto</h3>
                            <p className="text-xs text-gray-500">Red: {puesto.puesto_red}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Body / Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Teléfono
                        </label>
                        <input
                            type="text"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            placeholder="Ej: 4234-5678 o interno"
                            className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Descripción
                        </label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Ej: Puesto de atención administrativa"
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                        />
                    </div>

                    {/* Footer / Botones */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 rounded-lg transition shadow-xs cursor-pointer"
                        >
                            {loading ? "Guardando..." : "Guardar Cambios"}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}