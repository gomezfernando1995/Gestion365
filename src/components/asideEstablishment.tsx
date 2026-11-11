import React from "react";
import {
    PencilSquareIcon,
    ChevronRightIcon,
    ComputerDesktopIcon,
    CheckCircleIcon,
    InboxIcon,
    UserGroupIcon,
    UserIcon,
    WrenchScrewdriverIcon,
    ExclamationTriangleIcon,
    XCircleIcon,
    ShieldCheckIcon,
    CubeIcon,
    ArchiveBoxIcon,
    ClockIcon,
} from "@heroicons/react/24/outline";
import { getCurrentUserLocalStorage } from "../utils/auth";
import { textOrganic } from "../utils/textFormat";
import type { Equipment } from "../services/equipmentService";
import type { Sector } from "../services/sectorsServices";
import type { Station } from "../services/stationsService";

interface AsideEstablishmentDetailProps {
    activeTab?: string;
    selectedSector: Sector | null;
    selectedUser?: any | null;
    incidents?: any[];
    users?: any[];
    onEditSector?: (sector: Sector) => void;
    onEditPuesto?: (puesto: Station) => void;
    onEditEquipo?: (equipo: Equipment) => void;
    onSelectEquipo?: (equipo: Equipment) => void;
}

export function getEstadoConfig(idEstado: number) {
    switch (idEstado) {
        case 1: // Activo
            return {
                texto: "Activo",
                color: "text-green-600 bg-green-50 border-green-200",
                icon: <CheckCircleIcon className="w-3.5 h-3.5 text-green-500 shrink-0" />
            };
        case 2: // En reparación
            return {
                texto: "En reparación",
                color: "text-amber-600 bg-amber-50 border-amber-200",
                icon: <WrenchScrewdriverIcon className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            };
        case 3: // Fuera de servicio
            return {
                texto: "Fuera de servicio",
                color: "text-red-600 bg-red-50 border-red-200",
                icon: <ExclamationTriangleIcon className="w-3.5 h-3.5 text-red-500 shrink-0" />
            };
        case 4: // Baja definitiva
            return {
                texto: "Baja definitiva",
                color: "text-gray-500 bg-gray-100 border-gray-300",
                icon: <XCircleIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            };
        case 5: // En garantía
            return {
                texto: "En garantía",
                color: "text-blue-600 bg-blue-50 border-blue-200",
                icon: <ShieldCheckIcon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            };
        case 7: // Asignado a usuario
            return {
                texto: "Asignado a usuario",
                color: "text-indigo-600 bg-indigo-50 border-indigo-200",
                icon: <UserIcon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            };
        case 8: // En stock
            return {
                texto: "En stock",
                color: "text-teal-600 bg-teal-50 border-teal-200",
                icon: <CubeIcon className="w-3.5 h-3.5 text-teal-500 shrink-0" />
            };
        case 9: // Obsoleto
            return {
                texto: "Obsoleto",
                color: "text-purple-600 bg-purple-50 border-purple-200",
                icon: <ArchiveBoxIcon className="w-3.5 h-3.5 text-purple-500 shrink-0" />
            };
        case 10: // Pendiente de revisión
            return {
                texto: "Pendiente de revisión",
                color: "text-orange-600 bg-orange-50 border-orange-200",
                icon: <ClockIcon className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            };
        default:
            return {
                texto: "Desconocido",
                color: "text-gray-500 bg-gray-50 border-gray-200",
                icon: <ClockIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            };
    }
}

export const AsideEstablishmentDetail: React.FC<AsideEstablishmentDetailProps> = ({
    activeTab = "Historial Incidentes",
    selectedSector,
    incidents = [],
    users = [],
    onEditSector,
    onEditPuesto,
    onEditEquipo,
    onSelectEquipo,
}) => {
    const userLocalStorage = getCurrentUserLocalStorage();
    const idRol = userLocalStorage?.idrol;
    const isAdmin = idRol === 6 || idRol === 13 || idRol === 2;

    // =========================================================
    // 1. VISTA CUANDO LA PESTAÑA ES "Historial Incidentes"
    // =========================================================
    if (activeTab === "Historial Incidentes") {
        return (
            <aside className="col-span-12 lg:col-span-3 bg-white shadow-md rounded-2xl p-4 h-[85vh] flex flex-col space-y-4 overflow-y-auto">
                <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                        <InboxIcon className="w-5 h-5 text-blue-600" />
                        Historial de Incidentes
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">Resumen general del establecimiento</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                    <span className="text-xs font-bold text-gray-500 uppercase">Total Reportados</span>
                    <p className="text-2xl font-black text-blue-600">{incidents.length} tickets</p>
                </div>
            </aside>
        );
    }

    // =========================================================
    // 2. VISTA CUANDO LA PESTAÑA ES "Usuarios"
    // =========================================================
    if (activeTab === "Usuarios") {
        return (
            <aside className="col-span-12 lg:col-span-3 bg-white shadow-md rounded-2xl p-4 h-[85vh] flex flex-col space-y-4 overflow-y-auto">
                <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                        <UserGroupIcon className="w-5 h-5 text-blue-600" />
                        Personal Vinculado
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">Gestión de usuarios de la sede</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                    <span className="text-xs font-bold text-gray-500 uppercase">Usuarios Activos</span>
                    <p className="text-2xl font-black text-blue-600">{users.length} usuarios</p>
                </div>
            </aside>
        );
    }

    // =========================================================
    // 3. VISTA CUANDO LA PESTAÑA ES "Sectores"
    // =========================================================
    if (!selectedSector) {
        return (
            <aside className="col-span-12 lg:col-span-3 bg-white shadow rounded-2xl p-6 h-[85vh] flex flex-col justify-center items-center text-center text-gray-400">
                <ComputerDesktopIcon className="w-12 h-12 mb-2 text-gray-300" />
                <p className="text-sm font-medium text-gray-500">
                    Selecciona un sector para ver su detalle completo y equipamiento.
                </p>
            </aside>
        );
    }

    // Cálculos de resumen para el sector seleccionado
    const totalPuestos = selectedSector.puestos?.length || 0;
    const totalEquipos = selectedSector.puestos?.reduce((acc, p) => acc + (p.equipos?.length || 0), 0) || 0;

    return (
        <aside className="col-span-12 lg:col-span-3 bg-white shadow-md rounded-2xl p-4 h-[85vh] flex flex-col min-h-0 min-w-0 overflow-y-auto text-gray-800 space-y-5">
            {/* HEADER DETALLE SECTOR */}
            <div className="border-b border-gray-100 pb-3">
                <div className="flex items-start justify-between gap-2">
                    <h2 className="text-base font-extrabold text-gray-900 leading-tight">
                        <span className="text-blue-600">{selectedSector.nombre}</span>
                    </h2>
                    <div className="flex items-center gap-1 shrink-0">
                        {onEditSector && isAdmin && (
                            <button
                                onClick={() => onEditSector(selectedSector)}
                                className="p-1 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition"
                                title="Editar Sector"
                            >
                                <PencilSquareIcon className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Badges de Totales */}
                <div className="flex items-center justify-end gap-2 mt-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                        {totalEquipos} Equipos
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        {totalPuestos} Puestos
                    </span>
                </div>
            </div>

            {/* SECCIÓN 1: INFORMACIÓN GENERAL */}
            <section className="space-y-3">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    1. Información General
                </h3>
                <div className="bg-gray-50/70 p-3 rounded-xl space-y-2 border border-gray-100 text-xs">
                    <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                            <span className="text-gray-400 font-medium block">Id Sector</span>
                            <p className="font-semibold text-gray-800">
                                #{selectedSector.id_sector}
                            </p>
                        </div>
                        <div>
                            <span className="text-gray-400 font-medium block">Ubicacion</span>
                            <p className="font-semibold text-gray-800">
                                {selectedSector.ubicacion || "Sin ubicación"}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECCIÓN 2: PUESTOS Y EQUIPAMIENTO EN CASCADA */}
            <section className="space-y-3 grow">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    2. Puestos de Trabajo
                </h3>

                {(!selectedSector.puestos || selectedSector.puestos.length === 0) ? (
                    <p className="text-xs text-gray-400 italic">No hay puestos registrados en este sector.</p>
                ) : (
                    <div className="space-y-3">
                        {selectedSector.puestos.map((puesto) => (
                            <div
                                key={puesto.id_puesto}
                                className="bg-gray-50/60 border border-gray-200/80 rounded-xl p-3 space-y-3"
                            >
                                {/* Header Puesto */}
                                <div className="flex items-center justify-between pb-1 border-b border-gray-200/60">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                                        <h4 className="text-xs font-bold text-gray-800 truncate">
                                            {`Puesto #${puesto.id_puesto} - ${textOrganic(puesto.descripcion || '')}`}
                                        </h4>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        {onEditPuesto && isAdmin && (
                                            <button
                                                onClick={() => onEditPuesto(puesto)}
                                                className="p-1 text-gray-400 hover:text-blue-600 rounded"
                                            >
                                                <PencilSquareIcon className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Equipos en Cascada dentro del Puesto */}
                                {(!puesto.equipos || puesto.equipos.length === 0) ? (
                                    <p className="text-[11px] text-gray-400 italic pl-2">Sin equipos asignados</p>
                                ) : (
                                    <div className="space-y-2 pl-1">
                                        {puesto.equipos.map((equipo: Equipment) => {
                                            const estadoInfo = getEstadoConfig(equipo.id_estado_equipo);

                                            return (
                                                <div
                                                    key={equipo.id_equipo}
                                                    onClick={() => onSelectEquipo && onSelectEquipo(equipo)}
                                                    className="bg-white border border-gray-200 rounded-lg p-2.5 shadow-2xs space-y-1.5 cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all"                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-1.5">
                                                            <ComputerDesktopIcon className="w-4 h-4 text-gray-700" />
                                                            <span className="text-xs font-semibold text-gray-900">
                                                                {equipo.id_equipo} - {equipo.nombre || "PC y Periféricos"}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            {onEditEquipo && isAdmin && (
                                                                <button
                                                                    onClick={() => onEditEquipo(equipo)}
                                                                    className="p-0.5 text-gray-400 hover:text-blue-600"
                                                                >
                                                                    <PencilSquareIcon className="w-3 h-3" />
                                                                </button>
                                                            )}

                                                        </div>
                                                    </div>

                                                    {/* Detalle de componentes/características */}
                                                    <div className="pl-2 border-l-2 border-gray-100 space-y-1 text-[11px] text-gray-600">
                                                        <div className="flex items-center gap-1">
                                                            <ChevronRightIcon className="w-3 h-3 text-gray-400" />
                                                            <span>{`${equipo.marca || ""} ${equipo.modelo || ""}`}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <ChevronRightIcon className="w-3 h-3 text-gray-400" />
                                                            <span>{equipo.tipo_equipos?.descripcion || "Genérico"}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <ChevronRightIcon className="w-3 h-3 text-gray-400" />
                                                            <span>Serie: {equipo.numero_serie || "S/N"}</span>
                                                        </div>
                                                        {/* Estado dinámico con icono */}
                                                        <div className={`flex items-center gap-1 font-medium pt-0.5 ${estadoInfo.color.split(' ')[0]}`}>
                                                            {estadoInfo.icon}
                                                            <span>{estadoInfo.texto}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </aside>
    );
};