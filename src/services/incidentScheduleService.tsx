import { supabase } from "./supabase";

export interface IncidentSchedule {
  id_incidente_agenda: number;
  id_incidente: number;
  fecha_agenda: string;      // date → se maneja como string ISO "YYYY-MM-DD"
  horario_inicio: string;    // time → string "HH:mm:ss"
  horario_fin: string;       // time → string "HH:mm:ss"
  created_at: string;        // timestamptz → ISO string
  updated_at: string;        // timestamptz → ISO string
  delete_at:string;
}

export async function getAllAgenda(): Promise<IncidentSchedule[]> {
  const { data, error } = await supabase
    .from("incidente_agenda")
    .select("*");
  if (error) throw error;
  return data || [];
}

export async function getOneAgenda(id_incidente_agenda: number): Promise<IncidentSchedule[]> {
  const { data, error } = await supabase
    .from("incidente_agenda")
    .select("*")
    .eq("id_incidente_agenda", id_incidente_agenda);

  if (error) throw error;
  return data || [];
}

export async function getAgendaByIncidente(id_incidente: number): Promise<IncidentSchedule[]> {
  const { data, error } = await supabase
    .from("incidente_agenda")
    .select("*")
    .eq("id_incidente", id_incidente);

  if (error) throw error;
  return data || [];
}

export async function insertIncidentSchedule(dato:IncidentSchedule ) {
  const { data, error } = await supabase
    .from("incidente_agenda")  
    .insert([dato])
    .select();
  if (error) throw error;
  return data;
}

export async function deleteSoftIncidentSchedule(id: number) {
  const { data, error } = await supabase
    .from("")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id_incidente_agenda", id)
    .select();
  if (error) throw error;
  return data;
}