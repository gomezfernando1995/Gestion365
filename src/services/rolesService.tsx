import { supabase } from "./supabase";

export interface Roles{
    id_rol:number;
    nombre:string;
    descripcion:string;
    created_at:string;
    updated_at:string;
    id_tipo_rol:number;
}


export async function getAllRoles(): Promise<Roles[]> {
  const { data, error } = await supabase
    .from("roles")
    .select("*");
  if (error) throw error;
  return data || [];
}

export async function getRolesByType(id:number): Promise<Roles[]> {
  const { data, error } = await supabase
    .from("roles")
    .select("*")
    .eq("id_tipo_rol",id)
  if (error) throw error;
  return data || [];
}
