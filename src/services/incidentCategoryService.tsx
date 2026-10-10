import { supabase } from "./supabase";

export interface IncidentCategory {
  id_categoria_incidente: number;
  descripcion: string;
  created_at: string;       // timestamptz
  updated_at: string;       // timestamptz
}

export async function getIncidentCategory(): Promise<IncidentCategory[]> {
  const { data, error } = await supabase.from("categoria_incidentes").
    select("*");
  if (error) throw new Error(error.message);

  return data || [];
}

export async function insertIncidentCategory(dato: IncidentCategory) {
  const { data, error } = await supabase
    .from("categoria_incidentes")
    .insert([dato])
    .select();
  if (error) throw error;
  return data;
}

