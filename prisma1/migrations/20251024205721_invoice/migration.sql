/*
  Warnings:

  - You are about to drop the column `codCom` on the `Comprobante` table. All the data in the column will be lost.
  - You are about to drop the column `codComId` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[codComC,codConId]` on the table `Comprobante` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_codComId_fkey";

-- DropIndex
DROP INDEX "Comprobante_codCom_codConId_key";

-- AlterTable
ALTER TABLE "Comprobante" DROP COLUMN "codCom",
ADD COLUMN     "codComC" TEXT;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "codComId",
ADD COLUMN     "codCom" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Comprobante_codComC_codConId_key" ON "Comprobante"("codComC", "codConId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_codCom_fkey" FOREIGN KEY ("codCom") REFERENCES "Comprobante"("id") ON DELETE SET NULL ON UPDATE CASCADE;
