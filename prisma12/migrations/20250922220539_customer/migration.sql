/*
  Warnings:

  - You are about to drop the column `codSup` on the `Supplier` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Supplier` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Supplier` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[codCus]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nameCus]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codCus` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameCus` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Supplier_codSup_key";

-- DropIndex
DROP INDEX "Supplier_name_key";

-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "codSup",
DROP COLUMN "email",
DROP COLUMN "name",
ADD COLUMN     "codCus" TEXT NOT NULL,
ADD COLUMN     "emailCus" TEXT,
ADD COLUMN     "nameCus" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_codCus_key" ON "Supplier"("codCus");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_nameCus_key" ON "Supplier"("nameCus");
