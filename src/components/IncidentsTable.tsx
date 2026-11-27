import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

interface IncidenteItem {
  id_incidente: number;
  titulo: string;
  descripcion: string;
  created_at: string;
  id_empresa?: number;
  id_establecimiento?: number;
  estado_incidentes?: {
    descripcion: string;
  };
  prioridad_incidentes?: {
    descripcion: string;
  };
}

const IncidentsTable = () => {
  const [incidents, setIncidents] = useState<IncidenteItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchIncidents = async () => {
      setLoading(true);
      try {
        const userStored = localStorage.getItem("currentUser");
        const userLocal = userStored ? JSON.parse(userStored) : null;

        let query = supabase
          .from('incidentes')
          .select(`
            *,
            estado_incidentes!fk_estado(descripcion),
            prioridad_incidentes!fk_prioridad(descripcion)
          `)
          .order('created_at', { ascending: false })
          .limit(10);

        if (userLocal?.id_empresa) {
          const { data: establishments } = await supabase
            .from('establecimientos')
            .select('id_establecimiento')
            .eq('id_empresa', userLocal.id_empresa);

          const estIds = establishments?.map((e) => e.id_establecimiento) || [];

          if (estIds.length > 0) {
            query = query.or(
              `id_empresa.eq.${userLocal.id_empresa},id_establecimiento.in.(${estIds.join(',')})`
            );
          } else {
            query = query.eq('id_empresa', userLocal.id_empresa);
          }
        } else if (userLocal?.id_establecimiento) {
          query = query.eq('id_establecimiento', userLocal.id_establecimiento);
        }

        const { data, error } = await query;

        if (error) throw error;
        setIncidents(data || []);
      } catch (err) {
        console.error("Error al obtener los incidentes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  const getStatusBadgeClass = (statusName?: string) => {
    switch (statusName?.toLowerCase()) {
      case 'resuelto':
      case 'cerrado':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'en proceso':
      case 'pendiente':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'abierto':
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="bg-white overflow-y-auto  rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm w-full">
      {/* Encabezado Principal */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Incidentes Recientes</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Ultimos 10 incidentes agregados
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
          Total: {incidents.length}
        </span>
      </div>

      {loading ? (
        /* Skeleton Loading */
        <div className="space-y-3">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="h-14 bg-gray-100 animate-pulse rounded-lg w-full" />
          ))}
        </div>
      ) : incidents.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-sm">
          No se encontraron incidentes registrados.
        </div>
      ) : (
        <>
          <div className="block md:hidden max-h-90 overflow-y-auto space-y-3 pr-1">
            {incidents.map((i) => {
              const statusName = i.estado_incidentes?.descripcion || "Abierto";
              return (
                <div 
                  key={i.id_incidente} 
                  className="p-4 rounded-lg border border-gray-100 bg-gray-50/50 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">
                      #{i.id_incidente}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(statusName)}`}>
                      {statusName}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug">
                      {i.titulo || "Sin Título"}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {i.descripcion || "Sin Descripción"}
                    </p>
                  </div>

                  <div className="text-right text-[11px] text-gray-400 mt-1 border-t border-gray-100 pt-2">
                    {i.created_at ? new Date(i.created_at).toLocaleDateString() : "-"}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vista Escritorio */}
          <div className="hidden md:block w-full max-h-110 overflow-y-auto rounded-lg border border-gray-100">
            <table className="w-full text-left text-sm text-gray-600 border-collapse">
              <thead className="sticky top-0 bg-white z-10 shadow-sm">
                <tr className="border-b border-gray-200 text-xs uppercase font-semibold text-gray-400 tracking-wider">
                  <th className="py-3 px-3 w-16 bg-white">ID</th>
                  <th className="py-3 px-3 bg-white">Título / Descripción</th>
                  <th className="py-3 px-3 w-32 bg-white">Estado</th>
                  <th className="py-3 px-3 w-28 text-right bg-white">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {incidents.map((i) => {
                  const statusName = i.estado_incidentes?.descripcion || "Abierto";
                  return (
                    <tr key={i.id_incidente} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-3 font-medium text-gray-900">
                        #{i.id_incidente}
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-semibold text-gray-800 line-clamp-1">
                          {i.titulo || "Sin Título"}
                        </p>
                        <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                          {i.descripcion || "Sin Descripción"}
                        </p>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(statusName)}`}>
                          {statusName}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-xs text-gray-500 text-right">
                        {i.created_at ? new Date(i.created_at).toLocaleDateString() : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default IncidentsTable;