import type { Equipment } from "./equipmentService";
import { supabase } from "./supabase";

export interface Station {
  id_puesto: number;
  puesto_red: string;
  telefono: string;
  descripcion: string;
  id_sector: number;
  created_at: string;   // timestamptz → ISO string
  updated_at: string;   // timestamptz → ISO string

  nombre?: string;
  equipos?: Equipment[];
}

export interface newStation {
  puesto_red: string;
  telefono: string;
  descripcion: string;
  id_sector: number;
}

export async function getStation(idStation: number): Promise<Station[]> {
  const { data, error } = await supabase
    .from("puestos")
    .select("*")
    .eq("id_puesto", idStation)
  if (error) throw error;
  return data || [];
}

export async function getAllStations(): Promise<Station[]> {
  const { data, error } = await supabase
    .from("puestos")
    .select("*");
  if (error) throw error;
  return data || [];
}

export async function getStationBySector(idsector: number): Promise<Station[]> {
  const { data, error } = await supabase
    .from("puestos")
    .select("*")
    .eq("id_sector", idsector)

  if (error) throw error;
  return data || [];
}

// traer todos los puestos filtrados a partir de un array de ids de sectores
export async function getStationsBySectors(idSectores: number[]): Promise<Station[]> {
  if (!idSectores || idSectores.length === 0) return [];

  const { data, error } = await supabase
    .from("puestos")
    .select("*")
    .in("id_sector", idSectores);

  if (error) throw error;
  return data || [];
}

export async function insertStation(dat: newStation) {
  const { data, error } = await supabase
    .from("puestos")
    .insert([dat])
    .select();
  if (error) throw error;
  return data;
}

export async function updateStation(idStation: number, payload: Partial<Station>) {
  const { data, error } = await supabase
    .from("puestos")
    .update(payload)
    .eq("id_puesto", idStation)
    .select();
  if (error) throw error;
  return data;
}

