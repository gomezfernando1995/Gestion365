export interface Incidente {
  id_incidente?: number;
  titulo?: string;
  descripcion?: string;
  fecha_cierre?: string | undefined;
  created_at?: string;         
  updated_at?: string;        
  sla_tiempo?: boolean | undefined;       
  tiempo_resolucion?: number | undefined; 
  deleted_at?: string;
  id_establecimiento?: number | undefined;
  id_sector?: number | undefined;
  id_prioridad_incidente?: number | undefined;
  id_categoria_incidente?: number | undefined;
  id_estado_incidente?: number | undefined;
  id_equipo?: number | undefined;
  id_usuario_reporta?: number | undefined;
  id_usuario_asignado?: number | undefined;
  id_tipo_comentario?: number | undefined;
  id_tipo_ticket?: number | undefined;
  id_empresa?: number | undefined;
  id_puesto?: number | undefined;
  resolucion?:string;
  
  tipo_tickets?: {
    id_tipo_ticket: number;
    nombre: string;
    descripcion?: string;
  };

  estado_incidentes?: {
    id_estado_incidente: number;
    descripcion: string;
  };

  categoria_incidentes?: {
    id_categoria_incidente: number;
    descripcion: string;
  };

  prioridad_incidentes?: {
    id_prioridad_incidente: number;
    descripcion: string;
  };

  establecimientos?: {
    id_establecimiento: number;
    nombre: string;
  };

  usuario_reporta?: {
    id_usuario: number;
    nombre: string;
  };

  usuario_asignado?: {
    id_usuario: number;
    nombre: string;
  };

  equipos?: {
    id_equipo: number;
    nombre: string;
    marca?: string;
    modelo?: string;
    numero_serie?: string;
    descripcion?: string;
  };
  
  sectores?:{
    id_sector:number;
    id_establecimiento:number;
    nombre: string;
    ubicacion: string;
  }
  puestos?:{
    id_puesto:number;
    id_sector:number;
    puesto_red:string;
    telefono:string;
    descripcion:string;
  }

}