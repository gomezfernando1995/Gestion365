import { useEffect, useState } from "react";
import { getEstablishmentAdminGlobal, getEstablishmentByID, getEstablishmentsAdminEnterprise } from "../services/establishmentService";
import { useParams } from "react-router-dom";
import { getIncidentsReportbyEstablishment } from "../services/incidentsService";
import { getUsersByEstablishment } from "../services/usersService";
import { getSectorByEstablishment } from "../services/sectorsServices";
import { getStationsBySectors } from "../services/stationsService";
import { getAllEquipmentsByStation } from "../services/equipmentService";

export function useEstablishment() {
    const [establishments, setEstablishments] = useState<any[]>([]);
    const [oneEstablishment, setOneEstablishment] = useState<any>([]);
    const [incidentsByEstablishment, setIncidentsByEstablishment] = useState<any[]>([]);
    const [usersByEstablishment, setUsersByEstablishment] = useState<any[]>([]);
    const [sectorsByEstablishment, setSectorsByEstablishment] = useState<any[]>([]);
    const [stationBySector, setStationBySector] = useState<any[]>([]);
    const [equipmentsByStation, setEquipmentsByStation] = useState<any[]>([]);


    const [loading, setLoading] = useState(true);
    const userLocalStorage = JSON.parse(localStorage.getItem("currentUser")!)
    const [hasPermission, setHasPermission] = useState(true);
    const { id } = useParams();
    const idEstablecimiento = Number(id);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                if (userLocalStorage.idrol === 6) {
                    const data = await getEstablishmentAdminGlobal(); // ve todos los establecimientos
                    setEstablishments(data || []);
                } else if (userLocalStorage.idrol === 13) {
                    const data = await getEstablishmentsAdminEnterprise(userLocalStorage.id_empresa); // solo los establecimineto que maneja la empresa
                    setEstablishments(data || []);
                } else {
                    setHasPermission(false); // 👈 marcamos que no tiene permisos
                }

            } catch (err) {
                console.error("Error cargando establecimientos:", err);
            } finally {
                setTimeout(() => setLoading(false), 600);
            }
        };

        if (userLocalStorage) { // 👈 solo corre cuando ya existe
            fetchUsers();
        }
    }, [userLocalStorage]);



    useEffect(() => {

        if (!id || isNaN(idEstablecimiento)) {
            return;
        }
        const fetchEstablishmentByID = async () => {
            try {
                // 1. Peticiones directas en paralelo
                const [data, data1, data3, data4] = await Promise.all([
                    getEstablishmentByID(idEstablecimiento),
                    getIncidentsReportbyEstablishment(idEstablecimiento),
                    getUsersByEstablishment(idEstablecimiento),
                    getSectorByEstablishment(idEstablecimiento),
                ]);
                const sectores = data4 || [];
                const idsSectores = sectores.map((s: any) => s.id_sector);
                const puestos = await getStationsBySectors(idsSectores);
                setStationBySector(puestos);
                
                const data6 = await getAllEquipmentsByStation(Number(id))

                setOneEstablishment(data[0] || null);
                setUsersByEstablishment(data3 || []);
                setIncidentsByEstablishment(data1 || []);
                setSectorsByEstablishment(data4 || []);
                setStationBySector(puestos || []);
                setEquipmentsByStation(data6 || []);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchEstablishmentByID();
    }, [id]);

    return { establishments, loading, hasPermission, userLocalStorage, usersByEstablishment, oneEstablishment, incidentsByEstablishment, sectorsByEstablishment, stationBySector, equipmentsByStation };
}
