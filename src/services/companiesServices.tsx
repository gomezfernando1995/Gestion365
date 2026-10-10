import { supabase } from "./supabase";

export interface Companie{
  id_empresa: number;
  nombre: string;
  descripcion?: string;
  created_at: number;
  updated_at: number;
  delete_at: string;
}

export async function getAllCompanies(): Promise<Companie[]> {
  const { data, error } = await supabase
    .from("empresas")
    .select("*");
  if (error) throw error;
  return data || [];
}

export async function getCompanie(id: number): Promise<Companie[]> {
  const { data, error } = await supabase
    .from("empresas")
    .select("*")
    .eq("id_empresa", id)
  if (error) throw error;
  return data || [];
}

export async function insertCompanie(dat: Companie) {
  const { data, error } = await supabase
    .from("empresas")
    .insert([dat])
    .select();
  if (error) throw error;
  return data;
}

export async function updateCompanie(id: number, payload: Partial<Companie>) {
  const { data, error } = await supabase
    .from("empresas")
    .update(payload)
    .eq("id_empresa", id)
    .select();
  if (error) throw error;
  return data;
}

export async function deleteSoftCompanie(id: number) {
  const { data, error } = await supabase
    .from("empresas")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id_empresa", id)
    .select();
  if (error) throw error;
  return data;
}