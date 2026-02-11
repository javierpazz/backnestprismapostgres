/*
  Warnings:

  - You are about to drop the column `countryId` on the `OrderAddress` table. All the data in the column will be lost.
  - You are about to drop the column `countryId` on the `UserAddress` table. All the data in the column will be lost.
  - Added the required column `country` to the `OrderAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `UserAddress` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderAddress" DROP CONSTRAINT "OrderAddress_countryId_fkey";

-- DropForeignKey
ALTER TABLE "UserAddress" DROP CONSTRAINT "UserAddress_countryId_fkey";

-- AlterTable
ALTER TABLE "OrderAddress" DROP COLUMN "countryId",
ADD COLUMN     "country" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserAddress" DROP COLUMN "countryId",
ADD COLUMN     "country" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UserAddress" ADD CONSTRAINT "UserAddress_country_fkey" FOREIGN KEY ("country") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderAddress" ADD CONSTRAINT "OrderAddress_country_fkey" FOREIGN KEY ("country") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
