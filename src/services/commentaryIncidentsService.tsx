import { supabase } from "./supabase";

export interface CommentaryIncidents {
  id_comentario: number;
  comentario: string;
  fecha_hora: number;
  id_usuario: number;
  id_incidente: number;
  id_tipo_comentario?: number;
  created_at?: number;
  updated_at?: number;
  delete_at: string;
  votoPositivo:number;
  votoNegativo:number;
  visto:number;

  usuarios?: {
    idUsuario: number;
    nombre: string;
    apellido: string;
    correo: string;
    usuario: string;
    img: string;
    idrol?: number;
    id_empresa?: number | null;
    id_establecimiento?: number | null;
  };
}

export type NewCommentaryIncident = {
  id_tipo_comentario: number;
  comentario: string;
  id_incidente: number;
  id_usuario: number;
  fecha_hora: string;
  votoPositivo: number; 
  votoNegativo: number;
  visto: number;
};

export async function getAllCommentary(): Promise<CommentaryIncidents[]> {
  const { data, error } = await supabase.from("comentarios_incidente").select("*");
  if (error) throw new Error(error.message);
  return data || []
}

export async function getCommentaryByIncident(id_incidente: number): Promise<CommentaryIncidents[]> {
  const { data, error } = await supabase
    .from("comentarios_incidente")
    .select("*,usuarios!fk_usuario(*),tipo_comentarios!fk_tipo_comentario(*)")
    .eq("id_incidente", id_incidente)
    .order("created_at", { ascending: true }); // opcional: orden cronológico

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getCommentaryByUser(id_usuario: number): Promise<CommentaryIncidents[]> {
  const { data, error } = await supabase
    .from("comentarios_incidente")
    .select("*")
    .eq("id_usuario", id_usuario);

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getCommentaryByIncidentAndUser(
  id_incidente: number,
  id_usuario: number
): Promise<CommentaryIncidents[]> {
  const { data, error } = await supabase
    .from("comentarios_incidente")
    .select("*")
    .eq("id_incidente", id_incidente)
    .eq("id_usuario", id_usuario);

  if (error) throw new Error(error.message);
  return data || [];
}

export async function insertCommentaryIncident(commentary: NewCommentaryIncident) {
  const { data, error } = await supabase
    .from("comentarios_incidente")
    .insert([commentary])
    .select();
  if (error) throw error;
  return data;
}

export async function updateCommentaryIncidents(id: number, payload: Partial<CommentaryIncidents>) {
  const { data, error } = await supabase
    .from("comentarios_incidente")
    .update(payload)
    .eq("id_comentario", id)
    .select();
  if (error) throw error;
  return data;
}

export async function deleteCommentaryIncidents(id: number) {
  const { data, error } = await supabase
    .from("comentarios_incidente")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id_comentario", id)
    .select();

  if (error) throw error;
  return data;
}


export async function upVoteCommentary(id: number, currentValue: number) {
  const { data, error } = await supabase
    .from("comentarios_incidente")
    .update({ votoPositivo: (currentValue ?? 0) + 1 })
    .eq("id_comentario", id)
    .select();

  if (error) {
    console.error("Error en update:", error);
    throw error;
  }
  console.log("Resultado update:", data);
  return data;
}

export async function downVoteCommentary(id: number, currentValue: number) {
  const { data, error } = await supabase
    .from("comentarios_incidente")
    .update({ "votoNegativo": currentValue + 1 })
    .eq("id_comentario", id)
    .select();

  if (error) throw error;
  return data;
}