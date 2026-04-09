/*
  Warnings:

  - A unique constraint covering the columns `[emailCus]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "totalItem" DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_emailCus_key" ON "Customer"("emailCus");
