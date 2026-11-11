import { supabase } from "./supabase";


export interface TopUser {
    id_usuario_asignado: number | string;
    total_incidentes: number;
    id_empresa?: number;
    id_establecimiento?: number;
    nombre_usuario?:string;
}

export async function fetchTopUsersByRole(userLocalS: any): Promise<TopUser[]> {
    if (!userLocalS) return [];

    let query = supabase.from('vista_top_usuarios_agrupado').select('*');

    if (userLocalS.id_establecimiento) {
        query = query.eq('id_establecimiento', userLocalS.id_establecimiento);
    } else if (userLocalS.id_empresa) {
        query = query.eq('id_empresa', userLocalS.id_empresa);
    }

    const { data, error } = await query.order('total_incidentes', { ascending: false });

    if (error) {
        console.error("Error al obtener el top de usuarios:", error);
        throw error;
    }

    return data || [];
}

