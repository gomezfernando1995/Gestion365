import { supabase } from "./supabase";

export interface TimeEstablishment {
  id_horario: number;
  id_establecimiento: number;
  dia_semana: number;       // int2 → podés mapear 1=Lunes, 2=Martes, etc.
  hora_entrada: string;     // time → se maneja como string "HH:mm:ss"
  hora_salida: string;      // time → se maneja como string "HH:mm:ss"
  created_at: string;       // timestamptz → ISO string
  updated_at: string;       // timestamptz → ISO string
}

export async function getTimeEstablishment(): Promise<TimeEstablishment[]> {
  const { data, error } = await supabase
    .from("horarios_establecimiento")
    .select("*");
  if (error) throw error;
  return data || [];
}

export async function getHorariosByEstablecimiento(id_establecimiento: number): Promise<TimeEstablishment[]> {
  const { data, error } = await supabase
    .from("horarios_establecimiento")
    .select("*")
    .eq("id_establecimiento", id_establecimiento);

  if (error) throw error;
  return data || [];
}

export async function insertTimeEstablishment(dato:TimeEstablishment ) {
  const { data, error } = await supabase
    .from("horarios_establecimiento")
    .insert([dato])
    .select();
  if (error) throw error;
  return data;
}

export async function updateTimeEstablishment(id: number, payload: Partial<TimeEstablishment>) {
  const { data, error } = await supabase
    .from("horarios_establecimiento")
    .update(payload)
    .eq("id_horario", id)
    .select();
  if (error) throw error;
  return data;
}

