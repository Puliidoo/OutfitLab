import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  // En lugar de useAuth, miramos si hay un usuario guardado en el navegador
  const user = localStorage.getItem("userEmail"); 

  // Si hay usuario, pasa. Si no, al login.
  return user ? children : <Navigate to="/login" />;
}