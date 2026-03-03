import { motion } from "framer-motion";

export default function Catalogo() {
  // Lista de 15 elementos con enlaces e imágenes (puedes cambiarlos)
  const items = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    img: `/catalogo/img${i + 1}.jpg`, // Cambia por tus imágenes reales
    link: `https://ejemplo.com/item${i + 1}`, // Cambia por tus enlaces reales
  }));

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1e1e1e",
        padding: "40px 20px",
        color: "white",
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{
          textAlign: "center",
          fontSize: "3rem",
          marginBottom: "40px",
        }}
      >
        Catálogo
      </motion.h1>

      {/* GRID DE 15 RECUADROS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.05 }}
            style={{
              backgroundColor: "#2a2a2a",
              borderRadius: "12px",
              overflow: "hidden",
              cursor: "pointer",
              height: "200px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => window.open(item.link, "_blank")}
          >
            <img
              src={item.img}
              alt={`Item ${item.id}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
