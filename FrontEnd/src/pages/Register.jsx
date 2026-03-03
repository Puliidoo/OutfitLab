import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Estilos fuera del componente para mayor limpieza
const inputStyle = { 
  padding: "12px", 
  borderRadius: "8px", 
  border: "1px solid #444", 
  backgroundColor: "#1e1e1e", 
  color: "white",
  fontSize: "1rem"
};

const buttonStyle = { 
  marginTop: "10px", 
  padding: "12px", 
  borderRadius: "8px", 
  border: "none",
  backgroundColor: "#444", 
  color: "white", 
  fontSize: "1.1rem",
  cursor: "pointer",
  transition: "0.3s"
};

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      // Llamada al BackEnd
      const response = await axios.post("http://localhost:3000/api/usuarios", {
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password
      });

      if (response.status === 201) {
        alert("¡Usuario creado con éxito!");
        navigate("/"); 
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      alert(error.response?.data?.error || "Error al conectar con el servidor");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#1e1e1e", padding: "40px 20px" }}>
      
      <motion.h1 
        initial={{ opacity: 0, y: 40 }} 
        animate={{ opacity: 1, y: 0 }} 
        style={{ fontSize: "3rem", color: "#f0f0f0", marginBottom: "20px" }}
      >
        Crear cuenta
      </motion.h1>

      <motion.form 
        onSubmit={handleSubmit}
        style={{ backgroundColor: "#2a2a2a", padding: "30px 40px", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "20px", width: "100%", maxWidth: "400px", boxShadow: "0px 0px 20px rgba(0,0,0,0.4)" }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ color: "#ddd" }}>Nombre</label>
          <input name="nombre" value={formData.nombre} onChange={handleChange} type="text" placeholder="Tu nombre" required style={inputStyle} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ color: "#ddd" }}>Email</label>
          <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Introduce tu email" required style={inputStyle} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ color: "#ddd" }}>Contraseña</label>
          <input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Crea una contraseña" required style={inputStyle} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ color: "#ddd" }}>Confirmar contraseña</label>
          <input name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" placeholder="Repite la contraseña" required style={inputStyle} />
        </div>

        <button 
          type="submit" 
          style={buttonStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = "#555"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#444"}
        >
          Crear cuenta
        </button>
      </motion.form>

      <button 
        onClick={() => navigate("/")} 
        style={{ marginTop: "25px", background: "none", border: "none", color: "#ccc", cursor: "pointer", textDecoration: "underline" }}
      >
        Volver al inicio
      </button>
    </div>
  );
}