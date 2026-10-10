import { supabase } from "./supabase";

export interface TypeTicket{
    id_tipo_ticket:number;
    descripcion:string;
    created_at:string;
    updated_at:string;
}

export async function getAllTypeTicket(): Promise<TypeTicket[]> {
  const { data, error } = await supabase
    .from("tipo_tickets")
    .select("*");
  if (error) throw error;
  return data || [];
}

export async function getTypeTicket(): Promise<TypeTicket[]> {
  const { data, error } = await supabase
    .from("tipo_tickets")
    .select("*");
  if (error) throw error;
  return data || [];
}

export async function insertTypeTicket(dat:TypeTicket) {
  const { data, error } = await supabase
    .from("tipo_tickets")
    .insert([dat])
    .select();
  if (error) throw error;
  return data;
}

export async function updateTypeTicket(id: number, payload: Partial<TypeTicket>) {
  const { data, error } = await supabase
    .from("tipo_tickets")
    .update(payload)
    .eq("id_tipo_ticket", id)
    .select();
  if (error) throw error;
  return data;
}

