import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Por ahora simulamos el login, luego conectas con tu backend
    login({ name: "Usuario", email: form.email });
    navigate("/dashboard");
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#121212",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        backgroundColor: "#1e1e1e",
        padding: "40px",
        borderRadius: "16px",
        width: "360px",
        border: "1px solid #2e2e2e",
      }}>
        <h2 style={{ color: "white", marginBottom: "28px", textAlign: "center" }}>
          Iniciar sesión
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #333",
              backgroundColor: "#2a2a2a",
              color: "white",
              fontSize: "1rem",
            }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #333",
              backgroundColor: "#2a2a2a",
              color: "white",
              fontSize: "1rem",
            }}
          />
          <button
            onClick={handleSubmit}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#555",
              color: "white",
              fontSize: "1rem",
              cursor: "pointer",
              marginTop: "8px",
            }}
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}