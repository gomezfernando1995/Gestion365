import { useEffect, useState } from "react";
import type { Incidente } from "../types/Incidente";
import { getEstablishmentAdminGlobal, getEstablishmentsAdminEnterprise } from "../services/establishmentService";
import { getSectorByEstablishment, type Sector } from "../services/sectorsServices";
import { getStationBySector, type Station } from "../services/stationsService";
import { getAllEquipmentsByStation, type Equipment } from "../services/equipmentService";
import { getAllTypeTicket, type TypeTicket } from "../services/typeTicketService";
import { getAllIncidentPriority, type IncidentPriority } from "../services/incidentPriorityService";
import { insertIncident } from "../services/incidentsService";
import { getUsers } from "../services/usersService"; // Importar el servicio de usuarios
import { getUsersByEnterpriseAndItsEstablishments } from "../hooks/useUsers";
import Swal from "sweetalert2";


interface IncidentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (data: any) => void;
}

export default function IncidentModal({ isOpen, onClose }: IncidentModalProps) {

    const initialForm = {
        id_empresa: undefined,
        id_establecimiento: undefined,
        id_sector: undefined,
        id_puesto: undefined,
        id_equipo: undefined,
        id_prioridad_incidente: undefined,
        id_tipo_ticket: undefined,
        titulo: "",
        descripcion: "",
        created_at: "",
        id_estado_incidente: undefined,
        id_usuario_reporta: undefined,
        id_tipo_comentario: 1,
        id_usuario_asignado: undefined,
        id_categoria_incidente: 1,
    };

    const [dataForm, setDataForm] = useState<Incidente>(initialForm);
    const [incidentPriority, setIncidentPriority] = useState<IncidentPriority[]>();
    const [type, setType] = useState<TypeTicket[]>();
    const [userLocal, setUserLocal] = useState<any>(null);
    const [establishments, setEstablishments] = useState<any[]>([]);
    const [sectors, setSectors] = useState<Sector[]>();
    const [statios, setStatios] = useState<Station[]>();
    const [equipment, setEquipment] = useState<Equipment[]>();

    // Estados para usuarios asignables
    const [assignableUsers, setAssignableUsers] = useState<any[]>([]);
    const [loadingUsers, setLoadingUsers] = useState<boolean>(false);


    // USER LOCALSTORAGE
    useEffect(() => {
        const user = localStorage.getItem("currentUser");
        if (user) {
            setUserLocal(JSON.parse(user));
        }
    }, []);

    // TRAEMOS ESTABLECIMIENTO SEGUN EMPRESA 
    useEffect(() => {
        if (!userLocal) return;

        // Si tiene id_empresa === 4 O NO TIENE empresa ni establecimiento (Global / Sin asignación)
        if (userLocal.id_empresa === 4 || (!userLocal.id_empresa && !userLocal.id_establecimiento)) {
            getEstablishmentAdminGlobal().then((res) => {
                setEstablishments(res);
            });
        } else if (userLocal.id_empresa) {
            getEstablishmentsAdminEnterprise(userLocal.id_empresa).then((res) => {
                setEstablishments(res);
            });
        }
    }, [userLocal]);

    // SETEAMOS SI EL USUARIO ES DE UN ESTABLECIMIENTO
    useEffect(() => {
        if (userLocal?.id_establecimiento) {
            setDataForm((data) => ({
                ...data,
                id_establecimiento: userLocal.id_establecimiento,
            }));
        }
    }, [userLocal]);

    // SECTOR POR ESTABLECIMIENTO
    useEffect(() => {
        if (dataForm?.id_establecimiento) {
            getSectorByEstablishment(dataForm.id_establecimiento).then(setSectors);
        } else {
            setSectors([]);
        }
    }, [dataForm?.id_establecimiento]);

    // PUESTO POR SECTOR
    useEffect(() => {
        if (dataForm?.id_sector) {
            getStationBySector(dataForm.id_sector).then(setStatios);
        } else {
            setStatios([]);
        }
    }, [dataForm?.id_sector]);

    // EQUIPO SEGUN PUESTO
    useEffect(() => {
        if (dataForm?.id_puesto) {
            getAllEquipmentsByStation(dataForm.id_puesto).then(setEquipment);
        } else {
            setEquipment([]);
        }
    }, [dataForm?.id_puesto]);

    // TIPO TICKET
    useEffect(() => {
        getAllTypeTicket().then(setType);
    }, [dataForm?.id_tipo_ticket]);

    // PRIORIDAD TICKET
    useEffect(() => {
        getAllIncidentPriority().then(setIncidentPriority);
    }, [dataForm?.id_prioridad_incidente]);

    const saveIncident = async () => {
        try {
            const incidente = {
                ...dataForm,
                created_at: new Date().toISOString(),
                id_empresa: userLocal?.id_empresa,
                id_estado_incidente: 1, // estado inicial
                id_usuario_reporta: userLocal?.idusuario,
            };
            await insertIncident(incidente);
            onClose();
             await Swal.fire({
                            title: "¡Incidente Agregado!",
                            text: `Incidente fue agregado correctamente.`,
                            icon: "success",
                            confirmButtonText: "Aceptar",
                            confirmButtonColor: "#2563eb",
                            customClass: {
                                popup: "rounded-2xl",
                            },
                        });
        } catch (err) {
            alert("Error al guardar incidente ❌");
        }
    };

    useEffect(() => {
        if (!userLocal) return;

        const fetchAndFilterUsers = async () => {
            setLoadingUsers(true);
            try {
                // SuperAdmin / Tester Global ven a todos
                if (userLocal.id_empresa === null && userLocal.id_establecimiento === null) {
                    const allUsers = await getUsers();
                    setAssignableUsers(allUsers);
                }
                // Empresa: Obtiene sus usuarios y los de sus establecimientos
                else if (userLocal.id_empresa) {
                    const companyUsers = await getUsersByEnterpriseAndItsEstablishments(userLocal.id_empresa);
                    setAssignableUsers(companyUsers);
                }
                // Usuario restringido a un solo establecimiento
                else if (userLocal.id_establecimiento) {
                    const allUsers = await getUsers();
                    const filtered = allUsers.filter((u: any) => u.id_establecimiento === userLocal.id_establecimiento);
                    setAssignableUsers(filtered);
                }
            } catch (error) {
                console.error("Error al cargar usuarios:", error);
            } finally {
                setLoadingUsers(false);
            }
        };
        
        fetchAndFilterUsers();
    }, [userLocal]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-blue-900 mb-4">Agregar Incidente</h2>

                {/* Grid responsivo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {/* Columna izquierda */}
                    <div className="space-y-4">
                        {/* Establecimiento */}
                        {userLocal?.id_empresa || !userLocal?.id_establecimiento ? (
                            <div>
                                <label className="block mb-2 font-semibold text-sm">Establecimiento</label>
                                <select
                                    name="establecimiento"
                                    value={dataForm?.id_establecimiento || ""}
                                    onChange={(e) =>
                                        setDataForm({ ...dataForm, id_establecimiento: Number(e.target.value) })
                                    }
                                    className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                                >
                                    <option value="">Seleccione establecimiento</option>
                                    {establishments.map((est) => (
                                        <option key={est.id_establecimiento} value={est.id_establecimiento}>
                                            {est.id_establecimiento}-{est.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            /* Si es un usuario bloqueado a un único establecimiento específico */
                            <div>
                                <label className="block mb-2 font-semibold text-sm">Establecimiento</label>
                                <input
                                    type="text"
                                    value={userLocal?.establecimientos?.nombre || ""}
                                    readOnly
                                    className="w-full border rounded-md px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
                                />
                            </div>
                        )}
                        {/* Sector */}
                        <div>
                            <label className="block mb-2 font-semibold text-sm">Sector</label>
                            <select
                                name="id_sector"
                                value={dataForm?.id_sector || ""}
                                onChange={(e) =>
                                    setDataForm({ ...dataForm, id_sector: Number(e.target.value) })
                                }
                                className="w-full border rounded-md px-3 py-2 text-sm"
                            >
                                <option value="">Seleccione sector</option>
                                {sectors?.map((sec) => (
                                    <option key={sec.id_sector} value={sec.id_sector}>
                                        {sec.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Puesto */}
                        <div>
                            <label className="block mb-2 font-semibold text-sm">Puesto</label>
                            <select
                                name="id_puesto"
                                value={dataForm?.id_puesto || ""}
                                onChange={(e) =>
                                    setDataForm({ ...dataForm, id_puesto: Number(e.target.value) })
                                }
                                className="w-full border rounded-md px-3 py-2 text-sm"
                            >
                                <option value="">Seleccione puesto</option>
                                {statios?.map((p) => (
                                    <option key={p.id_puesto} value={p.id_puesto}>
                                        {p.id_puesto} - {p.descripcion}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Columna derecha */}
                    <div className="space-y-4">
                        {/* Equipo */}
                        <div>
                            <label className="block mb-2 font-semibold text-sm">Equipo</label>
                            <select
                                name="id_equipo"
                                value={dataForm?.id_equipo || ""}
                                onChange={(e) =>
                                    setDataForm({ ...dataForm, id_equipo: Number(e.target.value) })}
                                className="w-full border rounded-md px-3 py-2 text-sm"
                            >
                                <option value="">Seleccione equipo</option>
                                {equipment?.map((eq) => (
                                    <option key={eq.id_equipo} value={eq.id_equipo}>
                                        {eq.id_equipo} - {eq.nombre} - {eq.marca} {eq.modelo}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Prioridad */}
                        <div>
                            <label className="block mb-2 font-semibold text-sm">Prioridad</label>
                            <select
                                name="id_prioridad_incidente"
                                value={dataForm?.id_prioridad_incidente || ""}
                                onChange={(e) =>
                                    setDataForm({
                                        ...dataForm,
                                        id_prioridad_incidente: Number(e.target.value),
                                    })
                                }
                                className="w-full border rounded-md px-3 py-2 text-sm"
                            >
                                <option value="">Seleccione prioridad</option>
                                {incidentPriority?.map((i) => (
                                    <option key={i.id_prioridad_incidente} value={i.id_prioridad_incidente}>
                                        {i.descripcion}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tipo de ticket */}
                        <div>
                            <label className="block mb-2 font-semibold text-sm">Tipo de ticket</label>
                            <select
                                name="id_tipo_ticket"
                                value={dataForm?.id_tipo_ticket || ""}
                                onChange={(e) =>
                                    setDataForm({ ...dataForm, id_tipo_ticket: Number(e.target.value) })
                                }
                                className="w-full border rounded-md px-3 py-2 text-sm"
                            >
                                <option value="">Seleccione tipo</option>
                                {type?.map((i) => (
                                    <option key={i.id_tipo_ticket} value={i.id_tipo_ticket}>
                                        {i.descripcion}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Asignar Usuario */}
                <div className="mt-4">
                    <label className="block mb-2 font-semibold text-sm">Asignar a Usuario</label>
                    <select
                        name="id_usuario_asignado"
                        value={dataForm?.id_usuario_asignado || ""}
                        onChange={(e) =>
                            setDataForm({
                                ...dataForm,
                                id_usuario_asignado: e.target.value ? Number(e.target.value) : undefined,
                            })
                        }
                        disabled={loadingUsers}
                        className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                    >
                        <option value="">Sin asignar (Opcional)</option>
                        {assignableUsers.map((u) => (
                            <option key={u.idusuario} value={u.idusuario}>
                                {u.nombre} ({u.usuario})- Establecimiento N°{u.id_establecimiento}
                            </option>
                        ))}
                    </select>
                    {loadingUsers && <span className="text-xs text-gray-400">Cargando usuarios...</span>}
                </div>

                {/* Título */}
                <div className="mt-4">
                    <label className="block mb-2 font-semibold text-sm">Título</label>
                    <input
                        type="text"
                        name="titulo"
                        value={dataForm?.titulo || ""}
                        onChange={(e) => setDataForm({ ...dataForm, titulo: e.target.value })}
                        placeholder="Ej: PC no arranca"
                        className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                </div>

                {/* Descripción */}
                <div className="mt-4">
                    <label className="block mb-2 font-semibold text-sm">Descripción</label>
                    <textarea
                        name="descripcion"
                        value={dataForm?.descripcion || ""}
                        onChange={(e) =>
                            setDataForm({ ...dataForm, descripcion: e.target.value })
                        }
                        placeholder="Describe el problema..."
                        className="w-full border rounded-md px-3 py-2 h-28 text-sm"
                    />
                </div>

                {/* Botones */}
                <div className="flex flex-col md:flex-row justify-end gap-2 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded-md transition-colors duration-200 hover:bg-gray-400 text-sm font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={saveIncident}
                        className="px-4 py-2 bg-green-600 text-white rounded-md transition-colors duration-200 hover:bg-green-700 text-sm font-medium"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}