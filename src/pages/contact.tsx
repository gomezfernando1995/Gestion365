import React, { useRef, useState } from "react";
import {
    EnvelopeIcon,
    MapPinIcon,
    PaperAirplaneIcon,
    CheckCircleIcon
} from "@heroicons/react/24/outline";
import emailjs from "@emailjs/browser";

export default function ContactUs() {
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        asunto: "",
        mensaje: "",
    });
    const formRef = useRef<HTMLFormElement>(null);
    const [loading, setLoading] = useState(false);
    const [enviado, setEnviado] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const SERVICE_ID = "service_t3lhs5j";
        const TEMPLATE_ID = "template_moustp9";
        const PUBLIC_KEY = "0FSGzlb2jbJQnJ929";

        if (formRef.current) {
            emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
                .then(() => {
                    setLoading(false);
                    setEnviado(true);
                })
                .catch((error) => {
                    console.error("Error enviando email:", error);
                    setLoading(false);
                    alert("Ocurrió un error al enviar el mensaje.");
                });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="max-w-5xl w-full rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 ">

                <div className="md:col-span-5 bg-blue-950/60 p-8 text-gray-200 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/30 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold tracking-tight mb-2 text-white">Contáctanos</h2>
                        <p className="text-blue-200/80 text-sm mb-8">
                            ¿Tenés dudas, consultas sobre el sistema o requerís una cuenta? Escribinos y te responderemos a la brevedad.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 bg-blue-900/60 rounded-lg shrink-0 border border-blue-800/50">
                                    <EnvelopeIcon className="w-5 h-5 text-blue-300" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-300">Email</h4>
                                    <p className="text-sm font-medium text-white">secondgomezfernando1995@gmail.com
</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-2.5 bg-blue-900/60 rounded-lg shrink-0 border border-blue-800/50">
                                    <MapPinIcon className="w-5 h-5 text-blue-300" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-300">Ubicación</h4>
                                    <p className="text-sm font-medium text-white">Buenos Aires, Argentina</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-6 border-t border-blue-900/80 text-xs text-blue-300/80 relative z-10">
                        Atención de Lunes a Viernes de 8:00 a 18:00 hs.
                    </div>
                </div>

                {/* Columna Derecha: Formulario en Blanco puro */}
                <div className="md:col-span-7 bg-white p-8">
                    {enviado ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-fadeIn">
                            <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Mensaje Enviado!</h3>
                            <p className="text-gray-600 text-sm max-w-sm mb-6">
                                Gracias por comunicarte. Nuestro equipo analizará tu consulta y te responderá lo antes posible.
                            </p>
                            <button
                                type="button"
                                onClick={() => setEnviado(false)}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition cursor-pointer"
                            >
                                Enviar otro mensaje
                            </button>
                        </div>
                    ) : (
                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Envíanos un mensaje</h3>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                                    Nombre Completo <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    required
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Ej: Alfonso Gomez"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                                    Correo Electrónico <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="ejemplo@correo.com"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                                    Asunto <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="asunto"
                                    required
                                    value={formData.asunto}
                                    onChange={handleChange}
                                    placeholder="Ej: Quiero una cuenta / Soporte técnico"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                                    Mensaje <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="mensaje"
                                    required
                                    rows={4}
                                    value={formData.mensaje}
                                    onChange={handleChange}
                                    placeholder="Escribe aquí tu consulta en detalle..."
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-blue-900 hover:bg-blue-800 active:bg-blue-950 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-md transition cursor-pointer mt-2"
                            >
                                {loading ? (
                                    <span>Enviando...</span>
                                ) : (
                                    <>
                                        <PaperAirplaneIcon className="w-4 h-4" />
                                        <span>Enviar Mensaje</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>

            </div>
        </div>
    );
}