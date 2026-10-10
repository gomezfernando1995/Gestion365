import { useNavigate } from "react-router-dom";
import { UserIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

import { useUsers } from "../hooks/useUsers";
import Loader from "../components/Loader";
import { useIncidentes } from "../hooks/useIncidents";
import { firstLetter, formatFechaCustom, textOrganic } from "../utils/textFormat";
import React from "react";

export default function UserDetails() {
  const navigate = useNavigate();
  // 1. Usar loadingUser para el estado de carga del usuario individual
  const { user, loadingUser } = useUsers();
  const { incidentsReportbyUser = [], incidentsResolvedbyUser = [], incidentsByUser = [] } = useIncidentes();

  // Loader mientras se consulta a Supabase
  if (loadingUser) {
    return (
      <Loader
        text="Cargando Usuario..."
        url="https://media4.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3MDNpZjhlYXFtYnQxdWY2YzVidXN4NWQzejZmbjMzYjhxOTBmNmc5ZCZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/6c8AEptJ16DtdqdSR0/giphy.webp"
      />
    );
  }

  // Guardián por si no existe el usuario o la consulta devolvió null
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 gap-4">
        <h2 className="text-xl font-bold text-gray-700">No se encontró el usuario.</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Volver atrás
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full p-2 animate-fadeIn gap-3 rounded bg-gray-100 text-gray-900">
      {/* Navbar */}
      <nav className="flex flex-col w-full py-1 border-b rounded-lg bg-white border-gray-200">
        <div className="flex items-center justify-between p-3">
          <h2 className="text-lg font-bold flex gap-2 items-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-600 hover:underline px-2"
            >
              <ArrowLeftIcon className="h-7 w-7 mr-2 text-gray-500 hover:text-gray-700" />
            </button>

            <UserIcon className="h-7 w-7 text-blue-600" />
            <span className="text-gray-900">
              {user?.nombre || "Sin nombre"} {user?.apellido || ""}
              {user?.roles?.nombre && ` - ${textOrganic(user.roles.nombre)}`}
            </span>
          </h2>
        </div>
      </nav>

      <div className="grow grid grid-cols-12 gap-2 p-2 h-full overflow-y-auto">
        {/* Contenido principal */}
        <main className="col-span-9 grid grid-rows-[19rem__37rem] gap-2 h-screen">
          
          {/* Perfil */}
          <section className="grid grid-cols-[27%_5px_70%] bg-white shadow rounded-2xl">
            <div className="flex flex-col items-center p-5">
              {user?.img ? (
                <img
                  src={user.img}
                  alt={user.nombre}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow"
                />
              ) : (
                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-5xl">
                  {firstLetter(user?.nombre || "U")}
                </div>
              )}

              <h2 className="text-lg font-bold mt-2">
                {user?.nombre} {user?.apellido}
              </h2>
              <p className="text-sm text-gray-600">{user?.correo || "Sin correo"}</p>

              {/* Indicadores */}
              <div className="flex w-full mt-5">
                {[
                  { label: "Reportados", value: incidentsReportbyUser.length },
                  { label: "Resueltos", value: incidentsResolvedbyUser.length },
                ].map((item, idx) => (
                  <React.Fragment key={idx}>
                    <div className="text-center flex-1">
                      <p className="text-xl font-bold">{item.value}</p>
                      <p className="text-sm text-gray-500">{item.label}</p>
                    </div>
                    {idx === 0 && <div className="w-px h-12 bg-gray-300"></div>}
                  </React.Fragment>
                ))}
              </div>

              <button className="mt-6 px-4 py-2 w-[55%] text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                Enviar Mensaje
              </button>
            </div>

            {/* Separador */}
            <div className="bg-gray-100 rounded-2xl"></div>

            {/* Columna derecha */}
            <div className="grid grid-cols-3 gap-2 p-3">
              {[
                {
                  fields: [
                    { label: "Identificador", value: `#${user?.idusuario ?? "N/A"}` },
                    { label: "Usuario", value: `@${user?.usuario ?? "N/A"}` },
                    { label: "Estado Usuario", value: user?.estado_usuarios?.descripcion || "N/A" },
                    {
                      label: "Fecha Alta",
                      value: user?.created_at
                        ? new Date(user.created_at).toLocaleDateString("es-AR")
                        : "N/A",
                    },
                  ],
                },
                {
                  fields: [
                    {
                      label: user?.id_establecimiento ? "Establecimiento" : "Empresa",
                      value: user?.id_establecimiento
                        ? user?.establecimientos?.nombre
                        : user?.empresas?.nombre || "Sin asignación",
                    },
                    {
                      label: "Rol",
                      value: user?.roles?.nombre ? textOrganic(user.roles.nombre) : "Sin rol",
                    },
                    {
                      label: "Fecha nacimiento",
                      value: user?.fecha_nacimiento
                        ? new Date(user.fecha_nacimiento).toLocaleDateString("es-AR")
                        : "N/A",
                    },
                    { label: "Género", value: user?.genero || "N/A" },
                  ],
                },
                {
                  fields: [
                    { label: "Teléfono", value: user?.celular || "N/A" },
                    { label: "País", value: user?.paises?.descripcion || "N/A" },
                    { label: "Localidad", value: user?.localidades?.descripcion || "N/A" },
                    { label: "Dirección", value: user?.direccion || "N/A" },
                  ],
                },
              ].map((card, idx) => (
                <div key={idx} className="bg-white p-4 rounded grid gap-2">
                  {card.fields.map((f, i) => (
                    <div key={i} className="border-b text-sm border-gray-100">
                      <span className="font-bold text-gray-500">{f.label}</span>
                      <p>{f.value}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* Incidentes */}
          <div className="bg-white shadow rounded-xl p-3 flex flex-col">
            <div className="bg-gray-200 p-1 grid text-sm grid-cols-3 border-b rounded-xl border-gray-200">
              {["Historial Incidentes"].map((tab) => (
                <button
                  key={tab}
                  className="bg-white py-2 text-center font-semibold text-gray-700 flex items-center justify-center gap-2"
                >
                  {tab === "Historial Incidentes" ? (
                    <>
                      {tab}
                      <span className="ml-2 bg-blue-900 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {incidentsByUser.length}
                      </span>
                    </>
                  ) : (
                    tab
                  )}
                </button>
              ))}
            </div>

            {/* Lista scrollable */}
            <div className="mt-3 overflow-y-auto flex flex-col mb-3">
              <header className="bg-gray-300 p-3 font-bold text-gray-500 flex items-center sticky top-0 w-full z-10">
                <button className="bg-gray-100 p-2 hover:text-blue-600 rounded-lg text-sm">
                 
                </button>
              </header>
              {incidentsByUser.map((inc) => (
                <div
                  onClick={() => navigate(`/incidents/${inc.id_incidente}`)}
                  key={inc.id_incidente}
                  className="p-3 flex justify-center bg-gray-200 shadow rounded-md w-full cursor-pointer hover:bg-gray-300 transition"
                >
                  <div className="bg-white text-sm grid grid-cols-[15%_10%_30%_40%_5%] w-[95%] max-w-5xl h-21 place-items-center hover:bg-gray-100 mx-auto">
                    <div className="text-black text-lg text-center">
                      {formatFechaCustom(inc.fecha_inicio)}
                    </div>

                    <div className="text-center">
                      <span className="text-gray-500">Id</span>
                      <p className="font-black text-base">#{inc.id_incidente}</p>
                    </div>

                    <div className="text-center">
                      <span className="text-gray-500">Título</span>
                      <p className="font-black text-base">{inc.titulo}</p>
                    </div>

                    <div className="text-center">
                      <span className="text-gray-500">Establecimiento</span>
                      <p className="font-black text-base">
                        {inc.establecimientos?.nombre || "Sin establecimiento"}
                      </p>
                    </div>

                    <div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Aside */}
        <aside className="col-span-3 bg-white shadow rounded-lg p-2 h-[70%]">
          {/* Contenido lateral */}
        </aside>
      </div>
    </div>
  );
}