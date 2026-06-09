import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: "", email: "", password: "", confirmar: "" });
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.nombre || !form.email || !form.password) {
      setError("Todos los campos son obligatorios");
      return;
    }
    if (form.password !== form.confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: form.nombre, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al crear la cuenta");
        return;
      }
      setExito(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setError("No se puede conectar con el servidor");
    }
  };

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

      <motion.form
        onSubmit={handleSubmit}
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
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ color: "#ddd", fontSize: "1rem" }}>Nombre</label>
          <input
            type="text"
            placeholder="Tu nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            style={inputStyle}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ color: "#ddd", fontSize: "1rem" }}>Email</label>
          <input
            type="email"
            placeholder="Introduce tu email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={inputStyle}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ color: "#ddd", fontSize: "1rem" }}>Contraseña</label>
          <input
            type="password"
            placeholder="Crea una contraseña"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={inputStyle}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ color: "#ddd", fontSize: "1rem" }}>Confirmar contraseña</label>
          <input
            type="password"
            placeholder="Repite la contraseña"
            value={form.confirmar}
            onChange={(e) => setForm({ ...form, confirmar: e.target.value })}
            style={inputStyle}
          />
        </div>

        {error && (
          <p style={{ color: "#ff6b6b", fontSize: "0.9rem", textAlign: "center", margin: 0 }}>
            {error}
          </p>
        )}
        {exito && (
          <p style={{ color: "#6bff8e", fontSize: "0.9rem", textAlign: "center", margin: 0 }}>
            ¡Cuenta creada! Redirigiendo al login...
          </p>
        )}

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
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#555")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#444")}
        >
          Crear cuenta
        </button>

        <p style={{ color: "#888", fontSize: "0.9rem", textAlign: "center", margin: 0 }}>
          ¿Ya tienes cuenta?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ color: "#fff", cursor: "pointer", textDecoration: "underline" }}
          >
            Inicia sesión
          </span>
        </p>
      </motion.form>
    </div>
  );
}

const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #444",
  backgroundColor: "#1e1e1e",
  color: "white",
  fontSize: "1rem",
};
