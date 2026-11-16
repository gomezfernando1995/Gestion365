import { useState, useMemo } from "react";
import {
    MagnifyingGlassIcon
} from "@heroicons/react/24/solid";
import { getCurrentUserLocalStorage } from "../utils/auth";
import { useIncidentes } from "../hooks/useIncidents";
import { useNavigate } from "react-router-dom";

export default function MyIncidents() {
    const [activeTab, setActiveTab] = useState<"asignados" | "creados" | "resueltos" | "todos">("asignados");
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const currentUser = getCurrentUserLocalStorage();
    const currentUserId = currentUser?.idusuario;

    const { incidents, incidentsByUser } = useIncidentes();

    const userIncidents = useMemo(() => {
        if (incidentsByUser && incidentsByUser.length > 0) {
            return incidentsByUser;
        }

        return incidents.filter(
            (inc) => inc.id_usuario_asignado === currentUserId || inc.id_usuario_reporta === currentUserId
        );
    }, [incidentsByUser, incidents, currentUserId]);

    const incidentesFiltrados = useMemo(() => {
        return userIncidents.filter((inc) => {
            const isAsignado = inc.id_usuario_asignado === currentUserId;
            const isCreado = inc.id_usuario_reporta === currentUserId;

            const estadoDesc = inc.estado_incidentes?.descripcion?.toLowerCase() || "";
            const isResuelto = estadoDesc.includes("resuelto") || estadoDesc.includes("cerrado") || estadoDesc.includes("cancelado");

            let cumpleTab = false;

            if (activeTab === "asignados") {
                cumpleTab = isAsignado;
            } else if (activeTab === "creados") {
                cumpleTab = isCreado;
            } else if (activeTab === "resueltos") {
                cumpleTab = isResuelto;
            } else if (activeTab === "todos") {
                cumpleTab = true;
            }

            if (!cumpleTab) return false;

            if (!searchTerm.trim()) return true;
            const term = searchTerm.toLowerCase();
            return (
                inc.id_incidente?.toString().includes(term) ||
                inc.titulo?.toLowerCase().includes(term) ||
                inc.descripcion?.toLowerCase().includes(term) ||
                inc.prioridad_incidentes?.descripcion?.toLowerCase().includes(term)
            );
        });
    }, [userIncidents, activeTab, searchTerm, currentUserId]);

    const getStatusColor = (status?: string) => {
        switch (status) {
            case "Abierto":
                return "bg-red-800 text-white";
            case "En Proceso":
                return "bg-amber-500 text-white";
            case "En análisis":
                return "bg-orange-500 text-white";
            case "Resuelto":
                return "bg-green-600 text-white";
            case "Cerrado":
                return "bg-gray-500 text-white";
            case "Cancelado":
                return "bg-gray-500 text-white";
            case "Pendiente de información":
                return "bg-gray-100 text-yellow-500";
            default:
                return "bg-gray-200 text-gray-700";
        }
    };

    const counts = useMemo(() => {
        return {
            asignados: userIncidents.filter(i => {
                //const estado = i.estado_incidentes?.descripcion?.toLowerCase() || "";
                // const isResuelto = estado.includes("resuelto") || estado.includes("cerrado") || estado.includes("cancelado");
                return i.id_usuario_asignado === currentUserId;
            }).length,
            creados: userIncidents.filter(i => i.id_usuario_reporta === currentUserId).length,
            resueltos: userIncidents.filter(i => {
                const estado = i.estado_incidentes?.descripcion?.toLowerCase() || "";
                return (estado.includes("resuelto") || estado.includes("cerrado") || estado.includes("cancelado"));
            }).length,
            todos: userIncidents.length
        };
    }, [userIncidents, currentUserId]);

    const averageCreated = useMemo((): number => {
        const todos = userIncidents.filter(inc =>
            inc.id_usuario_reporta === currentUserId
        ).length;
        if (todos === 0) return 0;

        const resueltosAsignados = userIncidents.filter(inc =>
            inc.id_usuario_reporta === currentUserId &&
            inc.id_usuario_asignado !== currentUserId &&
            inc.estado_incidentes?.descripcion?.toLowerCase().includes("resuelto")
        ).length;

        return Number(((resueltosAsignados / todos) * 100).toFixed(1));
    }, [userIncidents, currentUserId]);

    const averageAssing = useMemo((): number => {
        const todos = userIncidents.filter(inc =>
            inc.id_usuario_asignado === currentUserId
        ).length;

        const resueltosAsignados = userIncidents.filter(inc =>
            inc.id_usuario_asignado === currentUserId &&
            (inc.estado_incidentes?.descripcion?.toLowerCase().includes("resuelto") ||
                inc.estado_incidentes?.descripcion?.toLowerCase().includes("cerrado"))
        ).length;
        if (todos === 0 || resueltosAsignados === 0) return 0;

        return Number(((resueltosAsignados / todos) * 100).toFixed(1));
    }, [userIncidents, currentUserId]);

    return (
        <div className="flex flex-col xl:flex-row gap-4 p-4 bg-gray-100 min-h-screen text-sm">

            {/* Columna Principal (Listado y Pestañas) */}
            <div className="flex-1 space-y-4">

                {/* Cabecera de la Sección */}
                <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                        <h1 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                            MIS INCIDENTES
                        </h1>
                        <p className="text-xs text-gray-500">Gestión y seguimiento de tus tickets asignados y reportados</p>
                    </div>
                </div>

                {/* Pestañas de Navegación */}
                <div className="bg-white rounded-2xl shadow-sm p-2 grid grid-cols-2 sm:flex flex-wrap gap-2 border border-gray-100">
                    <button
                        onClick={() => setActiveTab("asignados")}
                        className={`flex-1 py-2 px-3 rounded-xl font-medium text-xs transition cursor-pointer text-center ${activeTab === "asignados" ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        Asignados ({counts.asignados})
                    </button>
                    <button
                        onClick={() => setActiveTab("creados")}
                        className={`flex-1 py-2 px-3 rounded-xl font-medium text-xs transition cursor-pointer text-center ${activeTab === "creados" ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        Creados ({counts.creados})
                    </button>
                    <button
                        onClick={() => setActiveTab("resueltos")}
                        className={`flex-1 py-2 px-3 rounded-xl font-medium text-xs transition cursor-pointer text-center ${activeTab === "resueltos" ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        Resueltos/Cerrados ({counts.resueltos})
                    </button>
                    <button
                        onClick={() => setActiveTab("todos")}
                        className={`flex-1 py-2 px-3 rounded-xl font-medium text-xs transition cursor-pointer text-center ${activeTab === "todos" ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        Todos ({counts.todos})
                    </button>
                </div>

                {/* Barra de Filtro, Búsqueda y Tabla */}
                <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
                    <div className="relative">
                        <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Filtrar por ticket, título, descripción o prioridad..."
                            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-150">
                            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                                <tr>
                                    <th className="p-3 text-center">Fecha</th>
                                    <th className="p-3 text-center">Ticket ID</th>
                                    <th className="p-3 text-center">Prioridad</th>
                                    <th className="p-3">Título</th>
                                    <th className="p-3 text-center">Creado por</th>
                                    <th className="p-3 text-center">Asignado a</th>
                                    <th className="p-3 text-center">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-xs">
                                {incidentesFiltrados.length > 0 ? (
                                    incidentesFiltrados.map((inc) => (
                                        <tr key={inc.id_incidente} onClick={() => navigate(`/incidents/${inc.id_incidente}`)} className="hover:bg-blue-50/50 transition-colors cursor-pointer">
                                            <td className="p-3 text-center text-gray-500">
                                                {inc.created_at ? new Date(inc.created_at).toLocaleDateString("es-AR", { day: '2-digit', month: 'short', year: '2-digit' }) : "—"}
                                            </td>
                                            <td className="p-3 text-center font-bold text-gray-700">#{inc.id_incidente}</td>
                                            <td className="p-3 text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${inc.prioridad_incidentes?.descripcion?.toLowerCase() === 'alta' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {inc.prioridad_incidentes?.descripcion || "Media"}
                                                </span>
                                            </td>
                                            <td className="p-3 font-medium text-gray-900">{inc.titulo || inc.descripcion}</td>
                                            <td className="p-3 text-center text-gray-700 font-medium flex items-center justify-center gap-1">
                                                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                                                    {inc.usuario_reporta?.nombre?.[0] || "U"}
                                                </span>
                                                {inc.usuario_reporta?.nombre || "Sistema"}
                                            </td>
                                            <td className="p-3 text-center text-gray-700 font-medium">
                                                {inc.usuario_asignado?.nombre || "Sin asignar"}
                                            </td>
                                            <td className="p-3 text-center">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-[10px] font-bold ${getStatusColor(inc.estado_incidentes?.descripcion)}`}
                                                >
                                                    {inc.estado_incidentes?.descripcion || "Registrado"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-gray-400 italic">
                                            No se encontraron incidentes registrados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Columna Derecha (Panel Lateral de Métricas y Accesos Rápidos) */}
            <div className="w-full xl:w-80 space-y-4">

                {/* Panel de Resumen de Tickets */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3">
                    <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                        Panel de Resumen de Tickets
                    </h2>
                    <div className="bg-gray-50 p-3 rounded-xl">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">TOTAL CREADOS</span>
                        <p className="text-2xl font-black text-blue-600">{counts.creados} <span className="text-xs font-normal text-gray-500">tickets</span></p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">TASA DE ÉXITO CREADOS</span>
                        <p className="text-2xl font-black text-green-600">{averageCreated}% </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">TOTAL ASIGNADOS</span>
                        <p className="text-2xl font-black text-blue-600">{counts.asignados} <span className="text-xs font-normal text-gray-500">tickets</span></p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">TASA DE ÉXITO ASIGNADOS</span>
                        <p className="text-2xl font-black text-green-600">{averageAssing}% </p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                    <div className="flex items-center justify-center gap-2 font-bold text-sm w-full border-b border-gray-100 pb-3">
                        <span className="text-gray-700 uppercase tracking-wider text-xs">Tiempos de SLA (Objetivos)</span>
                    </div>

                    <div className="space-y-2">
                        {[
                            { nombre: "Crítica", color: "text-red-700 bg-red-50/50 border-red-200", dot: "bg-red-600", resp: "15 min", resol: "4 hs" },
                            { nombre: "Urgente", color: "text-orange-700 bg-orange-50/50 border-orange-200", dot: "bg-orange-500", resp: "1 hora", resol: "8 hs" },
                            { nombre: "Media", color: "text-amber-700 bg-amber-50/50 border-amber-200", dot: "bg-amber-500", resp: "4 horas", resol: "24 hs" },
                            { nombre: "Baja", color: "text-blue-700 bg-blue-50/50 border-blue-200", dot: "bg-blue-500", resp: "8 horas", resol: "48 hs" },
                            { nombre: "Informativa", color: "text-gray-700 bg-gray-50 border-gray-200", dot: "bg-gray-400", resp: "Sin límite", resol: "Sin límite" },
                        ].map((item, idx) => (
                            <div key={idx} className={`p-2.5 rounded-xl border flex flex-col gap-1.5 ${item.color}`}>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-xs flex items-center gap-1.5">
                                        <span className={`w-2 h-2 rounded-full ${item.dot}`}></span>
                                        {item.nombre}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 text-[11px] gap-2 pt-1 border-t border-black/5">
                                    <div>
                                        <span className="opacity-70">Resp: </span>
                                        <strong className="font-semibold">{item.resp}</strong>
                                    </div>
                                    <div>
                                        <span className="opacity-70">Resol: </span>
                                        <strong className="font-semibold">{item.resol}</strong>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

            </div>

        </div>
    );
}