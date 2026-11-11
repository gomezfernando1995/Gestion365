import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import {
  BuildingOffice2Icon,
  HomeIcon,
  ChartBarIcon,
  UsersIcon,
  TicketIcon,
  CogIcon, ComputerDesktopIcon,
  ExclamationTriangleIcon, ArrowLeftStartOnRectangleIcon,
  BookOpenIcon,
} from "@heroicons/react/24/solid";
import { logout } from '../services/authService';
import Logo from './../assets/logo.png'
import { firstLetter, textOrganic } from '../utils/textFormat';



export default function Sidebar() {
  const [userM, setUser] = useState(Object);
  useEffect(
    () => {
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) { setUser(JSON.parse(savedUser)); }
    }, []
  );
  const ALL_ROLES = [2,5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

  const userRole = userM.idrol;

  const menu = [
    { name: "Dashboard", icon: HomeIcon, ruta: "/dashboard", roles: ALL_ROLES },
    { name: "Incidentes", icon: ExclamationTriangleIcon, ruta: "/incidents", roles: ALL_ROLES },
    { name: "Mis Incidentes", icon: TicketIcon, ruta: "/myIncidents", hidden: false, roles: [2,5, 6, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20] },
    { name: "Equipos", icon: ComputerDesktopIcon, ruta: "/equipments", roles: ALL_ROLES, hidden: true },
    { name: "Reportes", icon: ChartBarIcon, ruta: "/reports", roles: [2,5, 6, 7, 13, 14] },
    { name: "Usuarios", icon: UsersIcon, ruta: "/users", roles: [2,5, 6, 13] }, // 
    { name: "Establecimientos", icon: BuildingOffice2Icon, ruta: "/establishment", roles: [5, 6, 7, 13] },
    { name: "Mi Establecimiento", icon: BuildingOffice2Icon, ruta: `/establishment/${userM.id_establecimiento}`, roles: [2,14, 15, 16, 17, 18, 19, 20] },
    { name: "Mi Empresa", icon: BuildingOffice2Icon, roles: [2,5, 6, 7, 8, 9, 10, 11, 12, 13], hidden: true },
    { name: "Ajustes", icon: CogIcon, ruta: "/settings",hidden: true, roles: ALL_ROLES},
    { name: "Base de Conocimiento", icon: BookOpenIcon, ruta: "/kb", hidden: true, roles: ALL_ROLES }, // 👈 Guías/Manuales

  ];
  const navigate = useNavigate();
  const visibleMenu = menu.filter((item) => {
    if (item.hidden) return false; // Si está oculto, no se muestra a NADIE

    return (item.roles && item.roles.includes(userRole));
  });
  return (
    <aside className="w-62 bg-gray-800 text-white flex flex-col h-screen">
      <div className="py-4 px-6 border-b border-gray-700 items-center">
        <img src={Logo} alt="Logo Sidebar" className='w-45' />
        <div className="text-gray-300 text-md text-center font-semibold pt-4">
          {userM.id_empresa ? textOrganic(userM.empresas?.nombre) : userM.establecimientos?.nombre}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {visibleMenu.map((item) => (
          <a
            key={item.name}
            onClick={() => navigate(item.ruta!)}
            className="flex items-center gap-3 p-2 rounded hover:bg-gray-700 transition"
          >
            <item.icon className="h-5 w-5 text-gray-300" />
            <span>{item.name}</span>
          </a>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700 flex items-center gap-3">
       {/*<img
          src="https://i.pravatar.cc/40?u=t"
          alt={userM.nombre}
          className="rounded-full w-10 h-10 border border-gray-600"
          
        /> */}
         <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-3xl">
                          {firstLetter(userM?.nombre || "U")}
                        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-white capitalize">
            {textOrganic(userM.nombre) ?? "Usuario"}
          </span>
          <span className="text-xs text-gray-400 uppercase tracking-wide">
            {userM.roles?.nombre ?? "Sin rol"}
          </span>
        </div>
      </div>

      <div className="p-3 border-t border-gray-700">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full p-2 rounded hover:bg-gray-700 transition text-red-400"
        >
          <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
          <span className="font-medium">Cerrar sesión</span>
        </button>
      </div>
    </aside>


  );
}
