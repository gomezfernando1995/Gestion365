import { useEffect, useState } from "react";
import { fetchTopUsersByRole, type TopUser } from "../services/TopUserService"; 

export function useTopUsers() {
    const [topUsers, setTopUsers] = useState<TopUser[]>([]);
    const [loadingTopUsers, setLoadingTopUsers] = useState(true);
    const userLocalS = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const idEmpresa = userLocalS?.id_empresa;
    const idEstablecimiento = userLocalS?.id_establecimiento;
    const uid = userLocalS?.uid || userLocalS?.id;

    useEffect(() => {
        if (!uid && !idEmpresa && !idEstablecimiento) {
            setLoadingTopUsers(false);
            return;
        }

        const getTopUsers = async () => {
            try {
                setLoadingTopUsers(true);
                const data = await fetchTopUsersByRole(userLocalS);
                setTopUsers(data);
            } catch (err) {
                console.error("Error en useTopUsers:", err);
            } finally {
                setLoadingTopUsers(false);
            }
        };

        getTopUsers();
        
    }, [uid, idEmpresa, idEstablecimiento]); 

    return { topUsers, loadingTopUsers };
}