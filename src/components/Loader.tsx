interface LoaderProps {
  text: string;
  url: string;
}

export default function Loader({ text, url }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-900">
      <img
        src={url}
        alt="Cargando contenido"
        className="w-64 h-64 mb-6 animate-pulse"
      />
      <p className="text-xl font-semibold animate-bounce">
        {text}
      </p>
    </div>
  );
}