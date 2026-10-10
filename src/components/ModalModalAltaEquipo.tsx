import { useState } from "react";
import { XMarkIcon, ComputerDesktopIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { insertEquipment } from "../services/equipmentService";
import { useEquipment } from "../hooks/useEquipment";

interface PuestoOption {
    idPuesto: number;
    puestored?: string;
    descripcion?: string;
}

interface ModalAltaEquipoProps {
    isOpen: boolean;
    onClose: () => void;
    idEstablecimiento?: number;
    puestos?: PuestoOption[]; // Lista de puestos recibida desde la vista padre
    onSubmitSuccess?: () => void;
}

export function ModalAltaEquipo({
    isOpen,
    onClose,
    puestos = [],
    onSubmitSuccess
}: ModalAltaEquipoProps) {
    // Estados para las props requeridas en insert
    const [nombre, setNombre] = useState<string>("");
    const [marca, setMarca] = useState<string>("");
    const [modelo, setModelo] = useState<string>("");
    const [numero_serie, setNumeroSerie] = useState<string>("");
    const [descripcion, setDescripcion] = useState<string>("");
    const [id_puesto, setIdPuesto] = useState<string>("");
    const [id_tipo_equipo, setIdTipoEquipo] = useState<string>("");
    const [id_estado_equipo, setIdEstadoEquipo] = useState<string>("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Obtener estados y tipos de equipo desde tu hook personalizado
    const { estateEquipment, typeEquipment } = useEquipment();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validaciones básicas de campos obligatorios
        if (!nombre.trim()) {
            setError("El nombre del equipo es obligatorio.");
            return;
        }

        if (!id_puesto) {
            setError("Debe seleccionar un puesto.");
            return;
        }

        if (!id_tipo_equipo) {
            setError("Debe seleccionar un tipo de equipo.");
            return;
        }

        if (!id_estado_equipo) {
            setError("Debe seleccionar un estado para el equipo.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await insertEquipment({
                nombre,
                marca,
                modelo,
                numero_serie,
                descripcion,
                id_puesto: Number(id_puesto),
                id_tipo_equipo: Number(id_tipo_equipo),
                id_estado_equipo: Number(id_estado_equipo),
            });

            await Swal.fire({
                title: "¡Equipo Guardado!",
                text: "El equipo ha sido registrado correctamente.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
                customClass: {
                    popup: "rounded-2xl",
                },
            });

            // Limpiar formulario
            setNombre("");
            setMarca("");
            setModelo("");
            setNumeroSerie("");
            setDescripcion("");
            setIdPuesto("");
            setIdTipoEquipo("");
            setIdEstadoEquipo("");

            if (onSubmitSuccess) onSubmitSuccess();
            onClose();

        } catch (err: any) {
            console.error("Error al crear equipo:", err);
            setError(err.message || "Ocurrió un error al guardar el equipo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <ComputerDesktopIcon className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Alta de Equipo</h3>
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
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto grow">
                    {error && (
                        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Selector de Puesto */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Puesto Asignado <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={id_puesto}
                            onChange={(e) => setIdPuesto(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
                            required
                        >
                            <option value="">Seleccione un puesto</option>
                            {puestos.map((puesto: any) => (
                                <option key={puesto.id_puesto} value={puesto.id_puesto }>
                                    {`Puesto #${puesto.id_puesto} - ${puesto.descripcion}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Nombre del Equipo */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Nombre del Equipo <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej: PC-Desktop-01, Impresora Recepción"
                            className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            required
                        />
                    </div>

                    {/* Filas de Tipo y Estado de Equipo */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Tipo de Equipo <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={id_tipo_equipo}
                                onChange={(e) => setIdTipoEquipo(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
                                required
                            >
                                <option value="">Seleccione tipo</option>
                                {typeEquipment?.map((tipo: any) => (
                                    <option key={tipo.idTipoEquipo || tipo.id_tipo_equipo} value={tipo.idTipoEquipo || tipo.id_tipo_equipo}>
                                        {tipo.descripcion || tipo.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Estado del Equipo <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={id_estado_equipo}
                                onChange={(e) => setIdEstadoEquipo(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
                                required
                            >
                                <option value="">Seleccione estado</option>
                                {estateEquipment?.map((estado: any) => (
                                    <option key={estado.idEstadoEquipo || estado.id_estado_equipo} value={estado.idEstadoEquipo || estado.id_estado_equipo}>
                                        {estado.descripcion || estado.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Marca y Modelo */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Marca
                            </label>
                            <input
                                type="text"
                                value={marca}
                                onChange={(e) => setMarca(e.target.value)}
                                placeholder="Ej: HP, Dell, Lenovo"
                                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
                                placeholder="Ej: ProDesk 400 G6"
                                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>
                    </div>

                    {/* Número de Serie */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Número de Serie
                        </label>
                        <input
                            type="text"
                            value={numero_serie}
                            onChange={(e) => setNumeroSerie(e.target.value)}
                            placeholder="Ej: S/N: MXL123456"
                            className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Descripción / Observaciones
                        </label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Detalles sobre características específicas o estado físico del equipo..."
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
                            {loading ? "Guardando..." : "Crear Equipo"}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}