import { useEffect, useState } from "react";
import { getIncidents, getIncidentsResolvedbyUser, getIncidentsReportbyUser, getIncidentsByUser, getIncidentsbyEstablishment, getIncidentsbyEnterprise, getIncidentsbyEquipment, getIncidentsByUserAssing } from "../services/incidentsService";
import { supabase } from "../services/supabase";
import { useParams } from "react-router-dom";
import { getCurrentUserLocalStorage } from "../utils/auth";

// 1. Hook exclusivo para los incidentes generales y Realtime
export function useGeneralIncidents(userLocalS: any) {
    const [incidents, setIncidents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const idEmpresa = userLocalS?.id_empresa;
    const idEstablecimiento = userLocalS?.id_establecimiento;

    useEffect(() => {
        if (!userLocalS) {
            setLoading(false);
            return;
        }

        const fetchIncidents = async () => {
            try {
                setLoading(true);
                let data: any[] = [];

                if (!idEmpresa && !idEstablecimiento) {
                    data = await getIncidents();
                } else if (idEstablecimiento) {
                    data = await getIncidentsbyEstablishment(idEstablecimiento);
                } else if (idEmpresa) {
                    data = await getIncidentsbyEnterprise(idEmpresa);
                }
                setIncidents(data || []);
            } catch (err) {
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchIncidents();

        const channel = supabase
            .channel("incidentes-realtime")
            .on("postgres_changes", { event: "*", schema: "public", table: "incidentes" }, fetchIncidents)
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [idEmpresa, idEstablecimiento]);

    return { incidents, loadingIncidents: loading };
}

// 2. Hook para incidentes de un usuario específico basado en un ID pasado por parámetro (URL u otro)
export function useUserIncidents(id: string | number | undefined) {
    const [incidentsReportbyUser, setIncidentsReportbyUser] = useState<any[]>([]);
    const [incidentsResolvedbyUser, setIncidentsResolvedbyUser] = useState<any[]>([]);
    const [incidentsAssing, setIncidentsAssing] = useState<any[]>([]);
    const [incidentsByUser, setIncidentsByUser] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchUserSpecific = async () => {
            try {
                setLoading(true);
                const numericId = Number(id);

                const [data, data2, data3, data4] = await Promise.all([
                    getIncidentsReportbyUser(numericId),
                    getIncidentsResolvedbyUser(numericId),
                    getIncidentsByUser(numericId),
                    getIncidentsByUserAssing(numericId)
                ]);

                setIncidentsReportbyUser(data || []);
                setIncidentsResolvedbyUser(data2 || []);
                setIncidentsByUser(data3 || []);
                setIncidentsAssing(data4 || []);
            } catch (err) {
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserSpecific();
    }, [id]);

    return {
        incidentsReportbyUser,
        incidentsResolvedbyUser,
        incidentsByUser,
        incidentsAssing, 
        loadingUserIncidents: loading
    };
}

// 3. Hook exclusivo para obtener los incidentes del usuario actualmente logueado
export function useMyIncidents() {
    const currentUser = getCurrentUserLocalStorage();
    const userId = currentUser?.id_usuario;

    const [incidentsReportbyUser, setIncidentsReportbyUser] = useState<any[]>([]);
    const [incidentsResolvedbyUser, setIncidentsResolvedbyUser] = useState<any[]>([]);
    const [incidentsAssing, setIncidentsAssing] = useState<any[]>([]);
    const [incidentsByUser, setIncidentsByUser] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const fetchMyIncidents = async () => {
            try {
                setLoading(true);
                const numericId = Number(userId);

                const [data, data2, data3, data4] = await Promise.all([
                    getIncidentsReportbyUser(numericId),
                    getIncidentsResolvedbyUser(numericId),
                    getIncidentsByUser(numericId),
                    getIncidentsByUserAssing(numericId)
                ]);

                setIncidentsReportbyUser(data || []);
                setIncidentsResolvedbyUser(data2 || []);
                setIncidentsByUser(data3 || []);
                setIncidentsAssing(data4 || []);
            } catch (err) {
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyIncidents();
    }, [userId]);

    return {
        incidentsReportbyUser,
        incidentsResolvedbyUser,
        incidentsByUser,
        incidentsAssing,
        loadingMyIncidents: loading
    };
}

// 4. Hook para incidentes filtrados por equipo específico
export function useIncidentByEquipment(idEquipo: number | undefined) {
    const [incidentsByEquipment, setIncidentsByEquipment] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!idEquipo) {
            setIncidentsByEquipment([]);
            setLoading(false);
            return;
        }

        const fetchByEquipment = async () => {
            try {
                setLoading(true);
                const numericId = Number(idEquipo);
                const data = await getIncidentsbyEquipment(numericId);
                setIncidentsByEquipment(data || []);
            } catch (err) {
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchByEquipment();
    }, [idEquipo]);

    return { incidentsByEquipment, loading };
}

// 5. Hook principal que combina los incidentes generales basados en parámetros de URL
export function useIncidentes() {
    const { id } = useParams();
    const userLocalS = getCurrentUserLocalStorage();
    const { incidents, loadingIncidents } = useGeneralIncidents(userLocalS);
    const {
        incidentsReportbyUser,
        incidentsResolvedbyUser,
        incidentsByUser,
        incidentsAssing,
        loadingUserIncidents
    } = useUserIncidents(id);

    return {
        incidents,
        loadingIncidents: loadingIncidents || loadingUserIncidents,
        incidentsReportbyUser,
        incidentsResolvedbyUser,
        incidentsByUser,
        incidentsAssing
    };
}