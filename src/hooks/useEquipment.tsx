import { useEffect, useState } from "react";
import { getStateEquipment } from "../services/stateEquimentService";
import { getAllTypeEquipment } from "../services/typeEquipmentService";
import { getAllEquipments } from "../services/equipmentService";

export function useEquipment() {

    const [estateEquipment, setEstateEquipment] = useState<any[]>([]);
    const [typeEquipment , setTypeEquipment ] = useState<any[]>([]);
    const [equipments , setEquipments ] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);


    

    useEffect(() => {
        const fetchEstateEquipment = async () => {
            try {
                const data = await getStateEquipment();
                setEstateEquipment(data || []);
              
            } catch (err) {
                console.error("Error cargando incidentes:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEstateEquipment();
    }, [estateEquipment]);

    useEffect(() => {
        const fetchTypeEquipment = async () => {
            try {
                const data = await getAllTypeEquipment();
                setTypeEquipment(data || []);
              
            } catch (err) {
                console.error("Error cargando incidentes:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTypeEquipment();
    }, [typeEquipment]);

  useEffect(() => {
        const fetchTypeEquipment = async () => {
            try {
                const data = await getAllEquipments();
                setEquipments(data || []);
              
            } catch (err) {
                console.error("Error cargando incidentes:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTypeEquipment();
    }, [equipments]);

    


  return{estateEquipment,loading,typeEquipment,equipments}
}
