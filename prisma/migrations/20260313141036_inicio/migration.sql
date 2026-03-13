/*
  Warnings:

  - You are about to drop the `InstrItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InstrItem" DROP CONSTRAINT "InstrItem_instrumentoId_fkey";

-- DropForeignKey
ALTER TABLE "InstrItem" DROP CONSTRAINT "InstrItem_productId_fkey";

-- DropTable
DROP TABLE "InstrItem";

-- CreateTable
CREATE TABLE "ParamItem" (
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

    CONSTRAINT "ParamItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ParamItem_productId_idx" ON "ParamItem"("productId");

-- CreateIndex
CREATE INDEX "ParamItem_instrumentoId_idx" ON "ParamItem"("instrumentoId");

-- CreateIndex
CREATE INDEX "ParamItem_terminado_idx" ON "ParamItem"("terminado");

-- AddForeignKey
ALTER TABLE "ParamItem" ADD CONSTRAINT "ParamItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParamItem" ADD CONSTRAINT "ParamItem_instrumentoId_fkey" FOREIGN KEY ("instrumentoId") REFERENCES "Instrumento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
