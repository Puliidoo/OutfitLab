const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🛠️ Probando la base de datos de OutfitLab...");

  try {
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre: "Alex Test",
        email: `alex_${Date.now()}@test.com`, 
        password: "password123"
      }
    });
    console.log("✅ Usuario creado:", nuevoUsuario.nombre);

    const nuevoOutfit = await prisma.outfit.create({
  data: {
    usuarioId: nuevoUsuario.id,
    imagenGenerada: "https://api-ia.com/resultado_maniqui_3d.jpg"
  }
});
    console.log("✅ Outfit guardado con ID:", nuevoOutfit.id);

    // 3. Consultar todos los usuarios
    const todos = await prisma.usuario.findMany();
    console.log("👥 Total de usuarios en la base de datos:", todos.length);

  } catch (error) {
    console.error("❌ Error en la prueba:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();