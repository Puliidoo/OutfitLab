import { motion } from "framer-motion";

export default function Catalogo() {
const items = [
  { id: 1, img: "/catalogo/img1.jpg", link: "https://nike.com" },
  { id: 2, img: "/catalogo/img2.jpg", link: "https://adidas.com" },
  { id: 3, img: "/catalogo/img3.jpg", link: "https://puma.com" },
  { id: 4, img: "/catalogo/img4.jpg", link: "https://kappa.com" },
  { id: 5, img: "/catalogo/img5.jpg", link: "https://levis.com" },
  { id: 6, img: "/catalogo/img6.jpg", link: "https://supreme.com" },
  { id: 7, img: "/catalogo/img7.jpg", link: "https://bershka.com" },
  { id: 8, img: "/catalogo/img8.jpg", link: "https://hm.com" },
  { id: 9, img: "/catalogo/img9.jpg", link: "https://zara.com" },
  { id: 10, img: "/catalogo/img10.jpg", link: "https://lacoste.com" },
  { id: 11, img: "/catalogo/img11.jpg", link: "https://ray-ban.com" },
  { id: 12, img: "/catalogo/img12.jpg", link: "https://louisvuitton.com" },
  { id: 13, img: "/catalogo/img13.jpg", link: "https://champion.com" },
  { id: 14, img: "/catalogo/img14.jpg", link: "https://ralphlauren.com" },
  { id: 15, img: "/catalogo/img15.jpg", link: "https://nudeproject.com" },
];


  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1e1e1e",
        padding: "120px 20px 40px",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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

      {/* GRID CENTRADO */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.05 }}
            style={{
              backgroundColor: "#ffffff",
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
                maxWidth: "90%",      // ← La imagen nunca supera el recuadro
                maxHeight: "90%",     // ← Mantiene proporción sin deformarse
                objectFit: "contain", // ← No se recorta
                display: "block",
                margin: "auto",       // ← Centrada
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
