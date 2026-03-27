-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "id_maquin" TEXT;

-- CreateTable
CREATE TABLE "Maquina" (
    "id" TEXT NOT NULL,
    "codMac" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "serNum" TEXT NOT NULL,
    "codCusId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Maquina_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Maquina_codMac_key" ON "Maquina"("codMac");

-- CreateIndex
CREATE UNIQUE INDEX "Maquina_name_key" ON "Maquina"("name");

-- AddForeignKey
ALTER TABLE "Maquina" ADD CONSTRAINT "Maquina_codCusId_fkey" FOREIGN KEY ("codCusId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_id_maquin_fkey" FOREIGN KEY ("id_maquin") REFERENCES "Maquina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
