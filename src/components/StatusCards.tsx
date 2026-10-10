import { useEffect, useState } from 'react';
import {
  RocketLaunchIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UsersIcon
} from "@heroicons/react/24/outline"; // Cambiado a outline para un look más moderno
import { supabase } from '../services/supabase'; // Asegúrate de ajustar la ruta de tu cliente Supabase
import { getUsersCount } from '../services/usersService';

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

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      setLoading(true);
      try {
        // Carga en paralelo de métricas desde Supabase y tus servicios
        const [
          usersCount,
          { count: openCount },
          { count: resolvedCount },
          { count: pendingCount }
        ] = await Promise.all([
          getUsersCount(),
          // Ajusta los id_estado_incidente según los IDs reales en tu BD
          supabase.from('incidentes').select('*', { count: 'exact', head: true }).eq('id_estado_incidente', 1), // Abiertos
          supabase.from('incidentes').select('*', { count: 'exact', head: true }).eq('id_estado_incidente', 7), // Resueltos
          supabase.from('incidentes').select('*', { count: 'exact', head: true }).eq('id_estado_incidente', 2), // Pendientes/En Proceso
        ]);

        setMetrics({
          openIncidents: openCount || 0,
          resolvedIncidents: resolvedCount || 0,
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
  }, []);

  const cardsConfig = [
    {
      id: "open",
      label: "Incidentes Abiertos",
      value: metrics.openIncidents,
      icon: RocketLaunchIcon,
      bgCard: "bg-blue-600 hover:bg-blue-700",
      bgIcon: "bg-blue-500/40 text-white",
    },
    {
      id: "resolved",
      label: "Incidentes Resueltos",
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

            {/* Icono encuadrado con fondo semitransparente */}
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