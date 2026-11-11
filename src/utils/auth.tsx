export const getCurrentUserLocalStorage = () => {
  try {
    const item = localStorage.getItem("currentUser");
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.error("Error parseando currentUser del localStorage:", e);
    return null;
  }
};