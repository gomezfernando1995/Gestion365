import { supabase } from "./supabase";

export interface District {
  id_partido: number;
  idprovincia: number;
  descripcion: string;
  codigo_partido: string;
  activo: number;        // int4 → suele usarse como 0/1, podés mapearlo a boolean
  created_at: string;    // timestamptz → ISO string
  updated_at: string;    // timestamptz → ISO string
}

export async function getDistrinct(): Promise<District[]> {
  const { data, error } = await supabase
    .from("partidos")
    .select("*");
  if (error) throw error;
  return data || [];
}

export async function getDistrinctByProvincia(id_provincia: number): Promise<District[]> {
  const { data, error } = await supabase
    .from("partidos")
    .select("*")
    .eq("idprovincia", id_provincia);

  if (error) throw error;
  return data || [];
}

export async function insertDistrict(dato:District ) {
  const { data, error } = await supabase
    .from("partidos")
    .insert([dato])
    .select();
  if (error) throw error;
  return data;
}

export async function updateDistrict(idpartido: number, payload: Partial<District>) {
  const { data, error } = await supabase
    .from("partidos")
    .update(payload)
    .eq("id_partido", idpartido)
    .select();
  if (error) throw error;
  return data;
}



