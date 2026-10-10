import { supabase } from "./supabase";

export interface TypeEquipment{
    id_tipo_equipo:number;
    descripcion:string;
    created_at:string;
    updated_at:string;
}

export async function getAllTypeEquipment(): Promise<TypeEquipment[]> {
  const { data, error } = await supabase
    .from("tipo_equipos")
    .select("*");
  if (error) throw error;
  return data || [];
}

export async function insertTypeEquipment(dat:TypeEquipment ) {
  const { data, error } = await supabase
    .from("tipo_equipos")
    .insert([dat])
    .select();
  if (error) throw error;
  return data;
}

export async function updateTypeEquipment(id: number, payload: Partial<TypeEquipment>) {
  const { data, error } = await supabase
    .from("tipo_equipos")
    .update(payload)
    .eq("id_", id)
    .select();
  if (error) throw error;
  return data;
}

