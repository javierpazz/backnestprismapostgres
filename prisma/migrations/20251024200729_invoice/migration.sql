/*
  Warnings:

  - You are about to drop the column `codComId` on the `Order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_codComId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "codComId",
ADD COLUMN     "codCom" TEXT;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_codCom_fkey" FOREIGN KEY ("codCom") REFERENCES "Comprobante"("id") ON DELETE SET NULL ON UPDATE CASCADE;
