import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: "100%",
        padding: "20px 40px",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        background: "#2a2a2a",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", gap: "15px" }}>
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            background: "#444",
            color: "white",
            cursor: "pointer",
          }}
        >
          Iniciar sesión
        </button>

        <button
          onClick={() => navigate("/register")}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            background: "#666",
            color: "white",
            cursor: "pointer",
          }}
        >
          Crear cuenta
        </button>
      </div>
    </div>
  );
}
