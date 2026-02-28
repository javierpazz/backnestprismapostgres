/*
  Warnings:

  - You are about to drop the column `supplier` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Supplier` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_supplier_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "supplier",
ADD COLUMN     "supplierId" TEXT,
ALTER COLUMN "inStock" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "minStock" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "createdAt";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
