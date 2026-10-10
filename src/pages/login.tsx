import { useState } from 'react'
import { Link } from 'react-router-dom'
import { login } from "../services/authService";

interface LoginForm {
    email: string;
    password: string;
}

const Login = ({ setUser }: { setUser?: (user: any) => void }) => {
    const [formDataLogin, setDataForm] = useState<LoginForm>({ email: '', password: '' });
    const [messege, setMessege] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDataForm({ ...formDataLogin, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessege('');

        try {
            const user = await login(formDataLogin.email, formDataLogin.password);

            if (setUser) {
                setUser(user);
            }

            setMessege(`🎉 ¡Bienvenido de nuevo, ${user?.nombre || user?.id_usuario || ''}!`);

            setTimeout(() => {
                window.location.href = "/dashboard"; // Fuerza la recarga completa al entrar
            }, 400);

        } catch (err: any) {
            setMessege("❌ Error: " + (err.message || "Credenciales inválidas"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                    alt="Your Company"
                    className="mx-auto h-10 w-auto"
                />
                <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-white">
                    Iniciar sesión con tu cuenta
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-100">
                            Tu correo electrónico
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                value={formDataLogin.email}
                                onChange={handleChange}
                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-100">
                                Contraseña
                            </label>
                            <div className="text-sm">
                                <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">
                                    ¿Olvidaste mi contraseña?
                                </a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                autoComplete="current-password" // 👈 Agrega esta línea
                                value={formDataLogin.password}
                                onChange={handleChange}
                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50"
                        >
                            {loading ? "Iniciando sesión..." : "Ingresar"}
                        </button>
                    </div>
                </form>

                {messege && (
                    <p className="text-white text-center mt-5 text-sm font-medium">
                        {messege}
                    </p>
                )}

                <p className="mt-10 text-center text-sm text-gray-400">
                    ¿No sos miembro?{" "}
                    <Link to="/contact" className="font-semibold text-indigo-400 hover:text-indigo-300">
                        Prueba gratuita de 14 días
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;