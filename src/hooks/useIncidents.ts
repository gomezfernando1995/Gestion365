import { useEffect, useState } from "react";
import { getIncidents, getIncidentsResolvedbyUser, getIncidentsReportbyUser, getIncidentsByUser, getIncidentsbyEstablishment, getIncidentsbyEnterprise } from "../services/incidentsService";
import { supabase } from "../services/supabase";
import { useParams } from "react-router-dom";
import { useUsers } from "./useUsers";
import type { Incidente } from "../types/Incidente";


export function useIncidentes() {
    const { id } = useParams();
    const [incidents, setIncidents] = useState<any[]>([]);
    const [loadingIncidents, setLoadingIncidents] = useState(true);
    const [incidentsReportbyUser, setIncidentsReportbyUser] = useState<any[]>([]);
    const [incidentsResolvedbyUser, setIncidentsResolvedbyUser] = useState<any[]>([]);
    const [incidentsByUser, setIncidentsByUser] = useState<any[]>([]);
    const { userLocalS } = useUsers();

    useEffect(() => {
        if (!userLocalS) return; // Espera a que exista el usuario

        const fetchIncidents = async () => {
            try {
                setLoadingIncidents(true);
                let data: Incidente[] = [];

                // Si no tiene empresa ni establecimiento -> Trae todos (Super Admin / Global)
                if (!userLocalS.id_empresa && !userLocalS.id_establecimiento) {
                    data = await getIncidents();
                    console.log("entre en 1 ")
                }
                // Si tiene establecimiento -> Filtra por establecimiento
                else if (userLocalS.id_establecimiento) {
                    data = await getIncidentsbyEstablishment(userLocalS.id_establecimiento);
                    console.log("entre en 2 ")
                }
                // Si tiene empresa -> Filtra por empresa
                else if (userLocalS.id_empresa) {
                    data = await getIncidentsbyEnterprise(userLocalS.id_empresa); // CORREGIDO AQUÍ
                    console.log("entre en 3 ")
                }

                setIncidents(data || []);
            } catch (err) {
                console.error("Error cargando incidentes:", err);
            } finally {
                setLoadingIncidents(false);
            }
        };

        fetchIncidents();

        // Suscripción Realtime
        const channel = supabase
            .channel("incidentes-realtime")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "incidentes" },
                (payload) => {
                    console.log("cambio en tiempo real :", payload);
                    fetchIncidents();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userLocalS]); // Agregado userLocalS a las dependencias
    
    
    useEffect(() => {
        const fetchIncidentsByUser = async () => {
            try {
                const data = await getIncidentsReportbyUser(Number(id));
                const data2 = await getIncidentsResolvedbyUser(Number(id));
                const data3 = await getIncidentsByUser(Number(id));
                setIncidentsReportbyUser(data || []);
                setIncidentsResolvedbyUser(data2 || []);
                setIncidentsByUser(data3 || []);

            } catch (err) {
                console.error("Error cargando incidentes:", err);
            } finally {
                setLoadingIncidents(false);
            }
        };
        fetchIncidentsByUser();
    }, []);




    return { incidents, loadingIncidents, incidentsReportbyUser, incidentsResolvedbyUser, incidentsByUser };
}
