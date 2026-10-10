import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Cog8ToothIcon , MagnifyingGlassIcon, BuildingOfficeIcon } from "@heroicons/react/24/solid";
import Loader from "../components/Loader";
import ModalNewEstablecimiento from "../components/ModalCreateEstablishment"; 
import { useEstablishment } from "../hooks/useEstablishment";

export default function Establecimientos() {
  const { establishments, loading } = useEstablishment();
  const [openModal, setOpenModal] = useState(false);
  const [searchNav, setSearchNav] = useState("");
  const navigate = useNavigate();
  const userLocalS = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const isAdmin = userLocalS?.idrol === 6 || userLocalS?.idrol === 13 || userLocalS?.idrol === 2;

 
  const filteredEstablecimientos = useMemo(() => {
    if (!searchNav.trim()) return establishments;

    const term = searchNav.toLowerCase().trim();

    return establishments.filter((e) => {
      const id = e.id_establecimiento?.toString() || "";
      const nombre = e.nombre?.toLowerCase() || "";
      const empresa = e.empresas?.nombre?.toLowerCase() || "";
      const direccion = e.direccion?.toLowerCase() || "";
      const localidad = e.localidades?.descripcion?.toLowerCase() || "";
      const provincia = e.provincias?.descripcion || e.paises?.descripcion || "";

      return (
        id.includes(term) ||
        nombre.includes(term) ||
        empresa.includes(term) ||
        direccion.includes(term) ||
        localidad.includes(term) ||
        provincia.toLowerCase().includes(term)
      );
    });
  }, [establishments, searchNav]);

  if (loading) {
    return (
      <Loader
        text="Cargando Establecimientos..."
        url="https://media.giphy.com/media/g8iw6Klazhkqi4sgaN/giphy.gif"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center bg-white shadow p-4 rounded-md">
        <h1 className="text-xl font-bold text-blue-900 flex items-center gap-2">
          <BuildingOfficeIcon className="h-6 w-6 text-blue-900" />
          Panel Establecimientos
        </h1>
        {isAdmin&&(
        <div className="flex gap-2 mt-2 md:mt-0">
          <button
            onClick={() => setOpenModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition"
          >
            + Nuevo Establecimiento
          </button>
        </div>
        )}
      </header>

      {/* Bar de Filtros / Búsqueda */}
      <section className="my-3 flex flex-col md:flex-row items-center bg-white shadow p-3 rounded-md gap-3">
        <div className="flex items-center gap-1 text-blue-900 font-medium">
          <span>Filtros</span>
          <Cog8ToothIcon className="h-6 w-6 text-blue-900" />
        </div>

        <div className="relative w-full flex items-center">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-2 text-gray-400" />
          <input
            type="text"
            value={searchNav}
            onChange={(e) => setSearchNav(e.target.value)}
            placeholder="Buscar por ID, nombre, empresa, dirección, localidad..."
            className="w-full pl-9 pr-3 py-2 border-0 border-b-2 border-gray-300 focus:border-blue-600 focus:ring-0 outline-none text-sm"
          />
          {searchNav && (
            <button
              onClick={() => setSearchNav("")}
              className="text-xs text-gray-500 hover:text-gray-700 font-bold px-2"
            >
              Limpiar
            </button>
          )}
        </div>
      </section>

      {/* Tabla de Establecimientos */}
      <div className="my-2 overflow-y-auto max-h-[75vh] shadow rounded-md">
        <table className="w-full bg-white">
          <thead className="bg-gray-200 text-center sticky top-0 z-10">
            <tr>
              <th className="p-3 text-center">ID</th>
              <th className="p-3 text-center">Nombre</th>
              <th className="p-3 text-center">Localidad</th>
              <th className="p-3 text-center">Dirección</th>
              <th className="p-3 text-center">Empresa</th>
            </tr>
          </thead>
          <tbody>
            {filteredEstablecimientos.length > 0 ? (
              filteredEstablecimientos.map((e) => (
                <tr
                  key={e.id_establecimiento}
                  onClick={() => navigate(`/establishment/${e.id_establecimiento}`)}
                  className="border-b hover:bg-blue-50 text-center cursor-pointer transition-colors"
                >
                  <td className="p-3 font-semibold text-gray-700">#{e.id_establecimiento}</td>
                  <td className="p-3 font-medium">{e.nombre || "—"}</td>
                  <td className="p-3">{e.localidades?.descripcion || "—"}</td>
                  <td className="p-3">{e.calle || "—"}</td>
                  <td className="p-3">{e.empresas?.nombre || "Sin Empresa"}</td>
                
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  No se encontraron establecimientos que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Nuevo Establecimiento */}
      {ModalNewEstablecimiento && (
        <ModalNewEstablecimiento
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          onSave={() => setOpenModal(false)}
        />
      )}
    </div>
  );
}

