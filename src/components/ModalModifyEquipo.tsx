import { useState, useEffect } from "react";
import { XMarkIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { updateEquipment, type Equipment } from "../services/equipmentService";
import { useEquipment } from "../hooks/useEquipment";

interface OptionItem {
    id: number;
    descripcion: string;
}

interface ModalModifyEquipoProps {
    isOpen: boolean;
    onClose: () => void;
    equipo: Equipment | null;
    onSubmitSuccess?: () => void;
    tiposEquipo?: OptionItem[];
    estadosEquipo?: OptionItem[];
}

export function ModalModifyEquipo({
    isOpen,
    onClose,
    equipo,
    onSubmitSuccess,
}: ModalModifyEquipoProps) {
    // 1. LLAMAMOS AL HOOK ANTES DE CUALQUIER CONDICIONAL (Regla de React)
    const { typeEquipment } = useEquipment();

    const [nombre, setNombre] = useState("");
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [numeroSerie, setNumeroSerie] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [idTipoEquipo, setIdTipoEquipo] = useState<number | "">("");
    const [idEstadoEquipo, setIdEstadoEquipo] = useState<number | "">("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const estadosList = [
        { id: 1, descripcion: "Activo" },
        { id: 2, descripcion: "En reparación" },
        { id: 3, descripcion: "Fuera de servicio" },
        { id: 5, descripcion: "En garantía" },
        { id: 7, descripcion: "Asignado a usuario" },
        { id: 8, descripcion: "En stock" },
        { id: 9, descripcion: "Obsoleto" },
        { id: 10, descripcion: "Pendiente de revisión" },
    ];

    // Precargar los datos cuando el modal se abre y recibe un equipo
    useEffect(() => {
        if (equipo) {
            setNombre(equipo.nombre || "");
            setMarca(equipo.marca || "");
            setModelo(equipo.modelo || "");
            setNumeroSerie(equipo.numero_serie || "");
            setDescripcion(equipo.descripcion || "");
            setIdTipoEquipo(equipo.id_tipo_equipo || "");
            setIdEstadoEquipo(equipo.id_estado_equipo || "");
        }
    }, [equipo]);

    // 2. LA CONDICIONAL DE SALIDA VA DESPUÉS DE LOS HOOKS
    if (!isOpen || !equipo) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nombre.trim()) {
            setError("El nombre del equipo es obligatorio.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Ejemplo de llamada a tu servicio:
            await updateEquipment(equipo.id_equipo, {
                nombre,
                marca,
                modelo,
                numero_serie: numeroSerie,
                descripcion,
                id_tipo_equipo: Number(idTipoEquipo),
                id_estado_equipo: Number(idEstadoEquipo),
                updated_at: new Date().toISOString(),
            });

            onClose();
            await Swal.fire({
                title: "¡Equipo Actualizado!",
                text: "Los cambios se guardaron correctamente.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
                customClass: {
                    popup: "rounded-2xl",
                },
            });

            if (onSubmitSuccess) {
                onSubmitSuccess();
            }

        } catch (err: any) {
            console.error("Error al actualizar equipo:", err);
            setError(err.message || "Ocurrió un error al actualizar el equipo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <PencilSquareIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Editar Equipo</h3>
                            <p className="text-xs text-gray-500">ID: #{equipo.id_equipo}</p>
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
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    {error && (
                        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Nombre del Equipo <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Ej: PC Oficina 01"
                                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Número de Serie
                            </label>
                            <input
                                type="text"
                                value={numeroSerie}
                                onChange={(e) => setNumeroSerie(e.target.value)}
                                placeholder="Ej: SN-987654321"
                                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Marca
                            </label>
                            <input
                                type="text"
                                value={marca}
                                onChange={(e) => setMarca(e.target.value)}
                                placeholder="Ej: Dell, HP"
                                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Modelo
                            </label>
                            <input
                                type="text"
                                value={modelo}
                                onChange={(e) => setModelo(e.target.value)}
                                placeholder="Ej: OptiPlex 3080"
                                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>
                    </div>

                    {/* Selectores de Tipo y Estado */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Tipo de Equipo
                            </label>
                            <select
                                value={idTipoEquipo}
                                onChange={(e) => setIdTipoEquipo(Number(e.target.value))}
                                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            >
                                <option value="">Seleccione tipo...</option>
                                {typeEquipment?.map((tipo: any) => (
                                    <option key={tipo.id_tipo_equipo || tipo.id} value={tipo.id_tipo_equipo || tipo.id}>
                                        {tipo.descripcion}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Estado del Equipo
                            </label>
                            <select
                                value={idEstadoEquipo}
                                onChange={(e) => setIdEstadoEquipo(Number(e.target.value))}
                                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            >
                                <option value="">Seleccione estado...</option>
                                {estadosList.map((estado) => (
                                    <option key={estado.id} value={estado.id}>
                                        {estado.descripcion}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Descripción
                        </label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Detalles adicionales del equipo..."
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