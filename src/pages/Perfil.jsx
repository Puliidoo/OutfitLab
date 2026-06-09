import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Perfil() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef();
  const fotoTryonRef = useRef();

  const [datos, setDatos] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [fotoTryon, setFotoTryon] = useState(null);
  const [seccion, setSeccion] = useState("info"); // "info" | "password" | "probador"

  const [nombre, setNombre] = useState("");
  const [msgNombre, setMsgNombre] = useState("");

  const [passActual, setPassActual] = useState("");
  const [passNueva, setPassNueva] = useState("");
  const [passConfirm, setPassConfirm] = useState("");
  const [msgPass, setMsgPass] = useState("");

  useEffect(() => {
    const savedAvatar = localStorage.getItem(`avatar_${user?.email}`);
    if (savedAvatar) setAvatar(savedAvatar);

    const savedTryon = localStorage.getItem(`tryon_${user?.email}`);
    if (savedTryon) setFotoTryon(savedTryon);

    fetch(`http://localhost:3000/api/usuarios/${user?.email}`)
      .then((r) => r.json())
      .then((d) => {
        setDatos(d);
        setNombre(d.nombre);
      });
  }, [user]);

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      setAvatar(base64);
      localStorage.setItem(`avatar_${user?.email}`, base64);
    };
    reader.readAsDataURL(file);
  };

  const handleFotoTryon = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      setFotoTryon(base64);
      localStorage.setItem(`tryon_${user?.email}`, base64);
    };
    reader.readAsDataURL(file);
  };

  const guardarNombre = async () => {
    setMsgNombre("");
    const res = await fetch(`http://localhost:3000/api/usuarios/${user?.email}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre }),
    });
    const data = await res.json();
    if (!res.ok) { setMsgNombre(data.error); return; }
    login({ ...user, name: nombre });
    setDatos(data.user);
    setMsgNombre("✓ Nombre actualizado");
  };

  const cambiarPassword = async () => {
    setMsgPass("");
    if (passNueva !== passConfirm) { setMsgPass("Las contraseñas nuevas no coinciden"); return; }
    if (passNueva.length < 4) { setMsgPass("La contraseña debe tener al menos 4 caracteres"); return; }

    const res = await fetch(`http://localhost:3000/api/usuarios/${user?.email}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password_actual: passActual, password_nueva: passNueva }),
    });
    const data = await res.json();
    if (!res.ok) { setMsgPass(data.error); return; }
    setPassActual(""); setPassNueva(""); setPassConfirm("");
    setMsgPass("✓ Contraseña actualizada correctamente");
  };

  const fechaFormateada = datos?.fecha
    ? new Date(datos.fecha).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })
    : "—";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#121212", color: "white", fontFamily: "sans-serif" }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 48px", borderBottom: "1px solid #2a2a2a" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: "700" }}>OutfitLab</h1>
        <button onClick={() => navigate("/dashboard")} style={btnSecundario}>← Volver al inicio</button>
      </div>

      <div style={{ maxWidth: "760px", margin: "48px auto", padding: "0 24px", display: "flex", flexDirection: "column", gap: "32px" }}>

        {/* TARJETA SUPERIOR — Avatar + datos básicos */}
        <div style={{ backgroundColor: "#1e1e1e", borderRadius: "16px", border: "1px solid #2e2e2e", padding: "36px", display: "flex", gap: "32px", alignItems: "center" }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div
              onClick={() => fileRef.current.click()}
              style={{ width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "#2a2a2a", border: "2px solid #444", overflow: "hidden", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {avatar
                ? <img src={avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontSize: "2.8rem" }}>👤</span>
              }
            </div>
            <div
              onClick={() => fileRef.current.click()}
              style={{ position: "absolute", bottom: 0, right: 0, backgroundColor: "#333", border: "1px solid #555", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "0.8rem" }}
            >
              ✏️
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatar} />
          </div>

          <div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: "700", marginBottom: "6px" }}>{datos?.nombre || user?.name}</h2>
            <p style={{ color: "#888", marginBottom: "4px" }}>{user?.email}</p>
            <p style={{ color: "#555", fontSize: "0.85rem" }}>Miembro desde {fechaFormateada}</p>
          </div>
        </div>

        {/* PESTAÑAS */}
        <div style={{ display: "flex", gap: "8px" }}>
          {[["info", "Información"], ["password", "Contraseña"], ["probador", "Foto del probador"]].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSeccion(key)}
              style={{
                padding: "10px 22px", borderRadius: "8px", border: "1px solid",
                borderColor: seccion === key ? "#fff" : "#333",
                backgroundColor: seccion === key ? "#fff" : "transparent",
                color: seccion === key ? "#000" : "#888",
                cursor: "pointer", fontWeight: "600", fontSize: "0.9rem",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* SECCIÓN — Información */}
        {seccion === "info" && (
          <div style={tarjeta}>
            <h3 style={tituloSeccion}>Datos personales</h3>

            <div style={campo}>
              <label style={labelStyle}>Nombre</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input value={nombre} onChange={(e) => setNombre(e.target.value)} style={inputStyle} />
                <button onClick={guardarNombre} style={btnPrimario}>Guardar</button>
              </div>
              {msgNombre && <p style={{ color: msgNombre.startsWith("✓") ? "#6bff8e" : "#ff6b6b", fontSize: "0.85rem", marginTop: "6px" }}>{msgNombre}</p>}
            </div>

            <div style={campo}>
              <label style={labelStyle}>Email</label>
              <input value={user?.email || ""} disabled style={{ ...inputStyle, opacity: 0.5, cursor: "not-allowed" }} />
              <p style={{ color: "#555", fontSize: "0.8rem", marginTop: "4px" }}>El email no se puede cambiar</p>
            </div>

            <div style={campo}>
              <label style={labelStyle}>Miembro desde</label>
              <input value={fechaFormateada} disabled style={{ ...inputStyle, opacity: 0.5, cursor: "not-allowed" }} />
            </div>
          </div>
        )}

        {/* SECCIÓN — Foto del probador */}
        {seccion === "probador" && (
          <div style={tarjeta}>
            <h3 style={tituloSeccion}>Tu foto para el Probador Virtual</h3>
            <p style={{ color: "#888", fontSize: "0.9rem" }}>
              Sube una foto tuya de <strong style={{ color: "#ccc" }}>cuerpo entero, de frente</strong> y con buena luz.
              Esta foto se usará automáticamente cada vez que entres al Probador Virtual.
            </p>

            <div
              onClick={() => fotoTryonRef.current.click()}
              style={{
                height: "320px", borderRadius: "12px", border: "2px dashed #333",
                cursor: "pointer", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                backgroundImage: fotoTryon ? `url(${fotoTryon})` : "none",
                backgroundSize: "contain", backgroundRepeat: "no-repeat",
                backgroundPosition: "center", position: "relative", overflow: "hidden",
              }}
            >
              {!fotoTryon && (
                <>
                  <span style={{ fontSize: "3rem" }}>📷</span>
                  <p style={{ color: "#888", marginTop: "12px", textAlign: "center" }}>
                    Haz clic para subir tu foto
                  </p>
                </>
              )}
              {fotoTryon && (
                <div style={{
                  position: "absolute", bottom: "12px", right: "12px",
                  backgroundColor: "rgba(0,0,0,0.7)", padding: "6px 14px",
                  borderRadius: "8px", fontSize: "0.85rem", color: "#ccc",
                }}>
                  ✏️ Cambiar foto
                </div>
              )}
            </div>
            <input ref={fotoTryonRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFotoTryon} />

            {fotoTryon && (
              <p style={{ color: "#6bff8e", fontSize: "0.85rem" }}>
                ✓ Foto guardada — se cargará automáticamente en el Probador Virtual
              </p>
            )}

            <button
              onClick={() => navigate("/perfil3d")}
              style={{ ...btnPrimario, width: "fit-content" }}
            >
              Ir al Probador Virtual →
            </button>
          </div>
        )}

        {/* SECCIÓN — Contraseña */}
        {seccion === "password" && (
          <div style={tarjeta}>
            <h3 style={tituloSeccion}>Cambiar contraseña</h3>

            <div style={campo}>
              <label style={labelStyle}>Contraseña actual</label>
              <input type="password" value={passActual} onChange={(e) => setPassActual(e.target.value)} style={inputStyle} placeholder="Introduce tu contraseña actual" />
            </div>
            <div style={campo}>
              <label style={labelStyle}>Nueva contraseña</label>
              <input type="password" value={passNueva} onChange={(e) => setPassNueva(e.target.value)} style={inputStyle} placeholder="Nueva contraseña" />
            </div>
            <div style={campo}>
              <label style={labelStyle}>Confirmar nueva contraseña</label>
              <input type="password" value={passConfirm} onChange={(e) => setPassConfirm(e.target.value)} style={inputStyle} placeholder="Repite la nueva contraseña" />
            </div>

            {msgPass && <p style={{ color: msgPass.startsWith("✓") ? "#6bff8e" : "#ff6b6b", fontSize: "0.85rem" }}>{msgPass}</p>}

            <button onClick={cambiarPassword} style={{ ...btnPrimario, marginTop: "8px" }}>Cambiar contraseña</button>
          </div>
        )}

      </div>
    </div>
  );
}

const tarjeta = { backgroundColor: "#1e1e1e", borderRadius: "16px", border: "1px solid #2e2e2e", padding: "32px", display: "flex", flexDirection: "column", gap: "24px" };
const tituloSeccion = { fontSize: "1.1rem", fontWeight: "700", marginBottom: "8px", color: "#ddd" };
const campo = { display: "flex", flexDirection: "column", gap: "6px" };
const labelStyle = { color: "#888", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" };
const inputStyle = { padding: "12px", borderRadius: "8px", border: "1px solid #333", backgroundColor: "#2a2a2a", color: "white", fontSize: "1rem", flex: 1 };
const btnPrimario = { padding: "10px 20px", backgroundColor: "white", color: "black", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "0.9rem" };
const btnSecundario = { padding: "8px 18px", backgroundColor: "transparent", color: "#ccc", border: "1px solid #444", borderRadius: "8px", cursor: "pointer", fontSize: "0.9rem" };
