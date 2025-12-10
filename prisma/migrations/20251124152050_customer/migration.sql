/*
  Warnings:

  - You are about to drop the column `EcoActive` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "EcoActive",
ADD COLUMN     "ecoActive" BOOLEAN NOT NULL DEFAULT true;
