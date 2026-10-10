import { useEffect, useState } from "react";
import { getSectorByEstablishment } from "../services/sectorsServices";

export function useSectors(idEstablecimiento: number) {

    const [stationBySector, setSectorByEstablishment] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        if (!idEstablecimiento || isNaN(idEstablecimiento)) {
            return;
        }
        const fetchSectors = async () => {
            try {
                const data = await getSectorByEstablishment(idEstablecimiento);
                setSectorByEstablishment(data || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchSectors();
    }, [stationBySector]);

    return{stationBySector,loading}
}