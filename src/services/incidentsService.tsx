import { supabase } from "./supabase";

import type { Incidente } from "../types/Incidente";

export async function getIncidents(): Promise<Incidente[]> {
  const { data, error } = await supabase
    .from("incidentes")
    .select(`
      *,
      establecimientos!fk_establecimiento(*),
      sectores!fk_sector(*),
      prioridad_incidentes!fk_prioridad(*), 
      categoria_incidentes!fk_categoria(*),
      estado_incidentes!fk_estado(*),
      tipo_tickets!incidentes_id_tipo_ticket_fkey(*),
      empresas!incidentes_id_empresa_fkey(*),
      puestos!incidentes_id_puesto_fkey(*),
      equipos!incidentes_id_equipo_fkey(*),
      usuario_reporta:usuarios!incidentes_id_usuario_reporta_fkey(*),
      usuario_asignado:usuarios!incidentes_id_usuario_asignado_fkey(*),
      tipo_comentarios!incidentes_id_tipo_comentario_fkey(*)
    `)
    .order("id_incidente", { ascending: false }); //  orden descendente

  if (error) throw new Error(error.message);

  return data || [];
}

export async function getClosedIncidentsByDateRange(
  firstDay: string,
  lastDay: string,
  idEstablecimiento?: number | string
) {
  let query = supabase
    .from("incidentes")
    .select("*")
    .in("id_estado_incidente", [7, 8, 10])
    .gte("created_at", firstDay)
    .lte("created_at", lastDay);

  // Si el usuario tiene un establecimiento asignado, filtramos por él
  if (idEstablecimiento) {
    query = query.eq("id_establecimiento", idEstablecimiento);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getIncidentsReportbyUser(userId: number): Promise<Incidente[]> {

  const parsedId = Number(userId);

  if (isNaN(parsedId) || !userId) {
    console.warn("ID de usuario no válido para consultar incidentes:", userId);
    return []; // o lanzar un error controlado
  }
  const { data, error } = await supabase
    .from("incidentes")
    .select(`*`)
    .eq("id_usuario_reporta", userId)
  if (error) throw new Error(error.message);

  return data || [];
}

export async function getIncidentsbyEquipment(id_equipment: number): Promise<Incidente[]> {
  const { data, error } = await supabase
    .from("incidentes")
    .select(`
      *,
      establecimientos!fk_establecimiento(*),
      sectores!fk_sector(*),
      prioridad_incidentes!fk_prioridad(*), 
      categoria_incidentes!fk_categoria(*),
      estado_incidentes!fk_estado(*),
      tipo_tickets!incidentes_id_tipo_ticket_fkey(*),
      empresas!incidentes_id_empresa_fkey(*),
      puestos!incidentes_id_puesto_fkey(*),
      equipos!incidentes_id_equipo_fkey(*),
      usuario_reporta:usuarios!incidentes_id_usuario_reporta_fkey(*),
      usuario_asignado:usuarios!incidentes_id_usuario_asignado_fkey(*),
      tipo_comentarios!incidentes_id_tipo_comentario_fkey(*)
    `)
    .eq("id_equipo", id_equipment)
  if (error) throw new Error(error.message);

  return data || [];
}


export async function getIncidentsbyEstablishment(id_establishment: number): Promise<Incidente[]> {
  const { data, error } = await supabase
    .from("incidentes")
    .select(`
      *,
      establecimientos!fk_establecimiento(*),
      sectores!fk_sector(*),
      prioridad_incidentes!fk_prioridad(*), 
      categoria_incidentes!fk_categoria(*),
      estado_incidentes!fk_estado(*),
      tipo_tickets!incidentes_id_tipo_ticket_fkey(*),
      empresas!incidentes_id_empresa_fkey(*),
      puestos!incidentes_id_puesto_fkey(*),
      equipos!incidentes_id_equipo_fkey(*),
      usuario_reporta:usuarios!incidentes_id_usuario_reporta_fkey(*),
      usuario_asignado:usuarios!incidentes_id_usuario_asignado_fkey(*),
      tipo_comentarios!incidentes_id_tipo_comentario_fkey(*)
    `)
    .eq("id_establecimiento", id_establishment)
  if (error) throw new Error(error.message);

  return data || [];
}

export async function getIncidentsbyEnterprise(id_enterprice: number): Promise<Incidente[]> {
  const { data, error } = await supabase
    .from("incidentes")
    .select(`*`)
    .eq("id_empresa", id_enterprice)
  if (error) throw new Error(error.message);

  return data || [];
}

export async function getIncidentsResolvedbyUser(userId: number): Promise<Incidente[]> {

  const parsedId = Number(userId);
  if (isNaN(parsedId) || !userId) {
    console.warn("ID de usuario no válido para consultar incidentes:", userId);
    return []; // o lanzar un error controlado
  }
  const { data, error } = await supabase
    .from("incidentes")
    .select(`*`)
    .eq("id_usuario_asignado", userId)
    .eq("id_estado_incidente", 7);

  if (error) throw new Error(error.message);

  return data || [];
}

export async function getIncidentsByUser(userId: number) {
  const parsedId = Number(userId);
  if (isNaN(parsedId) || !userId) {
    console.warn("ID de usuario no válido para consultar incidentes:", userId);
    return []; // o lanzar un error controlado
  }
  const { data, error } = await supabase
    .from("incidentes")
    .select(`*,establecimientos!fk_establecimiento(*)`)
    .or(`id_usuario_reporta.eq.${userId},id_usuario_asignado.eq.${userId}`);

  if (error) throw new Error(error.message);
  return data || [];
}


export async function getIncidentsByUserAssing(userId: number) {
  const parsedId = Number(userId);
  if (isNaN(parsedId) || !userId) {
    console.warn("ID de usuario no válido para consultar incidentes:", userId);
    return []; // o lanzar un error controlado
  }

  const { data, error } = await supabase
    .from("incidentes")
    .select(`*,establecimientos!fk_establecimiento(*)`)
    .eq("id_usuario_asignado", parsedId); // 👈 Filtra exclusivamente por los asignados al usuario

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getIncidentsReportbyEstablishment(idEstablishment: number) {
  const { data, error } = await supabase
    .from("incidentes")
    .select(`
      *,
      establecimientos!fk_establecimiento(*),
      sectores!fk_sector(*),
      prioridad_incidentes!fk_prioridad(*), 
      categoria_incidentes!fk_categoria(*),
      estado_incidentes!fk_estado(*),
      tipo_tickets!incidentes_id_tipo_ticket_fkey(*),
      empresas!incidentes_id_empresa_fkey(*),
      puestos!incidentes_id_puesto_fkey(*),
      equipos!incidentes_id_equipo_fkey(*),
      usuario_reporta:usuarios!incidentes_id_usuario_reporta_fkey(*),
      usuario_asignado:usuarios!incidentes_id_usuario_asignado_fkey(*),
      tipo_comentarios!incidentes_id_tipo_comentario_fkey(*)
    `)
    .eq("id_establecimiento", idEstablishment);

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getIncident(id: number): Promise<Incidente[]> {
  const { data, error } = await supabase
    .from("incidentes")
    .select(`
      *,
      establecimientos!fk_establecimiento(*),
      sectores!fk_sector(*),
      prioridad_incidentes!fk_prioridad(*), 
      categoria_incidentes!fk_categoria(*),
      estado_incidentes!fk_estado(*),
      tipo_tickets!incidentes_id_tipo_ticket_fkey(*),
      empresas!incidentes_id_empresa_fkey(*),
      puestos!incidentes_id_puesto_fkey(*),
      equipos!incidentes_id_equipo_fkey(*),
      usuario_reporta:usuarios!incidentes_id_usuario_reporta_fkey(*),
      usuario_asignado:usuarios!incidentes_id_usuario_asignado_fkey(*),
      tipo_comentarios!incidentes_id_tipo_comentario_fkey(*)
    `)
    .eq("id_incidente", id)
    .single();

  if (error) throw new Error(error.message);
  return data ? [data] : [];
}




export async function insertIncident(ticket: Partial<Incidente>) {
  const { data, error } = await supabase
    .from("incidentes")
    .insert([ticket])
    .select();

  if (error) throw error;
  return data;
}

export async function updateIncident(id: number, payload: Partial<Incidente>) {
  const { data, error } = await supabase
    .from("incidentes")
    .update(payload)
    .eq("id_incidente", id)
    .select();
  if (error) throw error;
  return data;
}

export async function deleteSoft(id: number) {
  const { data, error } = await supabase
    .from("incidentes")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id_incidente", id)
    .select();
  if (error) throw error;
  return data;
}
