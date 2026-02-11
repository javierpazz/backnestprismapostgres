/*
  Warnings:

  - The primary key for the `ProductImage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ProductImage` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `orderAddress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "orderAddress" DROP CONSTRAINT "ShippingAddress_orderId_fkey";

-- AlterTable
ALTER TABLE "Configuration" ALTER COLUMN "numIntCli" SET DEFAULT 100000;

-- AlterTable
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "orderAddress";

-- CreateTable
CREATE TABLE "ShippingAddress" (
    "id" TEXT NOT NULL,
    "fullName" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "address" TEXT,
    "address2" TEXT,
    "city" TEXT,
    "postalCode" TEXT,
    "zip" TEXT,
    "country" TEXT,
    "cuit" TEXT,
    "phone" TEXT,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "ShippingAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShippingAddress_orderId_key" ON "ShippingAddress"("orderId");

-- AddForeignKey
ALTER TABLE "ShippingAddress" ADD CONSTRAINT "ShippingAddress_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
