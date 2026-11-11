import type { Station } from "./stationsService";
import { supabase } from "./supabase";

export interface Sector {
    id_sector: number;
    nombre: string;
    ubicacion: string;
    id_establecimiento: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;

    tipo?: string;
    capacidad?: string | number;
    coordinador?: string;
    puestos?: Station[] | null; //
}

export interface SectorInsert{ 
    nombre:string;
    ubicacion:string;
    id_establecimiento:number;
}

export interface SectorModify{
    nombre:string;
    ubicacion:string;
    updated_at:string;
    deleted_at?:string | null; // Unificado a deleted_at

    
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



export async function deleteSoftSector(id: number) {
  const { data, error } = await supabase
    .from("sectores")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id_sector", id)
    .select();
  if (error) throw error;
  return data;
}

export async function updateSector(id: number, payload: Partial<SectorModify>) {
  const { data, error } = await supabase
    .from("sectores")
    .update(payload)           // Objeto con los campos que querés cambiar
    .eq("id_sector", id)       // Condición para saber qué fila actualizar
    .select();                 // Opcional: devuelve el registro actualizado

  if (error) throw error;
  return data;
}

