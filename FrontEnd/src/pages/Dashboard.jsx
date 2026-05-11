import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const buttons = [
  {
    label: "Catálogo",
    icon: "🛍️",
    route: "/catalogo",
    desc: "Explora toda la ropa disponible",
  },
  {
    label: "Perfil 3D",
    icon: "🧍",
    route: "/perfil3d",
    desc: "Crea tu avatar y prueba outfits",
  },
  {
    label: "Carrito",
    icon: "🛒",
    route: "/carrito",
    desc: "Revisa tus prendas seleccionadas",
  },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#121212",
      color: "white",
      fontFamily: "sans-serif",
    }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "24px 48px",
        borderBottom: "1px solid #2a2a2a",
      }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: "700" }}>OutfitLab</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{ color: "#aaa" }}>Hola, <strong style={{ color: "white" }}>{user?.name || "Usuario"}</strong></span>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              border: "1px solid #444",
              backgroundColor: "transparent",
              color: "#ccc",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* DESCRIPCIÓN */}
      <div style={{
        padding: "60px 48px 40px",
        maxWidth: "800px",
        margin: "0 auto",
        textAlign: "center",
      }}>
        <h2 style={{ fontSize: "2.2rem", fontWeight: "700", marginBottom: "16px" }}>
          Bienvenido a tu espacio 👗
        </h2>
        <p style={{ color: "#aaa", fontSize: "1.1rem", lineHeight: "1.7" }}>
          OutfitLab te permite explorar moda, crear tu perfil 3D y montar outfits 
          antes de comprar. Todo en un solo lugar.
        </p>
      </div>

      {/* BOTONES PRINCIPALES */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "28px",
        flexWrap: "wrap",
        padding: "0 48px 60px",
      }}>
        {buttons.map((btn) => (
          <div
            key={btn.route}
            onClick={() => navigate(btn.route)}
            style={{
              width: "200px",
              height: "200px",
              backgroundColor: "#1e1e1e",
              border: "1px solid #2e2e2e",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "14px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#2a2a2a";
              e.currentTarget.style.borderColor = "#555";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#1e1e1e";
              e.currentTarget.style.borderColor = "#2e2e2e";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <span style={{ fontSize: "3rem" }}>{btn.icon}</span>
            <span style={{ fontSize: "1.1rem", fontWeight: "600" }}>{btn.label}</span>
            <span style={{ fontSize: "0.78rem", color: "#888", textAlign: "center", padding: "0 10px" }}>
              {btn.desc}
            </span>
          </div>
        ))}
      </div>

      {/* SECCIÓN DE FOTOS / DESCRIPCIÓN EXTRA */}
      <div style={{
        backgroundColor: "#1a1a1a",
        padding: "60px 48px",
        textAlign: "center",
        borderTop: "1px solid #2a2a2a",
      }}>
        <h3 style={{ fontSize: "1.5rem", marginBottom: "40px", color: "#ddd" }}>
          ¿Qué puedes hacer en OutfitLab?
        </h3>
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "32px",
          flexWrap: "wrap",
        }}>
          {[
            { emoji: "👗", title: "Explora moda", text: "Miles de prendas organizadas por estilo y temporada." },
            { emoji: "🧍‍♂️", title: "Tu avatar 3D", text: "Prueba outfits en tu modelo personalizado antes de comprar." },
            { emoji: "💳", title: "Compra fácil", text: "Añade al carrito y finaliza tu compra en segundos." },
          ].map((item) => (
            <div key={item.title} style={{
              width: "220px",
              padding: "28px 20px",
              backgroundColor: "#222",
              borderRadius: "14px",
              border: "1px solid #2e2e2e",
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>{item.emoji}</div>
              <h4 style={{ marginBottom: "10px", fontSize: "1rem" }}>{item.title}</h4>
              <p style={{ color: "#888", fontSize: "0.85rem", lineHeight: "1.6" }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}