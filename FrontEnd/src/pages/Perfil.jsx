import { motion } from "framer-motion";

export default function Profile({ user, onBack }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1e1e1e",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          backgroundColor: "#2a2a2a",
          padding: "40px",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 0 20px rgba(0,0,0,0.4)",
          color: "white",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Perfil del Usuario
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <p><strong>Nombre:</strong> {user.nombre}</p>
          <p><strong>Apellidos:</strong> {user.apellidos}</p>
          <p><strong>Fecha de nacimiento:</strong> {user.fechaNacimiento}</p>
        </div>

        <button
          onClick={onBack}
          style={{
            marginTop: "30px",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#444",
            color: "white",
            cursor: "pointer",
            fontSize: "1rem",
            width: "100%",
          }}
        >
          Volver
        </button>
      </motion.div>
    </div>
  );
}
