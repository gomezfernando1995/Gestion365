import { motion, AnimatePresence } from "framer-motion";
import type { Station } from "../services/stationsService";
import type { Equipment } from "../services/equipmentService";
import type { Sector } from "../services/sectorsServices";
import type { Incidente } from "../types/Incidente";
import { useEquipment } from "../hooks/useEquipment";
import { getCurrentUserLocalStorage } from "../utils/auth";
import { useEstablishment } from "../hooks/useEstablishment";
import { useState } from "react";

interface PanelEstablishmentProps {
    incidentsByEstablishment?: Incidente[];
    sectores?: Sector[];
    puestos?: Station[];
    equipos?: Equipment[];
    usersByEstablishment?: any[];
    navigate: (path: string) => void;
    formatFechaCustom: (fecha: string) => string;
    onSelectSector?: (sector: Sector) => void;
    activeTab?: string; // 👈 Asegúrate de que tenga el signo "?" aquí
    onTabChange?: (tab: string) => void;
}

export default function PanelEstablishment({
    incidentsByEstablishment = [],
    sectores = [],
    puestos = [],
    navigate,
    formatFechaCustom,
    activeTab = "Historial Incidentes", //,
    onSelectSector = () => {},  // 👈 Función vacía por defecto
    onTabChange = () => {},      // 👈 Función vacía por defecto
}: PanelEstablishmentProps) {
    const { equipments } = useEquipment();
    const [openSector, setOpenSector] = useState<number | null>(null);
    const [openPuesto, setOpenPuesto] = useState<number | null>(null);

    const safeIncidents = incidentsByEstablishment ?? [];
    const safeSectores = sectores ?? [];
    const safePuestos = puestos ?? [];
    const safeEquipos = equipments ?? [];
    const { usersByEstablishment } = useEstablishment();
    const safeUsers = usersByEstablishment ?? [];

    const userLocalStorage = getCurrentUserLocalStorage();
    const idRol = userLocalStorage?.idrol;
    const isAdmin = idRol === 6 || idRol === 13 || idRol === 2;

    return (
        <div className="bg-white shadow rounded-xl p-3 flex flex-col">
            {/* Tabs */}
            <div className="bg-gray-200 p-1 grid text-sm grid-cols-3 border-b rounded-xl border-gray-200">
                {["Historial Incidentes", "Sectores", "Usuarios"].map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => onTabChange(tab)}// 👈 3. Notificamos al padre el cambio
                        className={`py-2 text-center font-semibold flex items-center justify-center gap-2 rounded-lg transition-all duration-300 cursor-pointer ${
                            activeTab === tab
                                ? "bg-blue-500 text-white shadow-md"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                        {tab === "Historial Incidentes" ? `${tab} (${safeIncidents.length})` : tab}
                        {tab === "Usuarios" ? ` (${safeUsers.length})` : ""}
                    </button>
                ))}
            </div>

            {/* Contenido dinámico */}
            <div className="mt-3 overflow-y-auto flex flex-col mb-3 max-h-150">
                <AnimatePresence mode="wait">
                    {activeTab === "Historial Incidentes" && (
                        <motion.div
                            key="incidentes"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <header className="bg-gray-300 p-3 font-bold text-gray-500 flex items-center sticky top-0 w-full z-10 rounded-md mb-2">
                                <button
                                    type="button"
                                    className="bg-gray-100 p-2 hover:text-blue-600 rounded-lg text-sm transition"
                                >
                                    Filtrar incidentes
                                </button>
                            </header>

                            {safeIncidents.length === 0 ? (
                                <p className="p-4 text-center text-gray-500 text-sm">
                                    No hay incidentes registrados para este establecimiento.
                                </p>
                            ) : (
                                safeIncidents.map((inc) => (
                                    <motion.div
                                        key={inc.id_incidente}
                                        onClick={() => navigate(`/incidents/${inc.id_incidente}`)}
                                        className="p-2 flex justify-center bg-gray-100 shadow-sm rounded-md w-full cursor-pointer my-2"
                                        whileHover={{ scale: 1.01 }}
                                    >
                                        <div className="bg-white text-sm grid grid-cols-[15%_10%_30%_40%_5%] w-full items-center hover:bg-gray-50 transition rounded-md p-2">
                                            <div className="text-black text-base font-medium text-center">
                                                {formatFechaCustom(inc.fecha_inicio ?? "")}
                                            </div>
                                            <div className="text-center">
                                                <span className="text-gray-400 text-xs block">Id</span>
                                                <span className="font-bold text-gray-800">#{inc.id_incidente}</span>
                                            </div>
                                            <div className="text-center px-2">
                                                <span className="text-gray-400 text-xs block">Título</span>
                                                <p className="font-bold text-gray-800 truncate" title={inc.titulo}>
                                                    {inc.titulo}
                                                </p>
                                            </div>
                                            <div className="text-center px-2">
                                                <span className="text-gray-400 text-xs block">Establecimiento</span>
                                                <p className="font-bold text-gray-800 truncate">
                                                    {inc.establecimientos?.nombre ?? "Sin nombre"}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </motion.div>
                    )}

                    {activeTab === "Sectores" && (
                        <motion.div
                            key="sectores"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="p-1"
                        >
                            {safeSectores.length === 0 ? (
                                <p className="p-4 text-center text-gray-500 text-sm">
                                    No hay sectores configurados para este establecimiento.
                                </p>
                            ) : (
                                safeSectores.map((sector: any) => {
                                    const currentSectorId = sector.id_sector ?? sector.idSector;
                                    const puestosDelSector = safePuestos.filter((p: any) => {
                                        const pSectorId = p.id_sector ?? p.idSector ?? p.id_sectores;
                                        if (pSectorId === undefined || pSectorId === null) return false;
                                        return String(pSectorId) === String(currentSectorId);
                                    });

                                    return (
                                        <div key={currentSectorId} className="mb-3">
                                            <div className="w-full text-left font-bold text-md bg-gray-50 p-3 rounded-lg shadow-sm hover:bg-blue-50 transition flex justify-between items-center border border-gray-200">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setOpenSector(openSector === currentSectorId ? null : currentSectorId);

                                                        if (onSelectSector) {
                                                            onSelectSector({
                                                                ...sector,
                                                                puestos: puestosDelSector.map((puesto: any) => ({
                                                                    ...puesto,
                                                                    equipos: safeEquipos.filter(
                                                                        (e: any) =>
                                                                            Number(e.id_puesto ?? e.idPuesto) ===
                                                                            Number(puesto.id_puesto ?? puesto.idPuesto)
                                                                    ),
                                                                })),
                                                            });
                                                        }
                                                    }}
                                                    className="flex-1 text-left cursor-pointer"
                                                >
                                                    <span className="text-gray-800">{sector.nombre}</span>
                                                </button>

                                                <span className="text-xs bg-blue-100 text-blue-700 py-1 px-2.5 rounded-full font-semibold mr-2">
                                                    {puestosDelSector.length} Puestos
                                                </span>
                                            </div>

                                            <AnimatePresence>
                                                {openSector === currentSectorId && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="ml-4 mt-2 border-l-2 border-blue-200 pl-3 space-y-2"
                                                    >
                                                        {puestosDelSector.length === 0 ? (
                                                            <p className="text-xs text-gray-400 italic py-1">
                                                                Sin puestos asignados a este sector.
                                                            </p>
                                                        ) : (
                                                            puestosDelSector.map((puesto: any) => {
                                                                const currentPuestoId = puesto.id_puesto ?? puesto.idPuesto;
                                                                const equiposDelPuesto = safeEquipos.filter((e: any) => {
                                                                    const ePuestoId = e.id_puesto ?? e.idPuesto;
                                                                    return Number(ePuestoId) === Number(currentPuestoId);
                                                                });

                                                                return (
                                                                    <div key={currentPuestoId} className="bg-white p-2 rounded border border-gray-100 shadow-xs">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                setOpenPuesto(
                                                                                    openPuesto === currentPuestoId ? null : currentPuestoId
                                                                                )
                                                                            }
                                                                            className="w-full text-left font-semibold text-gray-700 flex justify-between items-center text-sm cursor-pointer"
                                                                        >
                                                                            <span>{puesto.descripcion || puesto.puestored || `Puesto #${currentPuestoId}`}</span>
                                                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                                                                {equiposDelPuesto.length} Equipos
                                                                            </span>
                                                                        </button>

                                                                        <AnimatePresence>
                                                                            {openPuesto === currentPuestoId && (
                                                                                <motion.ul
                                                                                    initial={{ opacity: 0, y: -5 }}
                                                                                    animate={{ opacity: 1, y: 0 }}
                                                                                    exit={{ opacity: 0, y: -5 }}
                                                                                    transition={{ duration: 0.2 }}
                                                                                    className="mt-2 ml-2 space-y-1 border-t pt-2"
                                                                                >
                                                                                    {equiposDelPuesto.length === 0 ? (
                                                                                        <li className="text-xs text-gray-400 italic">
                                                                                            Sin equipos registrados
                                                                                        </li>
                                                                                    ) : (
                                                                                        equiposDelPuesto.map((equipo: any) => {
                                                                                            const eqId = equipo.id_equipo ?? equipo.idEquipo;
                                                                                            return (
                                                                                                <li key={eqId} className="text-xs text-gray-600 bg-gray-50 p-1.5 rounded">
                                                                                                    <span className="font-bold">#{eqId}</span> {equipo.nombre} {equipo.marca ? `| ${equipo.marca}` : ""}
                                                                                                </li>
                                                                                            );
                                                                                        })
                                                                                    )}
                                                                                </motion.ul>
                                                                            )}
                                                                        </AnimatePresence>
                                                                    </div>
                                                                );
                                                            })
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })
                            )}
                        </motion.div>
                    )}

                    {activeTab === "Usuarios" && (
                        <motion.div
                            key="usuarios"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="p-1"
                        >
                            {safeUsers.length === 0 ? (
                                <p className="p-4 text-center text-gray-500 text-sm">
                                    No hay usuarios asignados a este establecimiento.
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {safeUsers.map((usuario: any) => {
                                        const userId = usuario.id_usuario || usuario.idusuario || usuario.id;
                                        return (
                                            <div
                                                key={userId}
                                                onClick={() => {
                                                    if (isAdmin && userId) {
                                                        navigate(`/users/${userId}`);
                                                    }
                                                }}
                                                className={`flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100 shadow-sm transition ${
                                                    isAdmin ? "cursor-pointer hover:bg-gray-100" : "cursor-default"
                                                }`}
                                            >
                                                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                                                    {usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : "U"}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="font-semibold text-gray-800 text-sm truncate">
                                                        {usuario.nombre} {usuario.apellido}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {usuario.email || usuario.correo}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}