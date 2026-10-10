import { useEffect, useState } from "react";
import { getEstablishments, type assignEstablishment, updateEstablishment, type Establishment } from "../services/establishmentService";
import { getAllCompanies, type Companie } from "../services/companiesServices";
import Swal from "sweetalert2";

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
}

export default function ModalAssignEstablishment({ isOpen, onClose }: UserModalProps) {

    const initialForm = {
        id_establecimiento: undefined,
        id_empresa: undefined,
        updated_at: ""
    };
    const [dataForm, setDataForm] = useState<assignEstablishment>(initialForm);
    const [companies, setCompanies] = useState<Companie[]>();
    const [establishments, setEstablishments] = useState<Establishment[]>();
    const now = new Date().toISOString(); // 👈 fecha actual en formato ISO

    //------------------------------------------------------------------------------------------------------------------------------------------
    // SETEAMOS EMPRESA   
    useEffect(() => {
        getAllCompanies().then(setCompanies);
    }, [dataForm?.id_empresa]);

    // SETEAMOS Establecimientos
    useEffect(() => {
        getEstablishments().then(setEstablishments);
    }, [dataForm.id_establecimiento]);

    const updateEstablishmentF = async () => {
        try {
            if (!dataForm.id_establecimiento || !dataForm.id_empresa) {
                alert("Debes seleccionar empresa y establecimiento ❌");
                return;
            }
            const payload = {
                id_empresa: dataForm.id_empresa,
                updated_at: now
            };
            const updated = await updateEstablishment(
                dataForm.id_establecimiento,
                payload
            );

            onClose();
            setDataForm(initialForm);
            await Swal.fire({
                title: "¡Establecimiento Actualizado!",
                text: `Establecimiento #${dataForm.id_establecimiento} ${updated} fue actualizado correctamente.`,
                icon: "success",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#2563eb",
                customClass: {
                    popup: "rounded-2xl",
                },
            });

        } catch (err) {
            console.error("Error al actualizar establecimiento:", err);
            alert("Error al actualizar establecimiento ❌");
            await Swal.fire({
                title: "¡Error al actualizar el establecimiento!",
                text: `Hubo un inconveniente al actualizar el establecimiento.`,
                icon: "success",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#2563eb",
                customClass: {
                    popup: "rounded-2xl",
                },
            });
        }
    };

    if (!isOpen) return null;
    return (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl p-6">
                <h2 className="text-xl font-bold text-center text-blue-900 mb-4">Asignar empresa</h2>
                {/* SELECT INPUT */}
                <div className="grid grid-cols-2 gap-6 mt-6 border-t border-gray-300 pt-2">
                    {/* Establecimiento */}
                    <div>
                        <label className="block mb-2 font-semibold">Establecimiento</label>
                        <select
                            name="id_establecimiento"
                            value={dataForm.id_establecimiento || ""}
                            onChange={(e) => setDataForm({ ...dataForm, id_establecimiento: Number(e.target.value) })}
                            className="w-full border rounded-md px-3 py-2"
                        >
                            <option value="">Seleccione establecimiento</option>
                            {establishments!.map((e) => (
                                <option key={e.id_establecimiento} value={e.id_establecimiento}>
                                    {e.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

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
                </div>
                {/* Botones */}
                <div className="flex flex-col md:flex-row justify-end gap-2 mt-6">
                    <button
                        onClick={() => {
                            setDataForm(initialForm); // 👈 resetea los inputs
                            onClose();                // 👈 cierra el modal
                        }}
                        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors duration-200"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={updateEstablishmentF}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div >

    );
};