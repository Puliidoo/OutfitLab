const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.usuario.create({
    data: {
      nombre: "David",
      email: "david@example.com",
      passwordHash: "1234",
      rol: "cliente"
    }
  })

  console.log(user)
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
