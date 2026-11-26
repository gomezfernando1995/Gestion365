import { TypeAnimation } from "react-type-animation";

interface Cualidad {
    titulo: string;
    descripcion: string;
    icono: string;
}

const CUALIDADES: Cualidad[] = [
    {
        titulo: "Cercanía y confianza",
        descripcion:
            "Acompañamos a cada equipo con trato directo y soluciones pensadas para su día a día.",
        icono: "bi-people",
    },
    {
        titulo: "Agilidad operativa",
        descripcion:
            "Reemplazamos procesos lentos y desordenados por dinámicas simples y resolutivas.",
        icono: "bi-lightning-charge",
    },
    {
        titulo: "Mejora continua",
        descripcion:
            "Evolucionamos junto a nuestros clientes para sostener altos estándares de calidad.",
        icono: "bi-graph-up-arrow",
    },
];

export default function AboutUs() {
    return (
        <div className="relative min-h-screen w-full text-white overflow-x-hidden">
            <div className="fixed inset-0 -z-10 bg-slate-950/70" />

            {/* Contenido breve centrado */}
            <main className="min-h-screen pt-5 pb-13 px-4 sm:px-8 flex items-center justify-center">
                <div className="max-w-4xl w-full text-center space-y-10">
                    <div className="space-y-20">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                            Tecnología cercana, <span className="text-blue-400">operaciones sin pausa</span>
                        </h1>
                    </div>

                    <TypeAnimation
                        sequence={[
                            "Hola! 👋 Somos Gestion365  un proyecto empresarial enfocado en brindar soluciones tecnológicas claras, cercanas y confiables para que cada organización trabaje con orden, rapidez y compromiso real con sus clientes",
                        ]}
                        wrapper="p"
                        speed={60}
                        cursor={true}
                        repeat={0}
                        className="min-h-20 sm:min-h-18 text-sm sm:text-lg text-slate-200 max-w-xl mx-auto leading-relaxed"
                    />

                    {/* 3 Cualidades de la empresa */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                        {CUALIDADES.map((item) => (
                            <div
                                key={item.titulo}
                                className="group relative min-h-45 flex flex-col justify-between bg-slate-900/80 backdrop-blur-md 
                                  rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg p-7 overflow-hidden hover:-translate-y-1.5
                                   transition-all duration-300 shadow-lg"
                            >
                                <div className="flex items-center gap-2.5 text-blue-400 mb-2">
                                    <i className={`bi ${item.icono} text-lg`} />
                                    <h2 className="font-semibold text-base text-white">
                                        {item.titulo}
                                    </h2>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                    {item.descripcion}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}