import { useEffect, useState } from "react";
// Asegúrate de actualizar tu servicio para que acepte el ID del establecimiento
import { getClosedIncidentsByDateRange } from "../services/incidentsService"; 
import type { Incidente } from "../types/Incidente";
import { getCurrentUserLocalStorage } from "../utils/auth";

export function getCurrentMonth(): number {
    const now = new Date();
    return now.getMonth(); // 0 = Enero ... 10 = Noviembre, 11 = Diciembre
}

export function getCurrentYear(): number {
    const now = new Date();
    return now.getFullYear();
}

// 1. Hook mensual
export function useClosedIncidentsByMonth(month: number = getCurrentMonth(), year: number = getCurrentYear()) {
    const [incidentsByMonth, setIncidents] = useState<Incidente[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadIncidents = async () => {
            try {
                setLoading(true);
                setError(null);

                const userLocalS = getCurrentUserLocalStorage();
                const idEstablecimientoUser = userLocalS?.id_establecimiento; // ej: 1, 2, etc.

                const firstDay = new Date(year, month, 1);
                const firstDayString = firstDay.toISOString().split('T')[0] + "T00:00:00";

                const lastDay = new Date(year, month + 1, 0);
                const lastDayString = lastDay.toISOString().split('T')[0] + "T23:59:59";

                // Le pasamos el idEstablecimientoUser a la función de servicio
                const data = await getClosedIncidentsByDateRange(firstDayString, lastDayString, idEstablecimientoUser);
                setIncidents(data);
            } catch (err: any) {
                console.error("Error al obtener incidentes:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadIncidents();
    }, [year, month]);

    return { incidentsByMonth, loading, error };
}

// 2. Hook trimestral
export function useClosedIncidentsByQuarter(quarter: number, year: number = getCurrentYear()) {
    const [incidentsByQuarter, setIncidents] = useState<Incidente[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadIncidents = async () => {
            try {
                setLoading(true);
                setError(null);

                const userLocalS = getCurrentUserLocalStorage();
                const idEstablecimientoUser = userLocalS?.id_establecimiento;

                const startMonth = (quarter - 1) * 3;
                const endMonth = startMonth + 2;

                const firstDay = new Date(year, startMonth, 1);
                const firstDayString = firstDay.toISOString().split('T')[0] + "T00:00:00";

                const lastDay = new Date(year, endMonth + 1, 0);
                const lastDayString = lastDay.toISOString().split('T')[0] + "T23:59:59";

                const data = await getClosedIncidentsByDateRange(firstDayString, lastDayString, idEstablecimientoUser);
                setIncidents(data);
            } catch (err: any) {
                console.error("Error al obtener incidentes trimestrales:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadIncidents();
    }, [year, quarter]);

    return { incidentsByQuarter, loading, error };
}

// 3. Hook anual
export function useClosedIncidentsByYear(year: number = getCurrentYear()) {
    const [incidentsByYear, setIncidents] = useState<Incidente[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadIncidents = async () => {
            try {
                setLoading(true);
                setError(null);

                const userLocalS = getCurrentUserLocalStorage();
                const idEstablecimientoUser = userLocalS?.id_establecimiento;

                const firstDayString = `${year}-01-01T00:00:00`;
                const lastDayString = `${year}-12-31T23:59:59`;

                const data = await getClosedIncidentsByDateRange(firstDayString, lastDayString, idEstablecimientoUser);
                setIncidents(data);
            } catch (err: any) {
                console.error("Error al obtener incidentes anuales:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadIncidents();
    }, [year]);

    return { incidentsByYear, loading, error };
}

export function calcularMTTR(incidentes: Incidente[]): string {
    if (incidentes.length === 0) return "0.0 hrs";

    let totalHoras = 0;
    let incidentesValidos = 0;

    incidentes.forEach(inc => {
        if (inc.created_at && inc.updated_at) {
            const fechaCreacion = new Date(inc.created_at).getTime();
            const fechaCierre = new Date(inc.updated_at).getTime();

            const diferenciaHoras = (fechaCierre - fechaCreacion) / (1000 * 60 * 60);

            if (diferenciaHoras >= 0) {
                totalHoras += diferenciaHoras;
                incidentesValidos++;
            }
        }
    });

    if (incidentesValidos === 0) return "0.0 hrs";

    const promedioHoras = totalHoras / incidentesValidos;
    return `${promedioHoras.toFixed(1)} hrs`;
}