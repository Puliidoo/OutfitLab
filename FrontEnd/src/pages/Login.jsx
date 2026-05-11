import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // 1. Llamada al BackEnd
      const res = await axios.post("http://localhost:3000/api/login", formData);

      if (res.status === 200) {
        // 2. GUARDAR DATOS CLAVE
        // Guardamos el email porque el PrivateRoute lo necesita para dejarte pasar
        localStorage.setItem("userEmail", formData.email);
        // Opcional: Guardamos el nombre por si quieres mostrarlo en el Dashboard
        localStorage.setItem("userNombre", res.data.nombre || "Usuario");
        
        alert("¡Bienvenido de nuevo!");
        
        // 3. REDIRIGIR
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error en login:", error);
      alert(error.response?.data?.error || "Correo o contraseña incorrectos");
    }
  };

  return (
    <div style={containerStyle}>
      <motion.h1 
        initial={{ y: -50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        style={logoStyle}
      >
        OUTFITLAB
      </motion.h1>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        style={cardStyle}
      >
        <h2 style={{ color: "white", textAlign: "center", marginBottom: "20px" }}>
          Iniciar Sesión
        </h2>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            required
            style={inputStyle} 
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            required
            style={inputStyle} 
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          
          <button type="submit" style={buttonStyle}>
            Entrar
          </button>
        </form>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: "10px" }}>
            ¿No tienes una cuenta?
          </p>
          <button 
            type="button"
            onClick={() => navigate("/register")} 
            style={secondaryButtonStyle}
          >
            Registrarse ahora
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// --- ESTILOS ---
const containerStyle = { minHeight: "100vh", backgroundColor: "#121212", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontFamily: "Arial, sans-serif" };
const logoStyle = { fontSize: "3.5rem", fontWeight: "900", letterSpacing: "8px", color: "white", marginBottom: "30px" };
const cardStyle = { backgroundColor: "#1e1e1e", padding: "40px", borderRadius: "15px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", width: "100%", maxWidth: "350px" };
const inputStyle = { padding: "12px", borderRadius: "8px", border: "1px solid #333", backgroundColor: "#252525", color: "white", outline: "none" };
const buttonStyle = { padding: "12px", borderRadius: "8px", border: "none", backgroundColor: "#ffffff", color: "#000", fontWeight: "bold", cursor: "pointer" };
const secondaryButtonStyle = { backgroundColor: "transparent", color: "#3498db", border: "1px solid #3498db", padding: "8px 15px", borderRadius: "8px", cursor: "pointer", fontSize: "0.9rem", fontWeight: "bold", width: "100%" };