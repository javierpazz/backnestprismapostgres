/*
  Warnings:

  - Made the column `totalItem` on table `OrderItem` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `totalItem` to the `ParamItem` table without a default value. This is not possible if the table is not empty.
  - Made the column `totalItem` on table `ServiceItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "totalItem" SET NOT NULL;

-- AlterTable
ALTER TABLE "ParamItem" ADD COLUMN     "totalItem" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "ServiceItem" ALTER COLUMN "totalItem" SET NOT NULL;
