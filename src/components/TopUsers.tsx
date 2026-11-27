import { UserIcon, TrophyIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useTopUsers } from '../hooks/useTopUsers';

export const TopUsers = () => {
    const { topUsers, loadingTopUsers } = useTopUsers();

    // Tomar solo el Top 10 para la visualización
    const topTecnicos = topUsers.slice(0, 10);

    const maxCantidad = topTecnicos.length > 0 ? topTecnicos[0].total_incidentes : 1;

    const getBadgeStyle = (index: number) => {
        switch (index) {
            case 0:
                return 'bg-amber-100 text-amber-700 border-amber-300';
            case 1:
                return 'bg-slate-100 text-slate-700 border-slate-300';
            case 2:
                return 'bg-orange-100 text-amber-800 border-orange-300';
            default:
                return 'bg-blue-50 text-blue-600 border-blue-200';
        }
    };

    return (
        <div className="bg-white overflow-y-auto p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col ">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                        <TrophyIcon className="w-5 h-5" />
                    </div>
                    <h2 className="text-base font-bold text-gray-900">Top Usuarios / Técnicos</h2>
                </div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Resoluciones
                </span>
            </div>

            {/* Estado de carga */}
            {loadingTopUsers ? (
                <div className="py-8 flex items-center justify-center text-gray-400">
                    <p className="text-sm animate-pulse">Cargando ranking...</p>
                </div>
            ) : topTecnicos.length === 0 ? (
                /* Estado vacío */
                <div className="py-8 flex flex-col items-center justify-center text-gray-400 gap-2">
                    <UserIcon className="w-8 h-8 text-gray-300" />
                    <p className="text-sm">No hay incidentes asignados o resueltos aún.</p>
                </div>
            ) : (
                /* Listado de Técnicos / Usuarios */  
                <div className="space-y-6">
                    {topTecnicos.map((user, index) => {
                        // Limpiamos la visualización para mostrar solo el nombre o una etiqueta clara
                        const nombreMostrar = user.nombre_usuario && user.nombre_usuario.trim() !== ''
                            ? user.nombre_usuario
                            : `Usuario ID: ${user.id_usuario_asignado}`;

                        const cantidad = user.total_incidentes;
                        const porcentaje = Math.round((cantidad / maxCantidad) * 100);
                        const uniqueKey = `${user.id_usuario_asignado}-${index}`;

                        return (
                            <div key={uniqueKey} className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        {/* Posición badge */}
                                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border shrink-0 ${getBadgeStyle(index)}`}>
                                            {index + 1}
                                        </span>
                                        <span className="font-semibold text-gray-800 text-xs truncate">
                                            {nombreMostrar}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 shrink-0">
                                        <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                                        <span>{cantidad}</span>
                                        <span className="text-gray-400 font-normal text-[11px]">
                                            ({cantidad === 1 ? 'incidente' : 'incidentes'})
                                        </span>
                                    </div>
                                </div>

                                {/* Barra de Progreso */}
                                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className={`h-1.5 rounded-full transition-all duration-500 ${index === 0
                                                ? 'bg-amber-500'
                                                : index === 1
                                                    ? 'bg-slate-400'
                                                    : index === 2
                                                        ? 'bg-orange-400'
                                                        : 'bg-blue-500'
                                            }`}
                                        style={{ width: `${porcentaje}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TopUsers;