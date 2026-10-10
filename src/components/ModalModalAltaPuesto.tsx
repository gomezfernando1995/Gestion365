import { useState } from "react";
import { XMarkIcon, ComputerDesktopIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { insertStation } from "../services/stationsService";

interface SectorOption {
    id_sector: number;
    nombre: string;
}

interface ModalAltaPuestoProps {
    isOpen: boolean;
    onClose: () => void;
    idEstablecimiento?: number;
    sectores?: SectorOption[]; // Recibe la lista desde la vista padre
}

export function ModalAltaPuesto({ 
    isOpen, 
    onClose, 
    idEstablecimiento, 
    sectores = [], 
     
}: ModalAltaPuestoProps) {
    const [id_sector, setSector] = useState<string>("");
    const [puesto_red, setPuestoRed] = useState<string>("");
    const [telefono, setTel] = useState<string>("");
    const [descripcion, setDescripcion] = useState<string>("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!id_sector) {
            setError("Debe seleccionar un sector.");
            return;
        }

        if (!puesto_red.trim()) {
            setError("El nombre/código de puesto red es obligatorio.");
            return;
        }

        if (!idEstablecimiento) {
            setError("El establecimiento es obligatorio.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await insertStation({
                puesto_red,
                telefono,
                descripcion,
                id_sector: Number(id_sector),
            });

             // Limpiar campos
            setSector("");
            setPuestoRed("");
            setTel("");
            setDescripcion("");
            onClose();

            await Swal.fire({
                title: "¡Puesto Guardado!",
                text: "El puesto ha sido agregado correctamente.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
                customClass: {
                    popup: "rounded-2xl",
                },
            });

        } catch (err: any) {
            console.error("Error al crear puesto:", err);
            setError(err.message || "Ocurrió un error al guardar el puesto.");
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
                            <ComputerDesktopIcon className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Alta de Puesto</h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Selector de Sector */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Sector <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={id_sector}
                            onChange={(e) => setSector(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
                            required
                        >
                            <option value="">Seleccione un sector</option>
                            {sectores.map((sec) => (
                                <option key={sec.id_sector} value={sec.id_sector}>
                                    {sec.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Puesto Red */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Puesto / Nombre de Red <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={puesto_red}
                            onChange={(e) => setPuestoRed(e.target.value)}
                            placeholder="Ej: PST-ADM-01, Puesto Recepción"
                            className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            required
                        />
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Teléfono / Interno
                        </label>
                        <input
                            type="text"
                            value={telefono}
                            onChange={(e) => setTel(e.target.value)}
                            placeholder="Ej: Interno 104 / 11-2233-4455"
                            className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Descripción del Puesto
                        </label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Detalle de la función del puesto o tareas asociadas a esta estación..."
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                        />
                    </div>

                    {/* Footer */}
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
                            {loading ? "Guardando..." : "Crear Puesto"}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}