import { useEffect, useState } from 'react';
import {
  RocketLaunchIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UsersIcon
} from "@heroicons/react/24/outline"; 
import { supabase } from '../services/supabase'; 

interface Metrics {
  openIncidents: number;
  resolvedIncidents: number;
  pendingIncidents: number;
  totalUsers: number;
}

const StatusCards = () => {
  const [metrics, setMetrics] = useState<Metrics>({
    openIncidents: 0,
    resolvedIncidents: 0,
    pendingIncidents: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Leemos el usuario del localStorage
  const userLocalS = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const idEmpresa = userLocalS?.id_empresa;
  const idEstablecimiento = userLocalS?.id_establecimiento;

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      setLoading(true);
      try {
        // Función auxiliar para aplicar los permisos jerárquicos
        const applyRoleFilters = (query: any) => {
          if (idEstablecimiento) {
            return query.eq('id_establecimiento', idEstablecimiento);
          } else if (idEmpresa) {
            return query.eq('id_empresa', idEmpresa);
          }
          // Admin Global: sin filtros (trae todo)
          return query;
        };

        // 1. Consultas de Incidentes con múltiples estados usando .in()
        let queryClose = supabase
          .from('incidentes')
          .select('*', { count: 'exact', head: true })
          .in('id_estado_incidente', [7, 8, 10]); // Resueltos o cerrados

        let queryPending = supabase
          .from('incidentes')
          .select('*', { count: 'exact', head: true })
          .in('id_estado_incidente', [2, 3, 4, 5, 6, 1, 9]); // Pendientes / Abiertos / En proceso

        let queryTotal = supabase
          .from('incidentes')
          .select('*', { count: 'exact', head: true }); // Total general de incidentes

        // 2. Consulta de Usuarios (asegúrate de que tu tabla en Supabase se llame 'usuarios' o 'profiles')
        let queryUsers = supabase
          .from('usuarios')
          .select('*', { count: 'exact', head: true });

        // Aplicamos los filtros de rol a TODAS las consultas
        queryClose = applyRoleFilters(queryClose);
        queryPending = applyRoleFilters(queryPending);
        queryTotal = applyRoleFilters(queryTotal);
        queryUsers = applyRoleFilters(queryUsers);

        // Carga en paralelo eficiente con Promise.all
        const [
          { count: totalCount },
          { count: closeCount },
          { count: pendingCount },
          { count: usersCount }
        ] = await Promise.all([
          queryTotal,
          queryClose,
          queryPending,
          queryUsers,
        ]);

        setMetrics({
          openIncidents: totalCount || 0,
          resolvedIncidents: closeCount || 0,
          pendingIncidents: pendingCount || 0,
          totalUsers: usersCount || 0,
        });
      } catch (error) {
        console.error("Error al cargar las métricas del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardMetrics();
    
    // Dependencias primitivas para evitar bucles infinitos
  }, [idEmpresa, idEstablecimiento]);

  const cardsConfig = [
    {
      id: "open",
      label: "Total Incidentes",
      value: metrics.openIncidents,
      icon: RocketLaunchIcon,
      bgCard: "bg-blue-600 hover:bg-blue-700",
      bgIcon: "bg-blue-500/40 text-white",
    },
    {
      id: "resolved",
      label: "Incidentes Resueltos/Cerrados",
      value: metrics.resolvedIncidents,
      icon: CheckCircleIcon,
      bgCard: "bg-emerald-600 hover:bg-emerald-700",
      bgIcon: "bg-emerald-500/40 text-white",
    },
    {
      id: "pending",
      label: "Incidentes Pendientes",
      value: metrics.pendingIncidents,
      icon: ExclamationTriangleIcon,
      bgCard: "bg-amber-600 hover:bg-amber-700",
      bgIcon: "bg-amber-500/40 text-white",
    },
    {
      id: "users",
      label: "Total Usuarios",
      value: metrics.totalUsers,
      icon: UsersIcon,
      bgCard: "bg-purple-600 hover:bg-purple-700",
      bgIcon: "bg-purple-500/40 text-white",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {cardsConfig.map((card) => {
        const IconComponent = card.icon;

        return (
          <div
            key={card.id}
            className={`relative overflow-hidden ${card.bgCard} text-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex items-center justify-between cursor-pointer`}
          >
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
                {card.label}
              </p>
              {loading ? (
                <div className="h-8 w-16 bg-white/30 animate-pulse rounded-md mt-1" />
              ) : (
                <p className="text-2xl md:text-3xl font-extrabold text-white">
                  {card.value.toLocaleString()}
                </p>
              )}
            </div>

            <div className={`p-3 rounded-xl ${card.bgIcon} shrink-0 ml-4 backdrop-blur-sm`}>
              <IconComponent className="h-7 w-7 stroke-2" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusCards;