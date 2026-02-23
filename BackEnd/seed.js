const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.prenda.createMany({
    data: [
      { nombre: "Camiseta Básica", marca: "Zara", categoria: "Superior", imagenUrl: "url_foto_1" },
      { nombre: "Jeans Slim", marca: "Levi's", categoria: "Inferior", imagenUrl: "url_foto_2" },
      { nombre: "Air Force 1", marca: "Nike", categoria: "Calzado", imagenUrl: "url_foto_3" },
    ]
  });
  console.log("✅ Prendas de prueba añadidas");
}
main();