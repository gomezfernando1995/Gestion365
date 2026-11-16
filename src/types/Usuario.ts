export interface Usuario {
    idUsuario?:number;
    nombre: string;
    apellido: string;
    correo: string;
    celular:string;
    usuario: string;
    contrasenia: string;
    direccion: string;
    img: string;
    idestadousuario?: number;
    idrol?: number;
    idlocalidad?: number;
    idpais?: number;
    idprovincia?: number;
    id_empresa?: number;
    id_establecimiento?: number;
    uid:string;
    genero:string;

    estado_usuarios?:{
        idestadousuario?:number;
        descripcion:string;
    }
    roles?:{
        id_rol?:number;
        nombre:string;
    }
    empresas?:{
        id_empresa?:number;
        nombre:string;
    }
    establecimientos?:{
        id_establecimiento?:number;
        nombre:string;
    }
    localidades?:{
        idlocalidad?:number;
        descripcion:string;
    }
    provincias?:{
        idprovincia?:number;
        descripcion:string;
    }
    paises?:{
        idpais?:number;
        descripcion:string;}
}
