export function textOrganic(text: any): string {
  if (!text || typeof text !== "string") {
    return "";
  }
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

//Funcion para obtener solamente la primera del string
export function firstLetter(text: string): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase();
}

export function formatFechaCustom(dateString: string) {
  const fecha = new Date(dateString);
  const day = fecha.getDate();
  const month = fecha.toLocaleString("es-AR", { month: "short" }); 
  const year = fecha.getFullYear().toString().slice(-2); // últimos 2 dígitos

  return `${day} ${textOrganic(month)} ‘${year}`;
}

export function formatDateForSupabase(date: Date): string {
  return date.toISOString().split(".")[0] + "Z";
}