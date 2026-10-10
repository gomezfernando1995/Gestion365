import { supabase } from "./supabase";

export interface StateUser {
    idestadousuario: number;
    descripcion: string;
    created_at: string;
    updated_at: string;
}

export async function getStateUser(): Promise<StateUser[]> {
    const { data, error } = await supabase
        .from("estado_usuarios")
        .select("*");
    if (error) throw error;
    return data || [];
}

export async function insertStateUser(dato: StateUser) {
    const { data, error } = await supabase
        .from("estado_usuarios")
        .insert([dato])
        .select();
    if (error) throw error;
    return data;
}

export async function updateStateUser(id: number, payload: Partial<StateUser>) {
  const { data, error } = await supabase
    .from("estado_usuarios")
    .update(payload)
    .eq("idestadousuario", id)
    .select();
  if (error) throw error;
  return data;
}
