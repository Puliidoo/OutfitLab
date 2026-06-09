import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Credenciales incorrectas");
        return;
      }
      login({ name: data.nombre, email: form.email });
      navigate("/dashboard");
    } catch {
      setError("No se puede conectar con el servidor");
    }
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
          {error && (
            <p style={{ color: "#ff6b6b", fontSize: "0.9rem", textAlign: "center", margin: 0 }}>
              {error}
            </p>
          )}
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

          <p style={{ color: "#888", fontSize: "0.9rem", textAlign: "center", margin: 0 }}>
            ¿No tienes cuenta?{" "}
            <span
              onClick={() => navigate("/register")}
              style={{ color: "#fff", cursor: "pointer", textDecoration: "underline" }}
            >
              Regístrate aquí
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}