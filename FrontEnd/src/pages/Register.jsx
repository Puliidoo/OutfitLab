import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();
  
  // Estado para capturar los datos
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmarPassword: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación rápida de contraseña
    if (formData.password !== formData.confirmarPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      // Intentamos enviar los datos al BackEnd
      const res = await axios.post("http://localhost:3000/api/usuarios", {
        email: formData.email,
        password: formData.password
      });

      if (res.status === 201 || res.status === 200) {
        alert("¡Cuenta creada con éxito!");
        navigate("/"); // Nos manda de vuelta al Login
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      alert(error.response?.data?.error || "Error al conectar con el servidor");
    }
  };

  return (
    <div style={containerStyle}>
      {/* TÍTULO DE LA MARCA */}
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
          Crear cuenta
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={inputGroup}>
            <label style={labelStyle}>Correo electrónico</label>
            <input 
              type="email" 
              required
              placeholder="ejemplo@correo.com" 
              style={inputStyle} 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Contraseña</label>
            <input 
              type="password" 
              required
              placeholder="Mínimo 6 caracteres" 
              style={inputStyle} 
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Repetir contraseña</label>
            <input 
              type="password" 
              required
              placeholder="Confirma tu contraseña" 
              style={inputStyle} 
              onChange={(e) => setFormData({...formData, confirmarPassword: e.target.value})}
            />
          </div>

          <button type="submit" style={buttonStyle}>
            Registrarme
          </button>
        </form>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <p 
            onClick={() => navigate("/")} 
            style={{ color: "#3498db", cursor: "pointer", fontSize: "0.9rem", fontWeight: "bold" }}
          >
            ¿Ya tienes cuenta? Inicia sesión aquí
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// --- ESTILOS ---
const containerStyle = {
  minHeight: "100vh",
  backgroundColor: "#121212",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "Arial, sans-serif",
  padding: "20px"
};

const logoStyle = {
  fontSize: "3rem",
  fontWeight: "900",
  letterSpacing: "8px",
  color: "white",
  marginBottom: "30px",
  textAlign: "center"
};

const cardStyle = {
  backgroundColor: "#1e1e1e",
  padding: "30px",
  borderRadius: "15px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  width: "100%",
  maxWidth: "380px"
};

const inputGroup = {
  display: "flex",
  flexDirection: "column",
  gap: "5px"
};

const labelStyle = {
  color: "#bbb",
  fontSize: "0.85rem",
  marginLeft: "5px"
};

const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #333",
  backgroundColor: "#252525",
  color: "white",
  outline: "none",
  fontSize: "1rem"
};

const buttonStyle = {
  marginTop: "10px",
  padding: "14px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#ffffff",
  color: "#000",
  fontWeight: "bold",
  fontSize: "1rem",
  cursor: "pointer",
  transition: "0.2s"
};