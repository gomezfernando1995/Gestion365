import { useEffect, useState, useCallback } from "react";
import { getUser, getUsers, getUsersByEstablishment } from "../services/usersService";
import { useParams } from "react-router-dom";
import { getAllRoles } from "../services/rolesService";
import { getEstablishmentAdminGlobal } from "../services/establishmentService";
import { getCurrentUserLocalStorage } from "../utils/auth";

export const getUsersByEnterpriseAndItsEstablishments = async (idEmpresa: number) => {
  try {
    const [allUsers, allEstablishments] = await Promise.all([
      getUsers(),
      getEstablishmentAdminGlobal()
    ]);

    const companyEstablishmentIds = (allEstablishments || [])
      .filter((est: any) => est.id_empresa === idEmpresa)
      .map((est: any) => est.id_establecimiento);

    return (allUsers || []).filter((u: any) => {
      const belongsToCompanyDirectly = u.id_empresa === idEmpresa;
      const belongsToCompanyEstablishment = companyEstablishmentIds.includes(u.id_establecimiento);
      return belongsToCompanyDirectly || belongsToCompanyEstablishment;
    });
  } catch (error) {
    console.error("Error al obtener usuarios de la empresa y sus establecimientos:", error);
    throw error;
  }
};

export function useUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [allRoles, setAllRoles] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingUser, setLoadingUser] = useState(false);

  const userLocalS = getCurrentUserLocalStorage();
  const id_empresa = userLocalS?.id_empresa ?? null;
  const id_establecimiento = userLocalS?.id_establecimiento ?? null;
  const { id } = useParams();

  // 1. Función reutilizable para refrescar un solo usuario
  const fetchSingleUser = useCallback(async () => {
    const numericId = Number(id);
    if (!id || isNaN(numericId)) {
      setUser(null);
      setLoadingUser(false);
      return;
    }

    setLoadingUser(true);
    try {
      const data = await getUser(numericId);
      setUser(Array.isArray(data) ? data[0] || null : data);
    } catch (error) {
      console.error("Error al obtener detalle del usuario:", error);
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  }, [id]);

  // 2. Fetch de usuario individual al cambiar el ID de la URL
  useEffect(() => {
    fetchSingleUser();
  }, [fetchSingleUser]);

  // 3. Fetch de listado inicial de usuarios y roles según perfil jerárquico
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingUsers(true);
      try {
        const [usersData, rolesData] = await Promise.all([
          (async () => {
            if (id_empresa) {
              return await getUsersByEnterpriseAndItsEstablishments(id_empresa);
            }
            if (id_establecimiento) {
              return await getUsersByEstablishment(id_establecimiento);
            }
            return await getUsers();
          })(),
          getAllRoles()
        ]);

        setUsers(usersData || []);
        setAllRoles(rolesData || []);
      } catch (err) {
        console.error("Error cargando datos iniciales:", err);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchInitialData();
  }, [id_empresa, id_establecimiento]);

  return {
    users,
    user,
    loadingUsers,
    loadingUser,
    userLocalS,
    allRoles,
    refetchUser: fetchSingleUser // 👈 Exportamos esta función para usarla en el componente padre
  };
}