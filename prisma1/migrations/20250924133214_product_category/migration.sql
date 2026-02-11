/*
  Warnings:

  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[codigoPro,id_config]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_config` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medPro` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Made the column `title` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `codPro` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `codigoPro` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('shirts', 'pants', 'hoodies', 'hats');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('men', 'women', 'kid', 'unisex');

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_instrumentoId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "brand" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "id_category" TEXT,
ADD COLUMN     "id_config" TEXT NOT NULL,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "image1" TEXT,
ADD COLUMN     "image2" TEXT,
ADD COLUMN     "image3" TEXT,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "inStock" INTEGER,
ADD COLUMN     "medPro" TEXT NOT NULL,
ADD COLUMN     "minStock" INTEGER,
ADD COLUMN     "numReviews" INTEGER,
ADD COLUMN     "porIva" DOUBLE PRECISION,
ADD COLUMN     "priceBuy" DOUBLE PRECISION,
ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "sizes" TEXT[],
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "supplier" TEXT,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "type" "ProductType",
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "codPro" SET NOT NULL,
ALTER COLUMN "codigoPro" SET NOT NULL;

-- DropTable
DROP TABLE "OrderItem";

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT,
    "comment" TEXT,
    "rating" DOUBLE PRECISION,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_codigoPro_id_config_key" ON "Product"("codigoPro", "id_config");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
