import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BuildingOffice2Icon,
  HomeIcon,
  ChartBarIcon,
  UsersIcon,
  TicketIcon,
  CogIcon,
  ComputerDesktopIcon,
  ExclamationTriangleIcon,
  ArrowLeftStartOnRectangleIcon,
  BookOpenIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from "@heroicons/react/24/solid";
import { logout } from '../services/authService';
import Logo from './../assets/logo.png';
import Favicon from './../assets/favicon.png';
import { firstLetter, textOrganic } from '../utils/textFormat';
import { getCurrentUserLocalStorage } from '../utils/auth';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false); // Para dispositivos móviles
  const [isCollapsed, setIsCollapsed] = useState(false); // Para colapsar en escritorio
  const navigate = useNavigate();
  const location = useLocation();

  // Cerrar el menú en móviles automáticamente al cambiar de ruta
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const ALL_ROLES = [2, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
  const userLocalStorage = getCurrentUserLocalStorage() || {};
  const userRole = userLocalStorage.idrol;

  const menu = [
    { name: "Dashboard", icon: HomeIcon, ruta: "/dashboard", roles: ALL_ROLES },
    { name: "Incidentes", icon: ExclamationTriangleIcon, ruta: "/incidents", roles: ALL_ROLES },
    { name: "Mis Incidentes", icon: TicketIcon, ruta: "/myIncidents", hidden: false, roles: [2, 5, 6, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20] },
    { name: "Equipos", icon: ComputerDesktopIcon, ruta: "/equipments", roles: ALL_ROLES, hidden: true },
    { name: "Reportes", icon: ChartBarIcon, ruta: "/reports", roles: [2, 5, 6, 7, 13, 14] },
    { name: "Usuarios", icon: UsersIcon, ruta: "/users", roles: [2, 5, 6, 13] },
    { name: "Establecimientos", icon: BuildingOffice2Icon, ruta: "/establishment", roles: [5, 6, 7, 13] },
    { name: "Mi Establecimiento", icon: BuildingOffice2Icon, ruta: `/establishment/${userLocalStorage.id_establecimiento}`, roles: [2, 14, 15, 16, 17, 18, 19, 20] },
    { name: "Mi Empresa", icon: BuildingOffice2Icon, roles: [2, 5, 6, 7, 8, 9, 10, 11, 12, 13], hidden: true },
    { name: "Ajustes", icon: CogIcon, ruta: "/settings", hidden: true, roles: ALL_ROLES },
    { name: "Base de Conocimiento", icon: BookOpenIcon, ruta: "/kb", hidden: true, roles: ALL_ROLES },
  ];

  const visibleMenu = menu.filter((item) => {
    if (item.hidden) return false;
    return (item.roles && item.roles.includes(userRole));
  });

  return (
    <>
      {/* Barra superior móvil con botón hamburguesa */}
      <div className="md:hidden flex items-center justify-between bg-gray-800 text-white px-4 py-3 fixed top-0 left-0 right-0 z-40 shadow-md">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none transition"
          aria-label="Menú"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        <span className="font-semibold text-sm truncate max-w-50">
          {userLocalStorage.id_empresa ? textOrganic(userLocalStorage.empresas?.nombre) : userLocalStorage.establecimientos?.nombre || "Panel"}
        </span>
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-lg">
          {firstLetter(userLocalStorage?.nombre || "U")}
        </div>
      </div>

      {/* Overlay oscuro para móviles */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
        />
      )}

      {/* Contenedor principal del Sidebar con ancho dinámico según isCollapsed */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 bg-gray-800 text-white flex flex-col h-screen transform transition-all duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } ${isCollapsed ? "md:w-20" : "md:w-64"} w-64 shadow-2xl md:shadow-none`}
      >
        {/* Cabecera del Sidebar */}
        <div className="py-2 px-4 border-b border-gray-700 flex items-center justify-between relative min-h-18.25 gap-2">
          {/* Sección del logo (solo se muestra si no está colapsado) */}
          <div className={`flex items-center overflow-hidden transition-all ${isCollapsed ? "hidden" : "block"}`}>
            <img src={Logo} alt="Logo Sidebar" className="w-38 ml-2 object-contain transition-all" />
          </div>

          {/* Contenedor del botón en escritorio (centrado cuando está colapsado, a la derecha cuando está expandido) */}
          <div className={`flex items-center ${isCollapsed ? "w-full justify-center" : "gap-1"}`}>
            {/* Botón de cerrar para móvil */}
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden text-gray-400 hover:text-white p-1 rounded"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {/* Botón para colapsar/expandir en escritorio */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white p-2 rounded-lg  border-gray-700 items-center justify-center transition shadow-sm"
              title={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
            >
              {isCollapsed ? (
                <ChevronDoubleRightIcon className="h-4 w-4" />
              ) : (
                <ChevronDoubleLeftIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Nombre de la empresa / establecimiento (se oculta si está colapsado) */}
        {!isCollapsed && (
          <div className="text-gray-300 text-xs text-center font-semibold px-4 pt-3 pb-1 border-b border-gray-700/50 truncate">
            {userLocalStorage.id_empresa ? textOrganic(userLocalStorage.empresas?.nombre) : userLocalStorage.establecimientos?.nombre}
          </div>
        )}

        {/* Opciones de Navegación */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
          {visibleMenu.map((item) => {
            const isActive = location.pathname === item.ruta;
            return (
              <a
                key={item.name}
                onClick={() => navigate(item.ruta!)}
                title={isCollapsed ? item.name : ""}
                className={`flex items-center gap-3 p-2.5 rounded-lg transition cursor-pointer relative group ${isActive ? "bg-gray-700 text-blue-400 font-medium" : "hover:bg-gray-700/60 text-gray-300"
                  }`}
              >
                <item.icon className="h-5 w-5 shrink-0 mx-auto md:mx-0" />
                <span className={`whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? "md:hidden" : "block"}`}>
                  {item.name}
                </span>

                {/* Tooltip flotante cuando está colapsado */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap hidden md:block">
                    {item.name}
                  </div>
                )}
              </a>
            );
          })}
        </nav>

        {/* Perfil del usuario */}
        <div className={`p-3 border-t border-gray-700 flex items-center gap-3 bg-gray-850 ${isCollapsed ? "justify-center" : ""}`}>
          <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-xl">
            {firstLetter(userLocalStorage?.nombre || "U")}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold text-white capitalize truncate text-sm">
                {textOrganic(userLocalStorage.nombre) ?? "Usuario"}
              </span>
              <span className="text-xs text-gray-400 uppercase tracking-wide truncate">
                {userLocalStorage.roles?.nombre ?? "Sin rol"}
              </span>
            </div>
          )}
        </div>

        {/* Botón de Cerrar sesión */}
        <div className="p-3 border-t border-gray-700 bg-gray-900/30">
          <button
            onClick={logout}
            title={isCollapsed ? "Cerrar sesión" : ""}
            className={`flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-700 transition text-red-400 hover:text-red-300 relative group ${isCollapsed ? "justify-center" : ""}`}
          >
            <ArrowLeftStartOnRectangleIcon className="h-5 w-5 shrink-0 mx-auto md:mx-0" />
            <span className={`font-medium text-sm whitespace-nowrap ${isCollapsed ? "md:hidden" : "block"}`}>
              Cerrar sesión
            </span>

            {/* Tooltip para cerrar sesión si está colapsado */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap hidden md:block">
                Cerrar sesión
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Espaciador para pantallas pequeñas */}
      <div className="md:hidden h-14" />
    </>
  );
}