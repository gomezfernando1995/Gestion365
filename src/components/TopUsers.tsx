import  { useMemo } from 'react';
import { UserIcon, TrophyIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface Incidente {
    id_incidente: number;
    id_estado_incidente?: number;
    estado?: string;
    tecnico?: {
        id_usuario?: number;
        nombre?: string;
        apellido?: string;
    } | null;
    // O si en tu DB la relación viene directamente como asignado_a / usuario
    usuario_asignado?: string;
}

interface TopUsersProps {
    incidents?: Incidente[];
}

export const TopUsers = ({ incidents = [] }: TopUsersProps) => {
    // Agrupar y contar incidentes resueltos/atendidos por técnico
    const topTecnicos = useMemo(() => {
        if (!incidents || incidents.length === 0) return [];

        const conteoMap: Record<string, { nombre: string; cantidad: number }> = {};

        incidents.forEach((inc) => {
            // Verificar si el incidente está resuelto o cerrado
            // Adapta según los IDs o nombres de estado de tu sistema (ej: 3 = Resuelto, 4 = Cerrado)
            const nombreTecnico = 
                inc.tecnico?.nombre 
                    ? `${inc.tecnico.nombre} ${inc.tecnico.apellido || ''}`.trim()
                    : inc.usuario_asignado || 'Sin Asignar';

            if (nombreTecnico !== 'Sin Asignar') {
                if (!conteoMap[nombreTecnico]) {
                    conteoMap[nombreTecnico] = { nombre: nombreTecnico, cantidad: 0 };
                }
                conteoMap[nombreTecnico].cantidad += 1;
            }
        });

        // Convertir objeto a Array y ordenar de mayor a menor
        return Object.values(conteoMap)
            .sort((a, b) => b.cantidad - a.cantidad)
            .slice(0, 5); // Tomar solo el Top 5
    }, [incidents]);

    // Obtener el valor máximo para calcular los porcentajes de la barra
    const maxCantidad = topTecnicos.length > 0 ? topTecnicos[0].cantidad : 1;

    // Colores para los 3 primeros puestos (Puesto 1: Oro, Puesto 2: Plata, Puesto 3: Bronce)
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
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                        <TrophyIcon className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Top Usuarios / Técnicos</h2>
                </div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Resoluciones
                </span>
            </div>

            {/* Listado de Técnicos / Usuarios */}
            {topTecnicos.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-gray-400 gap-2">
                    <UserIcon className="w-8 h-8 text-gray-300" />
                    <p className="text-sm">No hay incidentes asignados o resueltos aún.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {topTecnicos.map((user, index) => {
                        const porcentaje = Math.round((user.cantidad / maxCantidad) * 100);

                        return (
                            <div key={user.nombre} className="space-y-1.5">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        {/* Posición badge */}
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border shrink-0 ${getBadgeStyle(index)}`}>
                                            {index + 1}
                                        </span>
                                        <span className="font-semibold text-gray-800 truncate">
                                            {user.nombre}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 shrink-0">
                                        <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                                        <span>{user.cantidad}</span>
                                        <span className="text-gray-400 font-normal">
                                            ({user.cantidad === 1 ? 'incidente' : 'incidentes'})
                                        </span>
                                    </div>
                                </div>

                                {/* Barra de Progreso */}
                                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-500 ${
                                            index === 0
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