import { supabase } from "./supabase";

export interface StateIncident {
    id_estado_incidente: number;
    descripcion: string; created_at: string;       // timestamptz
    updated_at: string;       // timestamptz
}

export async function getStateIncident(): Promise<StateIncident[]> {
    const { data, error } = await supabase
        .from("estado_incidentes")
        .select("*");
    if (error) throw error;
    return data || [];
}

export async function getStateIncidentNeq(idestado:number): Promise<StateIncident[]> {
    const { data, error } = await supabase
        .from("estado_incidentes")
        .select("*")
         .neq('id_estado_incidente', idestado)
    if (error) throw error;
    return data || [];
}

export async function insertStateIncident(dato: StateIncident) {
    const { data, error } = await supabase
        .from("estado_incidentes")
        .insert([dato])
        .select();
    if (error) throw error;
    return data;
}

export async function updateStateIncident(id: number, payload: Partial<StateIncident>) {
    const { data, error } = await supabase
        .from("estado_incidentes")
        .update(payload)
        .eq("id_estado_incidente", id)
        .select();
    if (error) throw error;
    return data;
}