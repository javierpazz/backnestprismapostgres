/*
  Warnings:

  - You are about to drop the column `instrumentoId` on the `OrderItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_instrumentoId_fkey";

-- DropIndex
DROP INDEX "OrderItem_instrumentoId_idx";

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "instrumentoId";

-- CreateTable
CREATE TABLE "InstrItem" (
    "id" TEXT NOT NULL,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "medPro" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "image" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "size" TEXT,
    "porIva" DOUBLE PRECISION NOT NULL,
    "venDat" TIMESTAMP(3),
    "observ" TEXT,
    "terminado" BOOLEAN,
    "productId" TEXT NOT NULL,
    "instrumentoId" TEXT,

    CONSTRAINT "InstrItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InstrItem_productId_idx" ON "InstrItem"("productId");

-- CreateIndex
CREATE INDEX "InstrItem_instrumentoId_idx" ON "InstrItem"("instrumentoId");

-- CreateIndex
CREATE INDEX "InstrItem_terminado_idx" ON "InstrItem"("terminado");

-- AddForeignKey
ALTER TABLE "InstrItem" ADD CONSTRAINT "InstrItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstrItem" ADD CONSTRAINT "InstrItem_instrumentoId_fkey" FOREIGN KEY ("instrumentoId") REFERENCES "Instrumento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
