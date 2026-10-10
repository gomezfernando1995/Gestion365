import { supabase } from "./supabase";

export interface Province {
  idprovincia: number;
  descripcion: string;
  orden: number;
  idpais: number;
  created_at: string;   // timestamp → ISO string
  updated_at: string;   // timestamp → ISO string
}

export async function getAllProvinces(): Promise<Province[]> {
  const { data, error } = await supabase
    .from("provincias")
    .select("*");
  if (error) throw error;
  return data || [];
}

export async function getProvincesByCountry(idCountry:number): Promise<Province[]> {
  const { data, error } = await supabase
    .from("provincias")
    .select("*")
    .eq("idpais",idCountry)
  if (error) throw error;
  return data || [];
}

