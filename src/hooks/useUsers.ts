import { useEffect, useState } from "react";
import { getUser, getUsers, getUsersByEstablishment } from "../services/usersService";
import { useParams } from "react-router-dom";
import { getAllRoles } from "../services/rolesService";
import { getEstablishmentAdminGlobal } from "../services/establishmentService";

// Helper extraído afuera del hook para mejor organización
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

  // 1. Inicialización síncrona y segura desde localStorage
  const [userLocalS] = useState<any>(() => {
    try {
      const item = localStorage.getItem("currentUser");
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error("Error parseando currentUser del localStorage:", e);
      return null;
    }
  });

  const { id } = useParams();

  // 2. Fetch de usuario individual por ID de URL
  useEffect(() => {
    const numericId = Number(id);

    if (!id || isNaN(numericId)) {
      setUser(null);
      setLoadingUser(false);
      return;
    }

    const fetchSingleUser = async () => {
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
    };

    fetchSingleUser();
  }, [id]);

  // 3. Fetch de listado inicial de usuarios y roles según perfil
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingUsers(true);
      try {
        const id_empresa = userLocalS?.id_empresa ?? null;
        const id_establecimiento = userLocalS?.id_establecimiento ?? null;

        const [usersData, rolesData] = await Promise.all([
          (async () => {
            if (!id_empresa && id_establecimiento) {
              return await getUsersByEstablishment(id_establecimiento);
            }
            if (id_empresa && !id_establecimiento) {
              return await getUsersByEnterpriseAndItsEstablishments(id_empresa);
            }
            // Si no hay empresa ni establecimiento (o userLocalS es null / Admin Global)
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
  }, [userLocalS]); // Se ejecuta al montar o si userLocalS llega a cambiar

  return {
    users,
    user,
    loadingUsers,
    loadingUser,
    userLocalS,
    allRoles
  };
}