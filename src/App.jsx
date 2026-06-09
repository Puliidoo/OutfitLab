import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Catalogo from "./pages/Catalogo";
import Dashboard from "./pages/Dashboard";
import Perfil3D from "./pages/Perfil3D";
import Carrito from "./pages/Carrito";
import Perfil from "./pages/Perfil";
import MisLooks from "./pages/MisLooks";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
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
      <Route path="/carrito" element={
        <PrivateRoute>
          <Carrito />
        </PrivateRoute>
      } />
      <Route path="/perfil" element={
        <PrivateRoute>
          <Perfil />
        </PrivateRoute>
      } />
      <Route path="/mislooks" element={
        <PrivateRoute>
          <MisLooks />
        </PrivateRoute>
      } />
    </Routes>
  );
}