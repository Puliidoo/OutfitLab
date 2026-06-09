import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MisLooks() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [looks, setLooks] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [lookSeleccionado, setLookSeleccionado] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/outfits/${user?.email}`)
      .then((r) => r.json())
      .then((data) => {
        setLooks(Array.isArray(data) ? data : []);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, [user]);

  const eliminar = async (id) => {
    await fetch(`http://localhost:3000/api/outfits/${id}`, { method: "DELETE" });
    setLooks(looks.filter((l) => l.id !== id));
    if (lookSeleccionado?.id === id) setLookSeleccionado(null);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#121212", color: "white", fontFamily: "sans-serif" }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 48px", borderBottom: "1px solid #2a2a2a" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: "700" }}>OutfitLab</h1>
        <button onClick={() => navigate("/dashboard")} style={btnSecundario}>← Volver al inicio</button>
      </div>

      <div style={{ maxWidth: "1100px", margin: "48px auto", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
          <div>
            <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "8px" }}>Mis Looks</h2>
            <p style={{ color: "#888" }}>Todos los outfits que has generado con el Probador Virtual.</p>
          </div>
          <button onClick={() => navigate("/perfil3d")} style={btnPrimario}>
            + Generar nuevo look
          </button>
        </div>

        {/* ESTADO CARGANDO */}
        {cargando && (
          <div style={{ textAlign: "center", padding: "80px", color: "#888" }}>
            <p>Cargando tus looks...</p>
          </div>
        )}

        {/* VACÍO */}
        {!cargando && looks.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 24px", backgroundColor: "#1e1e1e", borderRadius: "16px", border: "1px solid #2e2e2e" }}>
            <span style={{ fontSize: "4rem" }}>👗</span>
            <h3 style={{ fontSize: "1.4rem", marginTop: "16px", marginBottom: "8px" }}>Todavía no tienes looks</h3>
            <p style={{ color: "#888", marginBottom: "24px" }}>Usa el Probador Virtual para generar tu primer outfit.</p>
            <button onClick={() => navigate("/perfil3d")} style={btnPrimario}>
              Ir al Probador Virtual
            </button>
          </div>
        )}

        {/* GRID DE LOOKS */}
        {!cargando && looks.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
            {looks.map((look) => (
              <div
                key={look.id}
                style={{ backgroundColor: "#1e1e1e", borderRadius: "14px", border: "1px solid #2e2e2e", overflow: "hidden", cursor: "pointer", transition: "transform 0.2s" }}
                onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                onClick={() => setLookSeleccionado(look)}
              >
                <img
                  src={look.imagen_generada}
                  alt={look.nombre}
                  style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", display: "block" }}
                />
                <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontWeight: "600", fontSize: "0.9rem", marginBottom: "2px" }}>{look.nombre}</p>
                    <p style={{ color: "#666", fontSize: "0.78rem" }}>
                      {new Date(look.fecha).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); eliminar(look.id); }}
                    style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: "1.1rem" }}
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL — Ver look en grande */}
      {lookSeleccionado && (
        <div
          onClick={() => setLookSeleccionado(null)}
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "24px" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: "#1e1e1e", borderRadius: "16px", overflow: "hidden", maxWidth: "500px", width: "100%", border: "1px solid #2e2e2e" }}
          >
            <img src={lookSeleccionado.imagen_generada} alt={lookSeleccionado.nombre} style={{ width: "100%", display: "block" }} />
            <div style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontWeight: "700", marginBottom: "4px" }}>{lookSeleccionado.nombre}</p>
                <p style={{ color: "#888", fontSize: "0.85rem" }}>{new Date(lookSeleccionado.fecha).toLocaleDateString("es-ES")}</p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <a href={lookSeleccionado.imagen_generada} download={`${lookSeleccionado.nombre}.png`} style={{ ...btnSecundario, textDecoration: "none" }}>
                  ⬇️ Descargar
                </a>
                <button onClick={() => setLookSeleccionado(null)} style={btnSecundario}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const btnPrimario = { padding: "10px 22px", backgroundColor: "white", color: "black", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "0.9rem" };
const btnSecundario = { padding: "8px 18px", backgroundColor: "transparent", color: "#ccc", border: "1px solid #444", borderRadius: "8px", cursor: "pointer", fontSize: "0.9rem" };
