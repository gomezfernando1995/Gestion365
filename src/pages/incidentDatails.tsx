import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Incidente } from "../types/Incidente";
import { getIncident } from "../services/incidentsService";
import { useCommentary } from "../hooks/useCommentary";
import { insertCommentaryIncident, type CommentaryIncidents, } from "../services/commentaryIncidentsService";
import { ArrowLeftIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { firstLetter, textOrganic } from "../utils/textFormat";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/es";
import { useUsers } from "../hooks/useUsers";
import { ModalAssignUserByTicket } from "../components/ModalAssignUserByTicket";
import { ModalUpdateStateIncident } from "../components/ModalUpdateStateIncident";
import { ModalCerrarIncident } from "../components/ModalCerrarIncident";
import { CheckCircle2 } from "lucide-react";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("es");

interface UserSession {
    idusuario?: number;
    nombre?: string;
    usuario?: string;
}

export default function IncidentDetails() {
    const { id } = useParams<{ id: string }>();
    const [ticket, setTicket] = useState<Incidente | null>(null);
    const [loading, setLoading] = useState(true);
    const { commentary, loadingCommentary } = useCommentary();
    const [newComment, setNewComment] = useState("");
    const [sending, setSending] = useState(false);
    const [localUser, setLocalUser] = useState<UserSession | null>(null);
    const navigate = useNavigate();
    const { userLocalS, users } = useUsers();
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenStates, setIsOpenState] = useState(false);
    const [isOpenCerrarIncident, setisOpenCerrarIncident] = useState(false);
    const isAuthorizedUser =
        userLocalS?.idusuario === ticket?.id_usuario_reporta ||
        userLocalS?.idusuario === ticket?.id_usuario_asignado ||
        userLocalS?.idrol === 6;
    const isTicketActive = ![7, 8, 10].includes(ticket?.id_estado_incidente || 0);
    const isAuthTicket = isTicketActive && isAuthorizedUser;

    useEffect(() => {
        const fetchIncident = async () => {
            if (!id) return;
            try {
                const data = await getIncident(Number(id));
                setTicket(data[0] || null);
            } catch (error) {
                console.error("Error cargando el incidente:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchIncident();
    }, [id]);



    // Obtener usuario autenticado
    useEffect(() => {
        const savedUser = localStorage.getItem("currentUser");
        if (savedUser) {
            try {
                setLocalUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Error parsing user from localStorage", e);
            }
        }
    }, []);

    const handleAddComment = async () => {
        if (!newComment.trim() || !localUser?.idusuario || !id) return;

        setSending(true);
        try {
            const commentaryData = {
                id_tipo_comentario: 1,
                comentario: newComment.trim(),
                id_incidente: Number(id),
                id_usuario: localUser.idusuario,
                fecha_hora: new Date().toISOString(),
                votoPositivo: 0,
                votoNegativo: 0,
                visto: 0,
            };

            await insertCommentaryIncident(commentaryData);
            setNewComment("");
            // Opcional: podrías recargar comentarios aquí si tu hook expone la función
        } catch (error) {
            console.error("Error al agregar comentario:", error);
        } finally {
            setSending(false);
        }
    };



    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-700">
                <p className="text-lg font-medium animate-pulse">Cargando incidente...</p>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-700 gap-4">
                <p className="text-lg font-semibold text-red-600">No se encontró el incidente solicitado.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                >
                    Volver a la lista
                </button>
            </div>
        );
    }

    const formattedUsers = users.map((u: any) => ({
        id: u.idusuario || u.id,
        name: u.nombre || u.usuario || `Usuario #${u.idusuario}`,
    }));

    return (
        <div className="animate-fadeIn min-h-screen bg-gray-100 p-4 lg:p-6 text-gray-900 scrollbar-thin overflow-y-auto">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">

                {/* Sección Principal */}
                <div className="flex-1 space-y-4 ">

                    {/* Header del Ticket */}
                    <div className="bg-white p-4 rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                                title="Volver"
                            >
                                <ArrowLeftIcon className="h-6 w-6" />
                            </button>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <span>Ticket</span>
                                    <span className="text-blue-600">#{ticket.id_incidente}</span>
                                    <span className="text-gray-400 font-normal">|</span>
                                    <span>{ticket.titulo}</span>
                                </h2>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                Prioridad : {ticket.prioridad_incidentes?.descripcion || "Sin Prioridad"}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                Estado : {ticket.estado_incidentes?.descripcion || "Sin Estado"}
                            </span>
                        </div>
                    </div>
                    {ticket?.resolucion && (
                        <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 mb-4">
                            <div className="flex items-center gap-2 text-blue-900 font-semibold text-xs mb-1 uppercase tracking-wider">
                                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                                <span>Motivo de Cierre / Resolución</span>
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                                {ticket?.resolucion}
                            </p>
                        </div>
                    )}
                    {/* Descripción */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-2">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                            Descripción
                        </h3>

                        <div className="max-h-80  pr-2 text-sm text-gray-800 leading-relaxed whitespace-pre-line scrollbar-thin overflow-y-auto">
                            {ticket.descripcion || "Sin descripción proporcionada."}
                        </div>
                    </div>
                    {/* Formulario Agregar Comentario */}
                    {![7, 8, 10].includes(ticket.id_estado_incidente || 0) ? (

                        < div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
                            <h4 className="text-sm font-semibold text-gray-800">Agregar comentario</h4>
                            <div className="flex gap-3 items-start">
                                <div className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm">
                                    {firstLetter(localUser?.nombre || localUser?.usuario || "U")}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <textarea
                                        className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition"
                                        placeholder="Escribe un comentario o actualización..."
                                        rows={3}
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    />
                                    <div className="flex justify-end">
                                        <button
                                            onClick={handleAddComment}
                                            disabled={sending || !newComment.trim()}
                                            className={`flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition ${sending || !newComment.trim() ? "opacity-50 cursor-not-allowed" : ""
                                                }`}
                                        >
                                            <PaperAirplaneIcon className="w-4 h-4" />
                                            {sending ? "Enviando..." : "Enviar comentario"}
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ) : (<div className="p-3 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium text-center border border-gray-200">
                        🔒 Este ticket se encuentra cerrado. No se permiten nuevos comentarios.
                    </div>)}

                    {/* Historial de Comentarios */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="text-md font-bold text-gray-800 border-b border-gray-100 pb-2">
                            Comentarios ({commentary.length})
                        </h3>

                        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                            {loadingCommentary && (
                                <p className="text-xs text-gray-500 animate-pulse">Cargando comentarios...</p>
                            )}

                            {!loadingCommentary && commentary.length === 0 && (
                                <p className="text-sm text-gray-400 py-4 text-center">No hay comentarios todavía.</p>
                            )}

                            {commentary.map((comentario: CommentaryIncidents) => (
                                <div
                                    key={comentario.id_comentario}
                                    className="p-3 rounded-lg bg-gray-50 border border-gray-100 space-y-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 shrink-0 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-xs">
                                                {firstLetter(comentario?.usuarios?.nombre || comentario?.usuarios?.usuario || "U")}
                                            </div>
                                            <span className="text-xs font-bold text-gray-800">
                                                {comentario.usuarios?.usuario || comentario.usuarios?.nombre || "Usuario"}
                                            </span>
                                        </div>
                                        <span className="text-[11px] text-gray-400">
                                            {comentario.fecha_hora
                                                ? dayjs(comentario.fecha_hora).format("DD/MM/YYYY HH:mm")
                                                : ""}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-700 pl-9 leading-normal">
                                        {comentario.comentario}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Sidebar de Detalles Detallados */}
                <div className="w-full lg:w-80 shrink-0">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 sticky top-4 space-y-5">
                        <h3 className="text-md font-bold text-gray-900 border-b border-gray-100 pb-2">
                            Detalles del Ticket
                        </h3>

                        <ul className="space-y-3 text-xs text-gray-600">
                            <li className="flex justify-baseline items-center">
                                <span className="font-semibold text-gray-500">Fecha creación:</span>
                                <span className="font-medium text-gray-800 pl-3" >
                                    {ticket.created_at
                                        ? dayjs(ticket.created_at).format("DD/MM/YYYY HH:mm")
                                        : "N/A"}
                                </span>
                            </li>
                            <li className="flex justify-baseline items-center">
                                <span className="font-semibold text-gray-500">Solicitante:</span>
                                <span className="font-medium text-white px-3 bg-green-600 rounded-4xl">
                                    {textOrganic(ticket.usuario_reporta?.nombre || "Desconocido")}
                                </span>
                            </li>
                            <li className="flex justify-baseline items-center">
                                <span className="font-semibold text-gray-500">Asignado a:</span>
                                <span className="font-medium  text-white px-3 bg-red-600 rounded-4xl">
                                    {textOrganic(ticket.usuario_asignado?.nombre || "Desconocido")} -
                                </span>
                            </li>
                            <li className="flex justify-baseline items-center">
                                <span className="font-semibold text-gray-500">Categoría:</span>
                                <span className="font-medium text-gray-800 pl-3">
                                    {ticket.categoria_incidentes?.descripcion || "Sin categoría"}
                                </span>
                            </li>
                            <li className="flex justify-baseline items-center">
                                <span className="font-semibold text-gray-500">Tipo:</span>
                                <span className="font-medium text-gray-800  pl-3">
                                    {ticket.tipo_tickets?.descripcion || "N/A"}
                                </span>
                            </li>


                            <li className="flex justify-baseline items-center">
                                <span className="font-semibold text-gray-500">Establecimiento:</span>
                                <span className="font-medium text-gray-800  pl-3">
                                    {ticket.establecimientos?.nombre || "N/A"}
                                </span>
                            </li>
                            <li className="flex justify-baseline items-center">
                                <span className="font-semibold text-gray-500">Sector:</span>
                                <span className="font-medium text-gray-800  pl-3">
                                    {ticket.sectores?.nombre || "N/A"}
                                </span>
                            </li>
                            <li className="flex justify-baseline items-center">
                                <span className="font-semibold text-gray-500">Puesto:</span>
                                <span className="font-medium text-gray-800  pl-3">
                                    {ticket.puestos?.descripcion || "N/A"}
                                </span>
                            </li>
                            <li className="flex justify-baseline items-center">
                                <span className="font-semibold text-gray-500">Equipo asociado:</span>
                                <span className="font-medium text-gray-800  pl-3">
                                    {ticket.id_equipo ? `#${ticket.id_equipo} ${ticket.equipos?.modelo || ""}` : "No asignado"}
                                </span>
                            </li>
                        </ul>
                        {isAuthTicket && (
                            <div>
                                <div className="py-4 border-t border-gray-100 space-y-2">
                                    <button
                                        onClick={() => setIsOpen(true)}
                                        className="w-full bg-blue-50 text-blue-600 font-medium px-4 py-2 rounded-lg text-xs hover:bg-blue-100 transition"
                                    >
                                        Escalar Ticket
                                    </button>
                                    <button
                                        onClick={() => setIsOpenState(true)}
                                        className="w-full bg-blue-50 text-blue-600 font-medium px-4 py-2 rounded-lg text-xs hover:bg-blue-100 transition"
                                    >
                                        Cambiar Estado
                                    </button>

                                    <ModalAssignUserByTicket
                                        isOpen={isOpen}
                                        onClose={() => setIsOpen(false)}
                                        users={formattedUsers}
                                        incident={id}
                                    />
                                    <ModalUpdateStateIncident
                                        isOpen={isOpenStates}
                                        onClose={() => setIsOpenState(false)}
                                        incident={ticket}
                                    />
                                </div>
                                <div className="pt-3 border-t border-gray-100 space-y-2">
                                    {
                                        (userLocalS.idusuario === ticket.id_usuario_reporta || userLocalS.idusuario === ticket.id_usuario_asignado || userLocalS.idrol === 6) &&
                                        <button
                                            onClick={() => setisOpenCerrarIncident(true)}
                                            className="w-full bg-red-50 text-red-600 font-medium px-4 py-2 rounded-lg text-xs hover:bg-red-100 transition"
                                        >
                                            Cerrar Ticket
                                        </button>
                                    }
                                    <ModalCerrarIncident
                                        isOpen={isOpenCerrarIncident}
                                        onClose={() => setisOpenCerrarIncident(false)}
                                        incident={ticket}
                                    />
                                </div>
                            </div>
                        )}

                    </div>
                </div>

            </div>

        </div >

    );
}