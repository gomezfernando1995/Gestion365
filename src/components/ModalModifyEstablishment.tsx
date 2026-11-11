import { useState, useEffect } from "react";
import { XMarkIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { updateEstablishment } from "../services/establishmentService"; // 👈 Asegúrate de tener o importar tu servicio de actualización de establecimiento
import type { Establishment } from "../services/establishmentService";

interface ModalModifyEstablishmentProps {
    isOpen: boolean;
    onClose: () => void;
    establishment: Establishment | null;
    onSubmitSuccess?: () => void;
}

export function ModalModifyEstablishment({
    isOpen,
    onClose,
    establishment,
    onSubmitSuccess,
}: ModalModifyEstablishmentProps) {
    const [nombre, setNombre] = useState("");
    const [calle, setCalle] = useState("");
    const [altura, setAltura] = useState("");
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");
    const [cuit, setCuit] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [sitioweb, setSitioweb] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Precargar los datos cuando el modal se abre y recibe un establecimiento
    useEffect(() => {
        if (establishment) {
            setNombre(establishment.nombre || "");
            setCalle(establishment.calle || "");
            setAltura(establishment.altura || "");
            setTelefono(establishment.telefono || "");
            setCorreo(establishment.correo || "");
            setCuit(establishment.cuit || "");
            setDescripcion(establishment.descripcion || "");
            setSitioweb(establishment.sitioweb || "");
        }
    }, [establishment]);

    if (!isOpen || !establishment) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nombre.trim()) {
            setError("El nombre del establecimiento es obligatorio.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Llamada al servicio para actualizar el establecimiento
            await updateEstablishment(establishment.id_establecimiento!, {
                nombre,
                calle,
                altura,
                telefono,
                correo,
                cuit,
                descripcion,
                sitioweb,
                id_pais: establishment.id_pais,
                id_provincia: establishment.id_provincia,
                id_localidad: establishment.id_localidad,
                id_empresa: establishment.id_empresa,
            });

            onClose();
            await Swal.fire({
                title: "¡Establecimiento Actualizado!",
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
            console.error("Error al actualizar establecimiento:", err);
            setError(err.message || "Ocurrió un error al actualizar el establecimiento.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <PencilSquareIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Editar Establecimiento</h3>
                            <p className="text-xs text-gray-500">ID: #{establishment.id_establecimiento}</p>
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
                                Nombre <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Ej: Sucursal Central"
                                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                CUIT
                            </label>
                            <input
                                type="text"
                                value={cuit}
                                onChange={(e) => setCuit(e.target.value)}
                                placeholder="Ej: 30-12345678-9"
                                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                placeholder="Ej: contacto@sucursal.com"
                                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Teléfono
                            </label>
                            <input
                                type="text"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                placeholder="Ej: 1122334455"
                                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Calle
                            </label>
                            <input
                                type="text"
                                value={calle}
                                onChange={(e) => setCalle(e.target.value)}
                                placeholder="Ej: Av. Corrientes"
                                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Altura / Nro
                            </label>
                            <input
                                type="text"
                                value={altura}
                                onChange={(e) => setAltura(e.target.value)}
                                placeholder="Ej: 1234"
                                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Sitio Web
                        </label>
                        <input
                            type="text"
                            value={sitioweb}
                            onChange={(e) => setSitioweb(e.target.value)}
                            placeholder="Ej: https://www.misitio.com"
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
                            placeholder="Detalles adicionales del establecimiento..."
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