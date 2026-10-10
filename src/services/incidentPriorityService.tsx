import { supabase } from "./supabase";

export interface IncidentPriority {

    id_prioridad_incidente: number;
    descripcion: string;
    created_at: string;    // timestamptz → ISO string
    updated_at: string;    // timestamptz → ISO string
}

export async function getAllIncidentPriority(): Promise<IncidentPriority[]> {
  const { data, error } = await supabase
    .from("prioridad_incidentes")
    .select("*");
  if (error) throw error;
  return data || [];
}

export async function updateIncidentPriority(idPrioridadIncidente: number, payload: Partial<IncidentPriority>) {
  const { data, error } = await supabase
    .from("prioridad_incidentes")
    .update(payload)
    .eq("id_prioridad_incidente", idPrioridadIncidente)
    .select();
  if (error) throw error;
  return data;
}