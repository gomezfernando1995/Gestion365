import  { useState, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabase';

interface RegisterForm {
    email: string;
    password: string
    confirmPass: string
}

const Register = () => {


    const [formData, setFormData] = useState<RegisterForm>({ email: '', password: '', confirmPass: '' });
    const [message, setMessege] = useState<String>('');

    // FUNCION PARA ACTUALIZAR EL ESTADO CUANDO EL USUARIO ESCRIBE;
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target; //Crea y guarda el tipo de dato del target
        setFormData({ ...formData, [name]: value }); //Guarda la informacion introducida
    };

    //PROCEMIENTO DE REGISTRO---------------------------------------------------------------------------------------------------------------------------------

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault(); //Evita recargar la pagina cuando se presiona el boton 
        const { email, password, confirmPass } = formData;

        //Campos vacios
        if (!email || !password || !confirmPass) {
            setMessege("⚠️ Todos los campos son obligatorios.")
            return;
        }
        //Contraseñas indenticas
        if (password !== confirmPass) {
            setMessege('❌ Las contraseñas no coinciden.');
            return;
        }
        //Creacion de username automatica
        const generateUserName = email.split('@')[0];

        //CONSULTAR SI EXISTE EN BASE DE DATOS EL USUARIO Y CORREO
        const { data: authData, error } = await supabase.auth.signUp({
            email,
            password,
        });


        if (error) {
            if (error.message.includes("User already registered")) {
                setMessege("⚠️ Este correo ya está registrado. Intenta iniciar sesión.");
            } else {
                setMessege(`❌ Error: ${error.message}`);
            }
        } else {
            setMessege("✅ Usuario registrado con éxito. Revisa tu correo para confirmar la cuenta.");
        }

        if (!error && authData.user) {
            const { error: insertError } = await supabase.from("usuarios").insert([
                {
                    uid: authData.user.id,
                    usuario: generateUserName,
                    correo: email,
                    contrasena: password,
                    nombre:"Sin nombre", 
                    created_at: new Date(),
                    idrol:5,
                },
            ]);

            if (insertError) {
                console.error("❌ Error al insertar en usuarios:", insertError.message);
                setMessege(`❌ Error al guardar en tabla usuarios: ${insertError.message}`);
            } else {
                setMessege("✅ Usuario registrado y guardado en la tabla usuarios.");
            }
        }
        //FIN DE REGISTRO---------------------------------------------------------------------------------------------------------------------------------
    }

    
    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" className="mx-auto h-10 w-auto" />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Crea tu cuenta gratuita</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-100">Tu correo electronico</label>
                        <div className="mt-2">
                            <input id="email" type="email" name="email" required autoComplete="email" value={formData.email} onChange={handleChange} className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">Ingrese contraseña</label>
                        <div className="mt-2">
                            <input id="password" type="text" name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required autoComplete="new-password" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base
                             text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2
                              focus:outline-indigo-500 sm:text-sm/6" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">Confirmar contraseña</label>
                        <div className="mt-2">
                            <input id="confirmPass" type="text" name="confirmPass" value={formData.confirmPass} onChange={handleChange}
                                required className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md
                      bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2
                       focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Crear una cuenta</button>
                    </div>
                </form>
                {message && <p className='text-white  text-center mt-5'>{message}</p>}

                <p className="mt-7 text-center text-sm/6 text-gray-400">
                    ¿Ya tienes una cuenta?

                    <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300"> Inicia sesión aquí</Link>
                </p>

            </div>

        </div>
    )

}
export default Register