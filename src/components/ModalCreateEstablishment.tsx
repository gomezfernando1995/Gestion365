import { useEffect, useState } from "react";
import { insertEstablishment, type Establishment } from "../services/establishmentService";
import { getCountries, type Countries } from "../services/countriesService";
import { getProvincesByCountry, type Province } from "../services/provincesService";
import { getLocalitiesByProvince, type Localities } from "../services/localitiesService";
import { getAllCompanies, type Companie } from "../services/companiesServices";
import Swal from "sweetalert2";

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
}

export default function ModalNewEstablishment({ isOpen, onClose }: UserModalProps) {

    const harcodata = {
        nombre: "",
        calle: "",
        altura: "",
        telefono: "",
        correo: "",
        cuit: "",
        descripcion: "",
        sitioweb: "",
        id_pais: undefined,
        id_provincia: undefined,
        id_localidad: undefined,
        id_empresa: undefined
    }
    const [dataForm, setDataForm] = useState<Establishment>(harcodata);
    const [companies, setCompanies] = useState<Companie[]>();
    const [countries, setCountries] = useState<Countries[]>();
    const [provinces, setProvince] = useState<Province[]>();
    const [localities, setLocalities] = useState<Localities[]>();

    // SETEAMOS LOS PAISES 
    useEffect(() => {
        getCountries().then(setCountries)
    }, []
    );

    // SETEAMOS PROVINCIAS POR PAISES
    useEffect(() => {
        if (dataForm?.id_pais) {
            getProvincesByCountry(dataForm.id_pais).then(setProvince)
        } else {
            setProvince([])
        }
    }, [dataForm?.id_pais]);

    // SETEAMOS LOCALIDADES POR PROVINCIA
    useEffect(() => {
        if (dataForm?.id_provincia) {
            getLocalitiesByProvince(dataForm.id_provincia).then(setLocalities);
        } else {
            setLocalities([]);
        }
    }, [dataForm?.id_provincia]
    );
    //------------------------------------------------------------------------------------------------------------------------------------------
    // SETEAMOS EMPRESA   
    useEffect(() => {
        getAllCompanies().then(setCompanies);
    }, [dataForm?.id_empresa]);

    const saveCompanie = async () => {

        const payload: any = { ...dataForm };
        try {
            await insertEstablishment(payload);
            onClose();
            await Swal.fire({
                            title: "¡Establecimiento Agregado!",
                            text: `Establecimiento guardado correctamente  #${dataForm.id_establecimiento}`,
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
            <div className="bg-white rounded-lg shadow-lg w-5xl p-6">
                <h2 className="text-xl font-bold text-center text-blue-900 mb-4">Alta Establecimiento</h2>

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
                    <div>
                        <label className="block mb-2 font-semibold">Telefono</label>
                        <input
                            type="text"
                            name="telefono"
                            value={dataForm.telefono}
                            onChange={(e) => setDataForm({ ...dataForm, telefono: e.target.value })}
                            placeholder="Ingrese telefono..."
                            className="w-full border rounded-md px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-semibold">Sitio Web</label>
                        <input
                            type="text"
                            name="sitioweb"
                            value={dataForm.sitioweb}
                            onChange={(e) => setDataForm({ ...dataForm, sitioweb: e.target.value })}
                            placeholder="www.ingresesitioweb.com.ar"
                            className="w-full border rounded-md px-3 py-2"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-6 border-t border-gray-300 pt-2">
                    {/* Empresa */}
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
                    <div>
                        <label className="block mb-2 font-semibold">Cuit</label>
                        <input
                            type="text"
                            name="cuit"
                            value={dataForm.cuit}
                            onChange={(e) => setDataForm({ ...dataForm, cuit: e.target.value })}
                            placeholder="Ingrese cuit de establecimiento..."
                            className="w-full border rounded-md px-3 py-2"
                        />
                    </div>

                </div>
                <div>


                    <div className="grid grid-cols-2 gap-6 mt-6 border-t border-gray-300 pt-2">
                        {/* País */}
                        <div>
                            <label className="block mb-2 font-semibold">País</label>
                            <select
                                name="idPais"
                                value={dataForm.id_pais || ""}
                                onChange={(e) => setDataForm({ ...dataForm, id_pais: Number(e.target.value) })}
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
                                value={dataForm.id_provincia || ""}
                                onChange={(e) => setDataForm({ ...dataForm, id_provincia: Number(e.target.value) })}
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
                                value={dataForm.id_localidad || ""}
                                onChange={(e) => setDataForm({ ...dataForm, id_localidad: Number(e.target.value) })}
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
                                <label className="block mb-2 font-semibold">Calle</label>
                                <input
                                    type="text"
                                    name="calle"
                                    value={dataForm.calle || ""}
                                    onChange={(e) => setDataForm({ ...dataForm, calle: e.target.value })}
                                    placeholder="Ingrese dirección..."
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            {/* Dirección */}
                            <div>
                                <label className="block mb-2 font-semibold">Altura</label>
                                <input
                                    type="text"
                                    name="altura"
                                    value={dataForm.altura || ""}
                                    onChange={(e) => setDataForm({ ...dataForm, altura: e.target.value })}
                                    placeholder="Ingrese dirección..."
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botones */}
                <div className="flex flex-col md:flex-row justify-end gap-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors duration-200"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={saveCompanie}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div >

    );
};