import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Catalogo from "./pages/Catalogo";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Perfil3D from "./pages/Perfil3D"; 

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Rutas Protegidas */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      
      <Route path="/catalogo" element={
        <PrivateRoute>
          <Catalogo />
        </PrivateRoute>
      } />

      <Route path="/perfil3d" element={
        <PrivateRoute>
          <Perfil3D />
        </PrivateRoute>
      } />

      {/* Redirección por defecto si la ruta no existe */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}