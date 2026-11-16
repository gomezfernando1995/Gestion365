import { useState, useEffect } from "react";
import { XMarkIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { updateUser } from "../services/usersService";

interface ModalModifyUserProps {
    isOpen: boolean;
    onClose: () => void;
    user: (any) | null;
    onSubmitSuccess?: () => void;
}

export function ModalModifyUser({
    isOpen,
    onClose,
    user,
    onSubmitSuccess,
}: ModalModifyUserProps) {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [celular, setCelular] = useState("");
    const [correo, setCorreo] = useState("");
    const [genero, setGenero] = useState("");
    const [descripcion, setDescripcion] = useState("");

    // Campos descriptivos para los inputs de texto
    const [estadousuario, setEstadoUsuario] = useState("");
    const [rol, setRol] = useState("");
    const [direccion, setDireccion] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Precargar los datos cuando el modal se abre y recibe un usuario
    useEffect(() => {
        if (user) {
            setNombre(user.nombre || "");
            setApellido(user.apellido || "");
            setCorreo(user.correo || "");
            setEstadoUsuario(user.estado_usuarios?.descripcion || "");
            setRol(user.roles?.nombre || "");
            setGenero(user.genero || "");
            setCelular(user.celular || "");
            setDireccion(user.direccion || "");
        }
    }, [user]);

    if (!isOpen || !user) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nombre.trim()) {
            setError("El nombre del usuario es obligatorio.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Usamos idusuario que es el nombre real de la columna en tu tabla de Supabase
            const userId = user.idusuario;
            await updateUser(userId!, {
                nombre,
                apellido,
                celular,
                genero,
                correo,
                direccion,
                idestadousuario: user.idestadousuario,
                idrol: user.idrol,
            });

            onClose();
            await Swal.fire({
                title: "¡Usuario Actualizado!",
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
            console.error("Error al actualizar usuario:", err);
            setError(err.message || "Ocurrió un error al actualizar el usuario.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <PencilSquareIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Editar Usuario</h3>
                            <p className="text-xs text-gray-500">ID: #{user.idusuario || user.idusuario || "N/A"}</p>
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
                                placeholder="Ej: Juan"
                                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Apellido
                            </label>
                            <input
                                type="text"
                                value={apellido}
                                onChange={(e) => setApellido(e.target.value)}
                                placeholder="Ej: Pérez"
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
                                placeholder="Ej: juan.perez@email.com"
                                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Teléfono
                            </label>
                            <input
                                type="text"
                                value={celular}
                                onChange={(e) => setCelular(e.target.value)}
                                placeholder="Ej: 1122334455"
                                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Sexo
                            </label>
                            <select
                                value={genero}
                                onChange={(e) => setGenero(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer"
                            >
                                <option value="" disabled>Seleccione una opción</option>
                                <option value="Hombre">Hombre</option>
                                <option value="Mujer">Mujer</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Rol
                            </label>
                            <input
                                type="text"
                                value={rol}
                                onChange={(e) => setRol(e.target.value)}
                                placeholder="Ej: Administrador"
                                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                disabled
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Estado de Usuario
                            </label>
                            <input
                                type="text"
                                value={estadousuario}
                                onChange={(e) => setEstadoUsuario(e.target.value)}
                                placeholder="Ej: Activo"
                                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                disabled
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Dirección
                            </label>
                            <input
                                type="text"
                                value={direccion}
                                onChange={(e) => setDireccion(e.target.value)}
                                placeholder="Ej: Av. Corrientes 1234"
                                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                    </div>


                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Descripción / Observaciones
                        </label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Detalles adicionales del usuario..."
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