import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  getEstablishmentAdminGlobal, 
  getEstablishmentByID, 
  getEstablishmentsAdminEnterprise 
} from "../services/establishmentService";
import { getIncidentsReportbyEstablishment } from "../services/incidentsService";
import { getUsersByEstablishment } from "../services/usersService";
import { getSectorByEstablishment } from "../services/sectorsServices";
import { getStationsBySectors } from "../services/stationsService";
import { getAllEquipmentsByStation } from "../services/equipmentService";
import { getCurrentUserLocalStorage } from "../utils/auth";

export function useEstablishment() {
  const [establishments, setEstablishments] = useState<any[]>([]);
  const [oneEstablishment, setOneEstablishment] = useState<any>(null); // Corregido a null
  const [incidentsByEstablishment, setIncidentsByEstablishment] = useState<any[]>([]);
  const [usersByEstablishment, setUsersByEstablishment] = useState<any[]>([]);
  const [sectorsByEstablishment, setSectorsByEstablishment] = useState<any[]>([]);
  const [stationBySector, setStationBySector] = useState<any[]>([]);
  const [equipmentsByStation, setEquipmentsByStation] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(true);

const userLocalStorage = getCurrentUserLocalStorage();
  const idRol = userLocalStorage?.idrol;
  const idEmpresa = userLocalStorage?.id_empresa;

  const { id } = useParams();
  const idEstablecimiento = Number(id);

  // 1. Cargar lista de establecimientos según rol 
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (idRol === 6) {
          const data = await getEstablishmentAdminGlobal(); // Admin Global ve todos
          setEstablishments(data || []);
        } else if (idRol === 13) {
          const data = await getEstablishmentsAdminEnterprise(idEmpresa); // Solo de su empresa
          setEstablishments(data || []);
        } else {
          setHasPermission(false);
        }
      } catch (err) {
        console.error("Error cargando establecimientos:", err);
      } finally {
        setLoading(false);
      }
    };

    if (idRol) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [idRol, idEmpresa]); 

  // 2. Cargar detalle de un establecimiento específico cuando id cambia
  useEffect(() => {
    if (!id || isNaN(idEstablecimiento)) {
      return;
    }
    const fetchEstablishmentByID = async () => {
      try {
        setLoading(true);
        const [dataEst, dataIncidents, dataUsers, dataSectors, dataEquipments] = await Promise.all([
          getEstablishmentByID(idEstablecimiento),
          getIncidentsReportbyEstablishment(idEstablecimiento),
          getUsersByEstablishment(idEstablecimiento),
          getSectorByEstablishment(idEstablecimiento),
          getAllEquipmentsByStation(idEstablecimiento),
        ]);

        const sectores = dataSectors || [];
        const idsSectores = sectores.map((s: any) => s.id_sector);

        // Petición secundaria dependiente de los sectores obtenidos
        let puestos: any[] = [];
        if (idsSectores.length > 0) {
          puestos = await getStationsBySectors(idsSectores);
        }

        // Seteo de estados
        setOneEstablishment(dataEst?.[0] || null);
        setIncidentsByEstablishment(dataIncidents || []);
        setUsersByEstablishment(dataUsers || []);
        setSectorsByEstablishment(sectores);
        setEquipmentsByStation(dataEquipments || []);
        setStationBySector(puestos || []);

      } catch (error) {
        console.error("Error al cargar detalles del establecimiento:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEstablishmentByID();
  }, [idEstablecimiento]);

  return { 
    establishments, 
    loading, 
    hasPermission, 
    userLocalStorage, 
    usersByEstablishment, 
    oneEstablishment, 
    incidentsByEstablishment, 
    sectorsByEstablishment, 
    stationBySector, 
    equipmentsByStation 
  };
}