-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prenda" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "imagenUrl" TEXT NOT NULL,

    CONSTRAINT "Prenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Outfit" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT,
    "usuarioId" INTEGER NOT NULL,
    "imagenGenerada" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Outfit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutfitPrenda" (
    "id" SERIAL NOT NULL,
    "outfitId" INTEGER NOT NULL,
    "prendaId" INTEGER NOT NULL,

    CONSTRAINT "OutfitPrenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Carrito" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Carrito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarritoDetalle" (
    "id" SERIAL NOT NULL,
    "carritoId" INTEGER NOT NULL,
    "prendaId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "CarritoDetalle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Carrito_usuarioId_key" ON "Carrito"("usuarioId");

-- AddForeignKey
ALTER TABLE "Outfit" ADD CONSTRAINT "Outfit_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutfitPrenda" ADD CONSTRAINT "OutfitPrenda_outfitId_fkey" FOREIGN KEY ("outfitId") REFERENCES "Outfit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutfitPrenda" ADD CONSTRAINT "OutfitPrenda_prendaId_fkey" FOREIGN KEY ("prendaId") REFERENCES "Prenda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carrito" ADD CONSTRAINT "Carrito_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarritoDetalle" ADD CONSTRAINT "CarritoDetalle_carritoId_fkey" FOREIGN KEY ("carritoId") REFERENCES "Carrito"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
