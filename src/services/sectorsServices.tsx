import { supabase } from "./supabase";

export interface Sector{
    id_sector:number;
    nombre:string;
    ubicacion:string;
    id_establecimiento:number;
    created_at:string;
    updated_at:string;
    delete_at:string;
}

export interface SectorInsert{
    
    nombre:string;
    ubicacion:string;
    id_establecimiento:number;
    
}

export async function getAllSectors(): Promise<Sector[]> {
  const { data, error } = await supabase
    .from("sectores")
    .select("*");
  if (error) throw error;
  return data || [];
}

export async function getSector(id:number): Promise<Sector[]> {
  const { data, error } = await supabase
    .from("sectores")
    .select("*")
    .eq("id_sector",id)
  if (error) throw error;
  return data || [];
}

export async function getSectorByEstablishment(id:number): Promise<Sector[]> {
  const { data, error } = await supabase
    .from("sectores")
    .select("*")
    .eq("id_establecimiento",id)
  if (error) throw error;
  return data || [];
}

export async function insertSector(dat:SectorInsert ) {
  const { data, error } = await supabase
    .from("sectores")
    .insert([dat])
    .select();
  if (error) throw error;
  return data;
}

export async function updateSector(id: number, payload: Partial<Sector>) {
  const { data, error } = await supabase
    .from("sectores")
    .update(payload)
    .eq("id_sector", id)
    .select();
  if (error) throw error;
  return data;
}

export async function deleteSoftSector(id: number) {
  const { data, error } = await supabase
    .from("sectores")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id_sector", id)
    .select();
  if (error) throw error;
  return data;
}

