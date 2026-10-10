import { supabase } from "./supabase";

export interface Equipment {
  id_equipo: number;
  nombre: string;
  marca: string;
  modelo: string;
  numero_serie: string;
  descripcion: string;
  fecha_alta: string;       // date → lo podés manejar como string ISO
  fecha_baja?: string | null; // puede ser null si el equipo sigue activo
  id_estado_equipo: number;
  id_puesto: number;
  id_tipo_equipo: number;
  created_at: string;       // timestamptz
  updated_at: string;       // timestamptz
}

export interface createEquipment {
  nombre: string;
  marca: string;
  modelo: string;
  numero_serie: string;
  descripcion: string;
  id_estado_equipo: number;
  id_puesto: number;
  id_tipo_equipo: number;
 
}

export async function getAllEquipments(): Promise<Equipment[]> {
  const { data, error } = await supabase
    .from("equipos")
    .select("*");
  if (error) throw error;
  return data || [];
}


export async function getAllEquipmentsByStation(idPuesto:number): Promise<Equipment[]> {
  const { data, error } = await supabase
    .from("equipos")
    .select("*")
    .eq("id_puesto",idPuesto)
  if (error) throw error;
  return data || [];
}

export async function insertEquipment(equipo:createEquipment ) {
  const { data, error } = await supabase
    .from("equipos")
    .insert([equipo])
    .select();
  if (error) throw error;
  return data;
}

export async function updateEquipment(id: number, payload: Partial<Equipment>) {
  const { data, error } = await supabase
    .from("equipos")
    .update(payload)
    .eq("id_equipo", id)
    .select();
  if (error) throw error;
  return data;
}