export interface Usuario {
    nombre: string;
    apellido: string;
    correo: string;
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
}
