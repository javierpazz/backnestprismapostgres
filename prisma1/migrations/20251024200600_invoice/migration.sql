/*
  Warnings:

  - You are about to drop the column `codCom` on the `Order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_codCom_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "codCom",
ADD COLUMN     "codComId" TEXT;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_codComId_fkey" FOREIGN KEY ("codComId") REFERENCES "Comprobante"("id") ON DELETE SET NULL ON UPDATE CASCADE;
