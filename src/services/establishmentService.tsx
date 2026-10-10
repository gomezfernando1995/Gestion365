import { supabase } from "./supabase";

export interface Establishment {
  id_establecimiento?: number;
  nombre: string;
  calle: string;
  altura: string;
  telefono: string;
  correo: string;
  cuit: string;
  descripcion: string;
  sitioweb: string;
  id_pais?: number;
  id_provincia?: number;
  id_localidad?: number;
  id_empresa?: number;
}

export interface assignEstablishment {
  id_establecimiento?: number;
  id_empresa?: number;
  updated_at: string
}


// TRAE TODOS LOS ESTABLECIMEINTOS QUE FUERON ASIGNADOS A EMPRESAS
export async function getEstablishmentAdminGlobal(): Promise<Establishment[]> {
  const { data, error } = await supabase
    .from("establecimientos")
    .select(`*,localidades!fk_establecimientos_id_localidad_fkey(*,partidos!fk_partido(*)),
      paises!establecimientos_id_pais_fkey(*),empresas!establecimientos_id_empresa_fkey(*)`)
    .neq('id_empresa', 4)
    .order("id_establecimiento", { ascending: true });
    ;
  if (error) throw error;
  return data || [];
}

// TRAE TODOS LOS ESTABLECIMIENTOS SIN EMPRESA , PARA ASIGNAR
export async function getEstablishments(): Promise<Establishment[]> {
  const { data, error } = await supabase
    .from("establecimientos")
    .select(`*,localidades!fk_establecimientos_id_localidad_fkey(*,partidos!fk_partido(*)),
    paises!establecimientos_id_pais_fkey(*)`)
    .eq("id_empresa", 4);
  if (error) throw error;
  return data || [];
}

// TRAER LOS ESTABLECIMINTOS QUE PERTENECEN A UNA EMPRESA EN PARTICULAR
export async function getEstablishmentsAdminEnterprise(id: number): Promise<Establishment[]> {
  const { data, error } = await supabase
    .from("establecimientos")
    .select(`*,localidades!fk_establecimientos_id_localidad_fkey(*,partidos!fk_partido(*)),
      paises!establecimientos_id_pais_fkey(*),empresas!establecimientos_id_empresa_fkey(*)`)
    .eq("id_empresa", id)
    ;
  if (error) throw error;
  return data || [];
}

export async function getEstablishmentByCountry(id: number): Promise<Establishment[]> {
  const { data, error } = await supabase
    .from("establecimientos")
    .select("*")
    .eq("id_pais", id)
  if (error) throw error;
  return data || [];
}

export async function getEstablishmentByID(id: number): Promise<Establishment[]> {
  const { data, error } = await supabase
    .from("establecimientos")
    .select(`*,
      localidades!fk_establecimientos_id_localidad_fkey(*,partidos!fk_partido(*)),
      provincias!establecimientos_id_provincia_fkey(*),
      paises!establecimientos_id_pais_fkey(*)
      `)
    .eq("id_establecimiento", id)
  if (error) throw error;
  return data || [];
}

//-------------------------------------------- INSERT  ------------------------------------------------------------

export async function insertEstablishment(dato: Establishment) {
  const { data, error } = await supabase
    .from("establecimientos")
    .insert([dato])
    .select();
  if (error) throw error;
  return data;
}
//-------------------------------------------- UPDATE  ------------------------------------------------------------

export async function updateEstablishment(id: number, payload: Partial<Establishment>) {
  const { data, error } = await supabase
    .from("establecimientos")
    .update(payload)
    .eq("id_establecimiento", id)
    .select();
  if (error) throw error;
  return data;
}

