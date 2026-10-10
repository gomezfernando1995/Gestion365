import { useState } from "react";
import { XMarkIcon, FolderPlusIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { insertSector } from "../services/sectorsServices";

interface ModalAltaSector {
    isOpen: boolean;
    onClose: () => void;
    idEstablecimiento?: number; // Para vincularlo al establecimiento actual
    onSubmitSuccess?: () => void; // Callback para recargar la lista de sectores
}

export function ModalAltaSector({ isOpen, onClose, idEstablecimiento }: ModalAltaSector) {
    const [nombre, setNombre] = useState("");
    const [ubicacion, setUbicacion] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nombre.trim()) {
            setError("El nombre del sector es obligatorio.");
            return;
        }

        setLoading(true);
        setError(null);

        try {

            if (!idEstablecimiento) {
                setError("El establecimiento es obligatorio.");
                return;
            }
            const id_establecimiento = idEstablecimiento;
            await insertSector({
                nombre,
                ubicacion, // Asegúrate de tener 'ubicacion' definida en tu estado
                id_establecimiento,
            });

            await Swal.fire({
                title: "¡Sector Guardado!",
                text: "Sector agregado correctamente.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
                customClass: {
                    popup: "rounded-2xl",
                },
            });

            // 3. Limpiar formulario y cerrar modal
            setNombre("");
            if (setDescripcion) setDescripcion("");
            onClose();

        } catch (err: any) {
            console.error("Error al crear sector:", err);
            setError(err.message || "Ocurrió un error al guardar el sector.");
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
                            <FolderPlusIcon className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Alta de Sector</h3>
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
                            Nombre del Sector <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej: Producción, Almacén, Mantenimiento"
                            className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Ubicacion del Sector <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={ubicacion}
                            onChange={(e) => setUbicacion(e.target.value)}
                            placeholder="Ej: Planta baja, Planta alta, zoom"
                            className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Descripción
                        </label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Descripción opcional del área o funciones del sector..."
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
                            {loading ? "Guardando..." : "Crear Sector"}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}