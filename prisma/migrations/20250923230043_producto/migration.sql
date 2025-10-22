/*
  Warnings:

  - Added the required column `codPro` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codigoPro` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "codPro" TEXT NOT NULL,
ADD COLUMN     "codigoPro" TEXT NOT NULL;
