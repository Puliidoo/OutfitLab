import { motion } from "framer-motion";

export default function Hero() {
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
      {/* LOGO */}
      <motion.img
        src="/logo.png"
        alt="OutfitLab Logo"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{
          width: "320px",
          height: "300px",
          marginLeft: "-40px",
          marginBottom: "20px",
          filter: "drop-shadow(0px 0px 10px rgba(255,255,255,0.2))",
        }}
      />

      {/* TÍTULO */}
      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{
          fontSize: "3.5rem",
          fontWeight: "600",
          color: "#f0f0f0",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        OutfitLab
      </motion.h1>

      {/* DESCRIPCIÓN */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
        style={{
          fontSize: "1.3rem",
          maxWidth: "600px",
          color: "#ccc",
          textAlign: "center",
          lineHeight: "1.6",
        }}
      >
        Descubre cómo te queda la ropa antes de comprarla.  
        Sube tu foto, elige tu estilo y prueba miles de prendas al instante.
      </motion.p>
    </div>
  );
}
