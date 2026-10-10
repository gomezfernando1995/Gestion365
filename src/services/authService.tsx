
import { supabase } from "./supabase";

export async function login(email: string, password: string) {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (authError) throw new Error(authError.message);

  const uid_supabase = authData.user.id;
  const { data: userData, error: userError } = await supabase
    .from("usuarios").select(`*,roles!fk_rol(id_rol, nombre, descripcion),empresas!usuarios_id_empresa_fkey(id_empresa,nombre),establecimientos!usuarios_id_establecimiento_fkey(id_establecimiento,nombre)`).eq("uid", uid_supabase).maybeSingle();

  if (userError) throw new Error(userError.message);
  localStorage.setItem("currentUser", JSON.stringify(userData));
  return userData;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);

  localStorage.removeItem("currentUser");
  localStorage.removeItem("sb-cpneukmbxazghdolcgmn-auth-token"); // token de supabase

  // Opcional: redirigir al login
  window.location.href = "/login";
}