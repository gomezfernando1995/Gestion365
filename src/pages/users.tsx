import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

import { useUsers } from "../hooks/useUsers";
import Loader from "../components/Loader";
import ModalNewUser from "../components/ModalNewUser";

export default function Users() {
  const { users = [], loadingUsers } = useUsers();
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const userLocalStorage = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const isAdmin = userLocalStorage.idrol === 6 || userLocalStorage.idrol === 13 || userLocalStorage.idrol === 2;

  // Filtrado de usuarios memorizado para optimizar rendimiento
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (!searchTerm.trim()) return users;

    const term = searchTerm.toLowerCase().trim();

    return users.filter((u) => {
      const id = u.idusuario?.toString() || "";
      const nombre = u.nombre?.toLowerCase() || "";
      const apellido = u.apellido?.toLowerCase() || "";
      const correo = u.correo?.toLowerCase() || "";
      const rol = u.roles?.nombre?.toLowerCase() || "";
      const estado = u.estado_usuarios?.descripcion?.toLowerCase() || "";
      const establecimiento = u.establecimientos?.nombre?.toLowerCase() || "";
      const empresa = u.empresas?.nombre?.toLowerCase() || "";

      return (
        id.includes(term) ||
        nombre.includes(term) ||
        apellido.includes(term) ||
        correo.includes(term) ||
        rol.includes(term) ||
        estado.includes(term) ||
        establecimiento.includes(term) ||
        empresa.includes(term)
      );
    });
  }, [users, searchTerm]);

  if (loadingUsers) {
    return (
      <Loader
        text="Cargando Usuarios..."
        url="https://media.giphy.com/media/g8iw6Klazhkqi4sgaN/giphy.gif"
      />
    );
  }

  return (
    <div className="overflow-y-auto min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center bg-white shadow-sm p-4 rounded-md gap-3">
        <h1 className="text-xl font-bold text-blue-900">Panel Usuarios</h1>

        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={() => setOpenModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-3.5 py-2 rounded-md font-medium text-sm transition"
            >
              + Nuevo Usuario
            </button>
          </div>
        )}
      </header>

      {/* Barra de Filtros / Búsqueda */}
      <section className="my-3 flex flex-col md:flex-row items-center bg-white shadow-sm p-3 rounded-md gap-3">
        <div className="relative w-full flex items-center">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por ID, nombre, apellido, email, rol, establecimiento, empresa..."
            className="w-full pl-10 pr-3 py-2 border-0 border-b-2 border-gray-300 focus:border-blue-600 focus:ring-0 outline-none text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-xs text-gray-500 hover:text-gray-700 font-bold px-2"
            >
              Limpiar
            </button>
          )}
        </div>
      </section>

      {/* Tabla de Usuarios */}
      <div className="my-3 overflow-y-auto max-h-[75vh] shadow-sm rounded-md bg-white">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-200 text-center sticky top-0 z-10 text-sm font-semibold text-gray-700">
            <tr>
              <th className="p-3 text-center">ID</th>
              <th className="p-3 text-center">Nombre</th>
              <th className="p-3 text-center">Apellido</th>
              <th className="p-3 text-center">Email</th>
              <th className="p-3 text-center">Rol</th>
              <th className="p-3 text-center">Estado</th>
              <th className="p-3 text-center">Establecimiento</th>
              <th className="p-3 text-center">Empresa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <tr
                  key={u.idusuario}
                  onClick={() => navigate(`/users/${u.idusuario}`)}
                  className="hover:bg-blue-50 text-center cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-gray-700">#{u.idusuario}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">{u.nombre || "—"}</td>
                  <td className="py-3 px-4 text-gray-600">{u.apellido || "—"}</td>
                  <td className="py-3 px-4 text-gray-600">{u.correo || "—"}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">{u.roles?.nombre || "Sin Rol"}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-semibold ${
                        u.idestadousuario === 1
                          ? "bg-green-100 text-green-700 border border-green-400"
                          : "bg-red-100 text-red-700 border border-red-400"
                      }`}
                    >
                      {u.estado_usuarios?.descripcion || "Desconocido"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{u.establecimientos?.nombre || "—"}</td>
                  <td className="py-3 px-4 text-gray-600">{u.empresas?.nombre || "—"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-500 text-sm">
                  No se encontraron usuarios que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Nuevo Usuario */}
      <ModalNewUser
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSave={() => {
          setOpenModal(false);
        }}
      />
    </div>
  );
}