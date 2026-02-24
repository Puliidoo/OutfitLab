import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1e1e1e",
        padding: "40px 20px",
      }}
    >
      {/* TÍTULO */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{
          fontSize: "3rem",
          fontWeight: "600",
          color: "#f0f0f0",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        Crear cuenta
      </motion.h1>

      {/* DESCRIPCIÓN */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
        style={{
          fontSize: "1.2rem",
          color: "#ccc",
          textAlign: "center",
          marginBottom: "30px",
          maxWidth: "500px",
          lineHeight: "1.6",
        }}
      >
        Únete a OutfitLab y empieza a probar ropa virtualmente con tu propio estilo.
      </motion.p>

      {/* FORMULARIO */}
      <motion.form
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
        style={{
          backgroundColor: "#2a2a2a",
          padding: "30px 40px",
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0px 0px 20px rgba(0,0,0,0.4)",
        }}
      >
        {/* Nombre */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ color: "#ddd", fontSize: "1rem" }}>Nombre</label>
          <input
            type="text"
            placeholder="Tu nombre"
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #444",
              backgroundColor: "#1e1e1e",
              color: "white",
              fontSize: "1rem",
            }}
          />
        </div>

        {/* Email */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ color: "#ddd", fontSize: "1rem" }}>Email</label>
          <input
            type="email"
            placeholder="Introduce tu email"
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #444",
              backgroundColor: "#1e1e1e",
              color: "white",
              fontSize: "1rem",
            }}
          />
        </div>

        {/* Contraseña */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ color: "#ddd", fontSize: "1rem" }}>Contraseña</label>
          <input
            type="password"
            placeholder="Crea una contraseña"
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #444",
              backgroundColor: "#1e1e1e",
              color: "white",
              fontSize: "1rem",
            }}
          />
        </div>

        {/* Confirmar contraseña */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ color: "#ddd", fontSize: "1rem" }}>
            Confirmar contraseña
          </label>
          <input
            type="password"
            placeholder="Repite la contraseña"
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #444",
              backgroundColor: "#1e1e1e",
              color: "white",
              fontSize: "1rem",
            }}
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          style={{
            marginTop: "10px",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#444",
            color: "white",
            fontSize: "1.1rem",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#555")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#444")}
        >
          Crear cuenta
        </button>
      </motion.form>

      {/* BOTÓN VOLVER AL INICIO */}
      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "25px",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#333",
          color: "white",
          fontSize: "1rem",
          cursor: "pointer",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#444")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#333")}
      >
        Volver al inicio
      </button>
    </div>
  );
}
