import { supabase } from "./supabase";

export interface Localities {
  idlocalidad: number;
  idprovincia: number;
  descripcion: string;
  codigopostal: number;
  idpartido: number;
  created_at: string;   
  updated_at: string;  
  latitud: number;      
  longitud: number;    
  tipolocalidad: string;
  activo: boolean;
}

export async function getAllLocalities(): Promise<Localities[]> {
  const { data, error } = await supabase
    .from("localidades")
    .select("*");
  if (error) throw error;
  return data || [];
}

export async function getLocalitiesByProvince(id_provincia: number): Promise<Localities[]> {
  const { data, error } = await supabase
    .from("localidades")
    .select("*")
    .eq("idprovincia", id_provincia);

  if (error) throw error;
  return data || [];
}

export async function getLocalitiesByZipCode(idpartido: number): Promise<Localities[]> {
  const { data, error } = await supabase
    .from("localidades")
    .select("*")
    .eq("idpartido", idpartido);

  if (error) throw error;
  return data || [];
}

export async function insertLocalities(dato:Localities) {
  const { data, error } = await supabase
    .from("localidades")
    .insert([dato])
    .select();
  if (error) throw error;
  return data;
}

export async function updateLocalities(idLocalidad: number, payload: Partial<Localities>) {
  const { data, error } = await supabase
    .from("localidades")
    .update(payload)
    .eq("idlocalidad", idLocalidad)
    .select();
  if (error) throw error;
  return data;
}