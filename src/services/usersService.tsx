import { supabase } from "./supabase";
import type { Usuario } from "../types/Usuario";

//OBTENCION DE USUARIOS
export async function getUsers(): Promise<Usuario[]> {
  const { data, error } = await supabase
    .from("usuarios")
    .select(`
    *,
    roles!fk_rol(id_rol, nombre, descripcion),
    estado_usuarios!fk_estado_usuario(*),
    empresas!usuarios_id_empresa_fkey(*),
    establecimientos!usuarios_id_establecimiento_fkey(*)
  `);
  if (error) throw new Error(error.message);
  return data || [];
}
// OBTENER USUARIO ESPECIFICO

export async function getUser(id: number): Promise<Usuario[]> {
  const { data, error } = await supabase
    .from("usuarios")
    .select(`
    *,
    roles!fk_rol(id_rol,nombre, descripcion),
    estado_usuarios!fk_estado_usuario(*),
    empresas!usuarios_id_empresa_fkey(*),
    establecimientos!usuarios_id_establecimiento_fkey(*),
    localidades!fk_localidad(*),
    paises!fk_pais(*)
  `)
    .eq("idusuario", id)
  if (error) throw new Error(error.message);
  return data || [];
}

//OBTENER USUARIOS POR ESTABLECIMIENTO

export async function getUsersByEstablishment(id: number): Promise<Usuario[]> {
  const { data, error } = await supabase
    .from("usuarios")
    .select(`
    *,
    roles!fk_rol(id_rol,nombre, descripcion),
    estado_usuarios!fk_estado_usuario(*),
    empresas!usuarios_id_empresa_fkey(*),
    establecimientos!usuarios_id_establecimiento_fkey(*),
    localidades!fk_localidad(*),
    paises!fk_pais(*)
  `)
    .eq("id_establecimiento", id)
  if (error) throw new Error(error.message);
  return data || [];
}


//CREACION DE USUARIO
export async function createUser(user: Usuario) {
  const { data, error } = await supabase.from("usuarios").insert(user);
  if (error) throw new Error(error.message);
  return data;
}
//ACTUALIZACION DE USUARIOS
export async function updateUser(id: number | string, user: Partial<Usuario>) {
  const { data, error } = await supabase.from("usuarios").update(user).eq("idusuario", id);
  if (error) throw new Error(error.message);
  return data;
}

// CONTADOR DE UUSUARIOS
export async function getUsersCount(): Promise<number> {
  const { count, error } = await supabase
    .from("usuarios")
    .select("*", { count: "exact", head: true });

  if (error) throw new Error(error.message);
  return count || 0;
}

