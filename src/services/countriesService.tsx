import { supabase } from "./supabase";

export interface Countries {
  idpais: number;
  descripcion: string;
  orden: number;
  activo: boolean;             // int4 → si lo usás como boolean, podés mapear 0/1
  banderapequena: string;     // URL o path de la bandera
  created_at: string;         // timestamp → ISO string
  updated_at: string;         // timestamp → ISO string
}

export async function getCountries(): Promise<Countries[]> {
  const { data, error } = await supabase
    .from("paises")
    .select("*");
  if (error) throw error;
  return data || [];
}

export async function updateCountries(idpais: number, payload: Partial<Countries>) {
  const { data, error } = await supabase
    .from("paises")
    .update(payload)
    .eq("idpais", idpais)
    .select();
  if (error) throw error;
  return data;
}

export async function insertCountries(dato:Countries ) {
  const { data, error } = await supabase
    .from("paises")
    .insert([dato])
    .select();
  if (error) throw error;
  return data;
}