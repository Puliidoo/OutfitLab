import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      style={{
        width: "100%",
        padding: "20px 40px",
        backgroundColor: "#1e1e1e",
        display: "flex",
        justifyContent: "flex-start",   // ← Mueve todo hacia la izquierda
        alignItems: "center",
        gap: "40px",                     // ← Espacio entre logo y botones
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 100,
        boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
      }}
    >
      {/* LOGO */}
      <Link to="/" style={{ textDecoration: "none" }}>
        <h1
          style={{
            color: "white",
            fontSize: "1.8rem",
            fontWeight: "600",
          }}
        >
          OutfitLab
        </h1>
      </Link>

      {/* BOTONES */}
      <div style={{ display: "flex", gap: "15px" }}>
        <Link to="/catalogo">
          <button
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#333",
              color: "white",
              cursor: "pointer",
              fontSize: "1rem",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#444")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#333")}
          >
            Catálogo
          </button>
        </Link>

        <Link to="/login">
          <button
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#444",
              color: "white",
              cursor: "pointer",
              fontSize: "1rem",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#555")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#444")}
          >
            Iniciar sesión
          </button>
        </Link>

        <Link to="/register">
          <button
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#555",
              color: "white",
              cursor: "pointer",
              fontSize: "1rem",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#666")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#555")}
          >
            Registrarse
          </button>
        </Link>
      </div>
    </nav>
  );
}
