import { supabase } from "./supabase";

export interface TypeOfComment{
    id_tipo_comentario:number;
    descripcion:string;
    created_at:string;
    updated:string;
}
export async function getAllTypeOfComment(): Promise<TypeOfComment[]> {
  const { data, error } = await supabase
    .from("tipo_comentarios")
    .select("*");
  if (error) throw error;
  return data || [];
}

export async function getTypeOfComment(id:number): Promise<TypeOfComment[]> {
  const { data, error } = await supabase
    .from("tipo_comentarios")
    .select("*")
    .eq("id_tipo_comentario",id)
  if (error) throw error;
  return data || [];
}

export async function update(id: number, payload: Partial<TypeOfComment>) {
  const { data, error } = await supabase
    .from("tipo_comentarios")
    .update(payload)
    .eq("id_tipo_comentario", id)
    .select();
  if (error) throw error;
  return data;
}


