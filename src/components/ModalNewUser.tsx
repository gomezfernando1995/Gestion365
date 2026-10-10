import { useEffect, useState } from "react";
import { getEstablishmentAdminGlobal, type Establishment } from "../services/establishmentService";
import type { Usuario } from "../types/Usuario";
import { getCountries, type Countries } from "../services/countriesService";
import { getProvincesByCountry, type Province } from "../services/provincesService";
import { getLocalitiesByProvince, type Localities } from "../services/localitiesService";
import { getAllCompanies, type Companie } from "../services/companiesServices";
import { getRolesByType, type Roles } from "../services/rolesService";
import { createUser } from "../services/usersService";
import { supabase } from "../services/supabase";
import Swal from "sweetalert2";

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
}

export default function ModalNewUser({ isOpen, onClose }: UserModalProps) {

    const [dataForm, setDataForm] = useState<Usuario>({
        uid: "",
        nombre: "",
        apellido: "",
        correo: "",
        usuario: "",
        contrasenia: "",
        direccion: "",
        img: "",
        idestadousuario: 1,
        idrol: undefined,
        idlocalidad: undefined,
        idpais: undefined,
        idprovincia: undefined,
        id_empresa: undefined,
        id_establecimiento: undefined,
    });
    const [, setUserLocal] = useState(Object)
    const [companies, setCompanies] = useState<Companie[]>();
    const [establishments, setEstablishments] = useState<Establishment[]>();
    const [countries, setCountries] = useState<Countries[]>();
    const [provinces, setProvince] = useState<Province[]>();
    const [localities, setLocalities] = useState<Localities[]>();
    const [tipoPerfil, setTipoPerfil] = useState<number | null>(null);
    const [roles, setRoles] = useState<Roles[]>([]);
    const userLocalStorage = JSON.parse(localStorage.getItem("currentUser") || "{}");

    useEffect(() => {
        if (tipoPerfil) {
            getRolesByType(tipoPerfil).then(setRoles);
        }
    }, [tipoPerfil]);

    //USER LOCALSTORAGE
    useEffect(
        () => {
            const user = localStorage.getItem("currentUser");
            if (user) { setUserLocal(JSON.parse(user)); }
        }, []
    );

    //------------------------------------------------------------------------------------------------------------------------------------------

    // SETEAMOS LOS PAISES 
    useEffect(() => {
        getCountries().then(setCountries)
    }, []
    );

    // SETEAMOS PROVINCIAS POR PAISES
    useEffect(() => {
        if (dataForm?.idpais) {
            getProvincesByCountry(dataForm.idpais).then(setProvince)
        } else {
            setProvince([])
        }
    }, [dataForm?.idpais]);

    // SETEAMOS LOCALIDADES POR PROVINCIA
    useEffect(() => {
        if (dataForm?.idprovincia) {
            getLocalitiesByProvince(dataForm.idprovincia).then(setLocalities);
        } else {
            setLocalities([]);
        }
    }, [dataForm?.idprovincia]
    );
    //------------------------------------------------------------------------------------------------------------------------------------------
    // SETEAMOS EMPRESA   
    useEffect(() => {
        getAllCompanies().then(setCompanies);
    }, [dataForm?.id_empresa]);

    // SETEAMOS Establecimientos
    useEffect(() => {
        getEstablishmentAdminGlobal().then(setEstablishments);
    }, [dataForm.id_establecimiento]);


    const saveUser = async () => {

        const { data, error } = await supabase.auth.signUp({
            email: dataForm.correo,
            password: dataForm.contrasenia || "123456", // contraseña inicial
        });

        if (error) {
            alert(`❌ Error en Auth: ${error.message}`);
            return;
        }

        const authUser = data.user;
        const payload: any = { ...dataForm };
        if (payload.id_empresa === undefined) delete payload.id_empresa;
        if (payload.id_establecimiento === undefined) delete payload.id_establecimiento;
        try {
            const usuario = {
                ...payload,
                uid: authUser!.id,
                contrasenia: 123456,
                usuario: payload.correo.split("@")[0], // nombre de usuario automático
                // correo se mantiene como email válido
            };
            await createUser(usuario);
            onClose();
            await Swal.fire({
                title: "¡Usuario Guardado!",
                text: `Usuario #${dataForm.correo} fue agregado correctamente.`,
                icon: "success",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#2563eb",
                customClass: {
                    popup: "rounded-2xl",
                },
            });

        } catch (err) {
            alert("Error al guardar usuario ❌");
        }
    };

    if (!isOpen) return null;
    return (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl p-6">
                <h2 className="text-xl font-bold text-center text-blue-900 mb-4">Agregar Usuario</h2>
                {/* SELECT INPUT */}


                <div className="grid grid-cols-2 gap-6 mt-6 border-t border-gray-300 pt-6">
                    {/* Radio Empresa */}
                    {userLocalStorage.idrol != 2 && (
                        <label className="flex items-center gap-3 p-3  rounded-lg cursor-pointer hover:bg-gray-100">
                            <input
                                type="radio"
                                name="tipoPerfil"
                                value={1}
                                checked={tipoPerfil === 1}
                                onChange={(e) => setTipoPerfil(Number(e.target.value))}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="font-medium text-gray-800">Perfil de Empresa</span>
                        </label>
                    )}
                    {/* Radio Establecimiento */}
                    <label className="flex items-center gap-3 p-3  rounded-lg cursor-pointer hover:bg-gray-100">
                        <input
                            type="radio"
                            name="tipoPerfil"
                            value={2}
                            checked={tipoPerfil === 2}
                            onChange={(e) => setTipoPerfil(Number(e.target.value))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="font-medium text-gray-800">Perfil de Establecimiento</span>
                    </label>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-6 border-t border-gray-300 pt-2">
                    {/* Empresa */}
                    {tipoPerfil === 1 && (

                        <div>
                            <label className="block mb-2 font-semibold">Empresa</label>
                            <select
                                name="id_empresa"
                                value={dataForm.id_empresa || ""}
                                onChange={(e) => setDataForm({ ...dataForm, id_empresa: Number(e.target.value) })}
                                className="w-full border rounded-md px-3 py-2"
                            >
                                <option value="">Seleccione empresa</option>
                                {companies!.map((e) => (
                                    <option key={e.id_empresa} value={e.id_empresa}>
                                        {e.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {tipoPerfil === 2 && (
                        <div>
                            <label className="block mb-2 font-semibold">Establecimiento</label>
                            <select
                                name="id_establecimiento"
                                value={userLocalStorage?.id_establecimiento ?? dataForm.id_establecimiento ?? ""}
                                disabled={Boolean(userLocalStorage?.id_establecimiento)} 
                                onChange={(e) => setDataForm({ ...dataForm, id_establecimiento: Number(e.target.value) })}
                                className="w-full border rounded-md px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="">Seleccione establecimiento</option>
                                {establishments?.map((e) => (
                                    <option key={e.id_establecimiento} value={e.id_establecimiento}>
                                        {e.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    {(tipoPerfil === 1 || tipoPerfil === 2) && (
                        <div>
                            <label className="block mb-2 font-semibold">Rol</label>
                            <select
                                name="idrol"
                                value={dataForm.idrol || ""}
                                onChange={(e) =>
                                    setDataForm({ ...dataForm, idrol: Number(e.target.value) })
                                }
                                className="w-full border rounded-md px-3 py-2"
                            >
                                <option value="">Seleccione rol</option>
                                {roles.map((r) => (
                                    <option key={r.id_rol} value={r.id_rol}>
                                        {r.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {(tipoPerfil === 1 || tipoPerfil === 2) && (
                    <div>

                        < div className="grid grid-cols-2 gap-6 mt-6  border-t border-gray-300 pt-4">

                            <div>
                                <label className="block mb-2 font-semibold">Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={dataForm.nombre}
                                    onChange={(e) => setDataForm({ ...dataForm, nombre: e.target.value })}
                                    placeholder="Ingrese nombre..."
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            </div>
                            {/* Apellido */}
                            <div>
                                <label className="block mb-2 font-semibold">Apellido</label>
                                <input
                                    type="text"
                                    name="apellido"
                                    value={dataForm.apellido}
                                    onChange={(e) => setDataForm({ ...dataForm, apellido: e.target.value })}
                                    placeholder="Ingrese apellido..."
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 mt-1 ">
                            <div>
                                <label className="block mb-2 font-semibold">Correo</label>
                                <input
                                    type="email"
                                    name="correo"
                                    value={dataForm.correo}
                                    onChange={(e) => setDataForm({ ...dataForm, correo: e.target.value })}
                                    placeholder="Ingrese correo electrónico..."
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            </div>

                        </div>

                        <div className="grid grid-cols-2 gap-6 mt-6 border-t border-gray-300 pt-2">
                            {/* País */}
                            <div>
                                <label className="block mb-2 font-semibold">País</label>
                                <select
                                    name="idPais"
                                    value={dataForm.idpais || ""}
                                    onChange={(e) => setDataForm({ ...dataForm, idpais: Number(e.target.value) })}
                                    className="w-full border rounded-md px-3 py-2"
                                >
                                    <option value="">Seleccione país</option>
                                    {countries!.map((c) => (
                                        <option key={c.idpais} value={c.idpais}>
                                            {c.descripcion}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Provincia */}
                            <div>
                                <label className="block mb-2 font-semibold">Provincia</label>
                                <select
                                    name="idProvincia"
                                    value={dataForm.idprovincia || ""}
                                    onChange={(e) => setDataForm({ ...dataForm, idprovincia: Number(e.target.value) })}
                                    className="w-full border rounded-md px-3 py-2"
                                >
                                    <option value="">Seleccione provincia</option>
                                    {provinces!.map((p) => (
                                        <option key={p.idprovincia} value={p.idprovincia}>
                                            {p.descripcion}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>


                        <div className="grid grid-cols-2 gap-6 mt-2">
                            {/* Localidad */}
                            <div>
                                <label className="block mb-2 font-semibold">Localidad</label>
                                <select
                                    name="idLocalidad"
                                    value={dataForm.idlocalidad || ""}
                                    onChange={(e) => setDataForm({ ...dataForm, idlocalidad: Number(e.target.value) })}
                                    className="w-full border rounded-md px-3 py-2"
                                >
                                    <option value="">Seleccione localidad</option>
                                    {localities!.map((l) => (
                                        <option key={l.idlocalidad} value={l.idlocalidad}>
                                            {l.descripcion}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-4">
                                {/* Dirección */}
                                <div>
                                    <label className="block mb-2 font-semibold">Dirección</label>
                                    <input
                                        type="text"
                                        name="direccion"
                                        value={dataForm.direccion || ""}
                                        onChange={(e) => setDataForm({ ...dataForm, direccion: e.target.value })}
                                        placeholder="Ingrese dirección..."
                                        className="w-full border rounded-md px-3 py-2"
                                    />
                                </div>
                            </div>

                        </div>

                    </div>
                )}
                {/* Botones */}
                <div className="flex flex-col md:flex-row justify-end gap-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors duration-200"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={saveUser}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div >

    );
};