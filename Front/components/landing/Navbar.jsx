export default function Navbar({ onLogin, onRegister }) {
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
          onClick={onLogin}
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
          onClick={onRegister}
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
