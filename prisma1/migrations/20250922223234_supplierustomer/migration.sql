/*
  Warnings:

  - You are about to drop the column `codCus` on the `Supplier` table. All the data in the column will be lost.
  - You are about to drop the column `emailCus` on the `Supplier` table. All the data in the column will be lost.
  - You are about to drop the column `nameCus` on the `Supplier` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[codSup]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codSup` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Supplier_codCus_key";

-- DropIndex
DROP INDEX "Supplier_nameCus_key";

-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "codCus",
DROP COLUMN "emailCus",
DROP COLUMN "nameCus",
ADD COLUMN     "codSup" TEXT NOT NULL,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "codCus" TEXT NOT NULL,
    "nameCus" TEXT NOT NULL,
    "emailCus" TEXT,
    "domcomer" TEXT,
    "cuit" TEXT,
    "coniva" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_codCus_key" ON "Customer"("codCus");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_nameCus_key" ON "Customer"("nameCus");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_codSup_key" ON "Supplier"("codSup");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_name_key" ON "Supplier"("name");
