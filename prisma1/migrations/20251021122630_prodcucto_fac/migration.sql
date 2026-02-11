/*
  Warnings:

  - You are about to drop the column `codSupId` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_codSupId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "codSupId";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_supplier_fkey" FOREIGN KEY ("supplier") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
