import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, HomeModernIcon, PlusIcon } from "@heroicons/react/24/outline";


import Loader from "../components/Loader";
import { firstLetter, formatFechaCustom, textOrganic } from "../utils/textFormat";
import React, { useState } from "react";
import { useEstablishment } from "../hooks/useEstablishment";
import PaneEstablishment from "../components/paneEstablishment";
import { ModalAltaSector } from "../components/ModalModalAltaSector";
import { ModalAltaPuesto } from "../components/ModalModalAltaPuesto";
import { ModalAltaEquipo } from "../components/ModalModalAltaEquipo";

export default function EstablishmentDetails() {
    const navigate = useNavigate();
    const userLocalStorage = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const isAdmin = userLocalStorage.idrol === 6 || userLocalStorage.idrol === 13 || userLocalStorage.idrol === 2;
    const [openModalSector, setOpenSector] = useState(false);
    const [openModalPuesto, setOpenModalPuesto] = useState(false);
    const [openModalEquipo, setOpenModalEquipo] = useState(false);

    const { id } = useParams();
    const { oneEstablishment, loading, usersByEstablishment, incidentsByEstablishment, sectorsByEstablishment, stationBySector, equipmentsByStation } = useEstablishment();


    if (loading) return <Loader
        text="Cargando establecimiento..."
        url="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3ZTNubTY3eWR5dXN3bjhxZzM1dnBoMTlwcWN3M2ptdW1uZjd1NnRkcCZlcD12MV9zdGlja2Vyc19yZWxhdGVkJmN0PXM/vJy5yiq5VFtAi85Zg7/giphy.gif"
    />;

    return (
        <div className="flex flex-col h-screen w-full p-2 animate-fadeIn gap-3 rounded bg-gray-100 text-gray-900">
            {/* Navbar */}
            <nav className="w-full bg-white border-b border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center justify-between p-3 sm:p-4 gap-2">

                    {/* Izquierda: Botón de volver + Ícono y Nombre */}
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        {isAdmin && (
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                aria-label="Volver atrás"
                                className="p-1.5 text-gray-500 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-100 cursor-pointer shrink-0"
                            >
                                <ArrowLeftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                            </button>
                        )}

                        <div className="flex items-center gap-2 min-w-0">
                            <HomeModernIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 shrink-0" />
                            <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight truncate">
                                {oneEstablishment?.nombre}
                            </h2>
                        </div>
                    </div>

                    {/* Derecha: Acciones Rápidas Directas */}
                    {isAdmin && (
                        <div className="flex items-center  bg-gray-100 p-1 rounded-xl shrink-0 mr-10">
                            <button
                                type="button"
                                onClick={() => setOpenSector(true)}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-white hover:text-green-700 hover:shadow-xs transition cursor-pointer"
                                title="Alta Sector"
                            >
                                <PlusIcon className="w-4 h-4 text-green-600" />
                                <span>Sector</span>
                            </button>

                            <div className="w-px h-4 bg-gray-300 mx-0.5" />

                            <button
                                type="button"
                                onClick={() => setOpenModalPuesto(true)}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-white hover:text-green-700 hover:shadow-xs transition cursor-pointer"
                                title="Alta Puesto"
                            >
                                <PlusIcon className="w-4 h-4 text-green-600" />
                                <span>Puesto</span>
                            </button>

                            <div className="w-px h-4 bg-gray-300 mx-0.5" />

                            <button
                                type="button"
                                onClick={() => setOpenModalEquipo(true)}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-white hover:text-green-700 hover:shadow-xs transition cursor-pointer"
                                title="Alta Equipo"
                            >
                                <PlusIcon className="w-4 h-4 text-green-600" />
                                <span>Equipo</span>
                            </button>
                        </div>
                    )}

                </div>
            </nav>
            <div className="grow grid xl:grid-cols-12 grid-cols-1 gap-2 p-2  h-full  overflow-y-auto">
                {/* Contenido principal */}
                <main className="xl:col-span-9 grid grid-rows-[19rem__37rem] gap-2 h-screen ">

                    {/* Perfil */}
                    <section className="grid grid-cols-1 md:grid-cols-[1fr_3px_2fr] bg-white shadow rounded-2xl w-full max-w-full overflow-hidden">

                        {/* Columna izquierda */}
                        <div className="flex flex-col items-center justify-between p-5 w-full min-w-0">

                            <div className="w-20 h-20 shrink-0 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-4xl sm:text-5xl">
                                {firstLetter(oneEstablishment?.nombre)}
                            </div>

                            <h2 className="text-lg font-bold mt-2 text-center"> {oneEstablishment?.nombre || "Sin nombre"}</h2>
                            <p className="text-sm text-gray-600 w-full break-all px-2 text-center">{oneEstablishment?.correo || "Sin correo"}</p>

                            {/* Indicadores */}
                            <div className="flex w-full mt-5 items-center justify-center">
                                {[
                                    { label: "Reportados", value: incidentsByEstablishment?.length ?? 0 },
                                    { label: "Usuarios", value: usersByEstablishment?.length ?? 0 },
                                ].map((item, idx) => (
                                    <React.Fragment key={idx}>
                                        <div className="text-center flex-1 min-w-0 px-1">
                                            <p className="text-xl font-bold truncate text-gray-900">{item.value}</p>
                                            <p className="text-xs sm:text-sm text-gray-500 truncate">{item.label}</p>
                                        </div>
                                        {idx === 0 && <div className="w-px h-10 bg-gray-300 shrink-0"></div>}
                                    </React.Fragment>
                                ))}
                            </div>

                            <button className="sm:mt-2 mt-6 px-4 py-2 w-[65%] text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                                Enviar Mensaje
                            </button>
                        </div>

                        {/* Separador */}
                        <div className="hidden md:block bg-gray-200 my-4 rounded-full"></div>

                        {/* Columna derecha */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 w-full min-w-0 bg-gray-50/50 md:bg-transparent">

                            {[
                                {
                                    fields: [
                                        { label: "Identificador", value: `#${id}` },
                                        { label: "Usuario", value: `@${oneEstablishment?.nombre}` },
                                        { label: "Fecha Alta", value: oneEstablishment?.created_at ? new Date(oneEstablishment.created_at).toLocaleDateString("es-AR") : "Sin fecha" }
                                    ]
                                },
                                {
                                    fields: [
                                        { label: "Sitio Web", value: textOrganic(oneEstablishment?.sitioweb) },
                                        { label: "Cuit", value: oneEstablishment?.cuit || "Sin CUIT" },
                                        { label: "Teléfono", value: oneEstablishment?.telefono }
                                    ]
                                },
                                {
                                    fields: [
                                        ,
                                        { label: "País", value: oneEstablishment?.paises?.descripcion },
                                        { label: "Localidad", value: oneEstablishment?.localidades?.descripcion },
                                        { label: "Dirección", value: oneEstablishment?.calle }
                                    ]
                                }
                            ].map((card, idx) => (
                                <div key={idx} className="bg-white p-4 rounded grid gap-2">
                                    {card.fields.map((f, i) => (
                                        <div key={i} className="border-b text-sm border-gray-100">
                                            <span className="  font-bold text-gray-500">{f?.label}</span>
                                            <p className="text-sm font-medium text-gray-800 wrap-break-word mt-0.5">
                                                {f?.value || "-"}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </section>
                    {/* Incidentes */}
                    <PaneEstablishment
                        incidentsByEstablishment={incidentsByEstablishment}
                        sectores={sectorsByEstablishment}
                        puestos={stationBySector}
                        equipos={equipmentsByStation}
                        navigate={navigate}
                        formatFechaCustom={formatFechaCustom}
                    />
                </main>
                {/* Aside */}
                <aside className="col-span-12 lg:col-span-3 bg-white shadow rounded-lg p-4 h-[70vh] flex flex-col min-h-0 min-w-0 overflow-y-auto">
                    {/* Contenido lateral */}
                    <div className="w-full min-w-0">
                        <h3 className="text-base font-bold text-gray-800 truncate">Título</h3>
                        <p className="text-sm text-gray-600 wrap-break-word mt-2">
                            Contenido del aside...
                        </p>
                    </div>
                </aside>
            </div>
            <ModalAltaSector
                isOpen={openModalSector}
                onClose={() => setOpenSector(false)}
                idEstablecimiento={oneEstablishment.id_establecimiento}

            />
            <ModalAltaPuesto
                isOpen={openModalPuesto}
                onClose={() => setOpenModalPuesto(false)}
                idEstablecimiento={oneEstablishment?.id_establecimiento}
                sectores={sectorsByEstablishment}
               
            />

            <ModalAltaEquipo
                isOpen={openModalEquipo}
                onClose={() => setOpenModalEquipo(false)}
                idEstablecimiento={oneEstablishment?.id_establecimiento}
                puestos={stationBySector}
            />
        </div>
    );
}