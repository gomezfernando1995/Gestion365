import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Station } from "../services/stationsService";
import type { Equipment } from "../services/equipmentService";
import type { Sector } from "../services/sectorsServices";
import type { Incidente } from "../types/Incidente";
import { useEstablishment } from "../hooks/useEstablishment";
import { useEquipment } from "../hooks/useEquipment";

interface PanelEstablishmentProps {
    incidentsByEstablishment?: Incidente[];
    sectores?: Sector[];
    puestos?: Station[];
    equipos?: Equipment[];
    navigate: (path: string) => void;
    formatFechaCustom: (fecha: string) => string;
}

export default function PanelEstablishment({
    incidentsByEstablishment = [],
    sectores = [],
    puestos = [],
    
    navigate,
    formatFechaCustom,
}: PanelEstablishmentProps) {
    const [activeTab, setActiveTab] = useState<string>("Historial Incidentes");
    const [openSector, setOpenSector] = useState<number | null>(null);
    const [openPuesto, setOpenPuesto] = useState<number | null>(null);
    const { equipments } = useEquipment();


    // Asegurar que las listas siempre sean arreglos iterables
    const safeIncidents = incidentsByEstablishment ?? [];
    const safeSectores = sectores ?? [];
    const safePuestos = puestos ?? [];
    const safeEquipos = equipments ?? [];
    const { usersByEstablishment } = useEstablishment();
    const userLocalStorage = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const isAdmin = userLocalStorage.idrol === 6 || userLocalStorage.idrol === 13 || userLocalStorage.idrol === 2;

    return (
        <div className="bg-white shadow rounded-xl p-3 flex flex-col">
            {/* Tabs */}
            <div className="bg-gray-200 p-1 grid text-sm grid-cols-3 border-b rounded-xl border-gray-200">
                {["Historial Incidentes", "Sectores", "Usuarios"].map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`py-2 text-center font-semibold flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ${activeTab === tab
                            ? "bg-blue-500 text-white shadow-md"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        {tab === "Historial Incidentes" ? `${tab}-${safeIncidents.length}` : tab}
                    </button>
                ))}
            </div>

            {/* Contenido dinámico */}
            <div className="mt-3 overflow-y-auto flex flex-col mb-3">
                <AnimatePresence mode="wait">
                    {activeTab === "Historial Incidentes" && (
                        <motion.div
                            key="incidentes"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <header className="bg-gray-300 p-3 font-bold text-gray-500 flex items-center sticky top-0 w-full z-10">
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
                                        className="p-3 flex justify-center bg-gray-200 shadow rounded-md w-full cursor-pointer my-2"
                                        whileHover={{ scale: 1.01 }}
                                    >
                                        <div className="bg-white text-sm grid grid-cols-[15%_10%_30%_40%_5%] w-[95%] max-w-5xl h-21 place-items-center hover:bg-gray-100 mx-auto transition rounded-md p-2">
                                            <div className="text-black text-lg text-center">
                                                {formatFechaCustom(inc.fecha_inicio ?? "")}
                                            </div>
                                            <div className="text-center">
                                                <span className="text-gray-500 text-xs">Id</span>
                                                <p className="font-black text-base">#{inc.id_incidente}</p>
                                            </div>
                                            <div className="text-center">
                                                <span className="text-gray-500 text-xs">Título</span>
                                                <p className="font-black text-base truncate max-w-45">
                                                    {inc.titulo}
                                                </p>
                                            </div>
                                            <div className="text-center">
                                                <span className="text-gray-500 text-xs">Establecimiento</span>
                                                <p className="font-black text-base truncate max-w-50">
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
                            className="p-3"
                        >
                            {safeSectores.length === 0 ? (
                                <p className="p-4 text-center text-gray-500 text-sm">
                                    No hay sectores configurados para este establecimiento.
                                </p>
                            ) : (
                                safeSectores.map((sector: any) => {
                                    const currentSectorId = sector.id_sector ?? sector.idSector;

                                    // 1. Filtrar los puestos de este sector (compatible id_sector / idSector)
                                    const puestosDelSector = safePuestos.filter((p: any) => {
                                        const pSectorId = p.id_sector ?? p.idSector ?? p.id_sectores; // verificar también plurales o aliases
                                        if (pSectorId === undefined || pSectorId === null) return false;
                                        return String(pSectorId) === String(currentSectorId);
                                    });

                                    return (
                                        <div key={currentSectorId} className="mb-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setOpenSector(openSector === currentSectorId ? null : currentSectorId)
                                                }
                                                className="w-full text-left font-bold text-lg bg-gray-50 p-3 rounded shadow hover:bg-blue-50 transition flex justify-between items-center"
                                            >
                                                <span>{sector.nombre}</span>
                                                <span className="text-xs text-gray-400">
                                                    {puestosDelSector.length} Puestos
                                                </span>
                                            </button>

                                            <AnimatePresence>
                                                {openSector === currentSectorId && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="ml-6 mt-2 border-l-2 border-blue-200 pl-3"
                                                    >
                                                        {puestosDelSector.length === 0 ? (
                                                            <p className="text-xs text-gray-400 italic py-1">
                                                                Sin puestos asignados a este sector.
                                                            </p>
                                                        ) : (
                                                            puestosDelSector.map((puesto: any) => {
                                                                const currentPuestoId = puesto.id_puesto;
                                                                const equiposDelPuesto = safeEquipos.filter((e: any) => {
                                                                    const ePuestoId = e.id_puesto ?? e.idPuesto;
                                                                    return Number(ePuestoId) === Number(currentPuestoId);
                                                                });

                                                                return (
                                                                    <div key={currentPuestoId} className="mb-2">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                setOpenPuesto(
                                                                                    openPuesto === currentPuestoId ? null : currentPuestoId
                                                                                )
                                                                            }
                                                                            className="w-full text-left font-semibold text-gray-700 bg-gray-100 p-2 rounded hover:bg-blue-100 transition flex justify-between items-center text-sm"
                                                                        >
                                                                            <span>{puesto.descripcion || puesto.puestored || `Puesto #${currentPuestoId}`}</span>
                                                                            <span className="text-xs text-gray-400">
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
                                                                                    className="ml-6 mt-1 list-disc text-sm text-gray-600 space-y-1"
                                                                                >
                                                                                    {equiposDelPuesto.length === 0 ? (
                                                                                        <li className="list-none text-xs text-gray-400 italic">
                                                                                            Sin equipos registrados
                                                                                        </li>
                                                                                    ) : (
                                                                                        equiposDelPuesto.map((equipo: any) => {
                                                                                            const eqId = equipo.id_equipo ?? equipo.idEquipo;
                                                                                            return (
                                                                                                <li key={eqId}>
                                                                                                    #{eqId} | {equipo.nombre} {equipo.marca ? `| ${equipo.marca}` : ""} {equipo.modelo ? `| ${equipo.modelo}` : ""} {equipo.numero_serie ? `| S/N: ${equipo.numero_serie}` : ""}
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
                            className="p-3 text-gray-600 text-sm"
                        >
                            {usersByEstablishment.length === 0 ? (
                                <p className="p-4 text-center text-gray-500 text-sm">
                                    No hay usuarios asignados a este establecimiento.
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {usersByEstablishment.map((usuario: any) => (
                                        <div
                                            key={usuario.id_usuario || usuario.idusuario || usuario.id}
                                            onClick={() => {
                                                if (isAdmin) {
                                                    navigate(`/users/${usuario.idusuario || usuario.id_usuario || usuario.id}`);
                                                }
                                            }}
                                            className={`flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100 shadow-sm transition ${isAdmin ? "cursor-pointer hover:bg-gray-100" : "cursor-default"
                                                }`}
                                        >
                                            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                {usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : "U"}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 text-sm">
                                                    {usuario.nombre} {usuario.apellido}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {usuario.email || usuario.correo}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}