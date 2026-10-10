import { supabase } from "./supabase";

export interface StateEquipment {
  id_estado_equipo: number;
  descripcion: string
  created_at: string;       // timestamptz
  updated_at: string;       // timestamptz
}

export async function getStateEquipment(): Promise<StateEquipment[]> {
  const { data, error } = await supabase
    .from("estado_equipos")
    .select("*");
  if (error) throw error;
  return data || [];
}

export async function insertStateEquipment(dato: StateEquipment) {
  const { data, error } = await supabase
    .from("estado_equipos")
    .insert([dato])
    .select();
  if (error) throw error;
  return data;
}

export async function updateStateEquipment(id: number, payload: Partial<StateEquipment>) {
  const { data, error } = await supabase
    .from("estado_equipos")
    .update(payload)
    .eq("id_estado_equipo", id)
    .select();
  if (error) throw error;
  return data;
}