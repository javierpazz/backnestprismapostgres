/*
  Warnings:

  - The primary key for the `Comprobante` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Comprobante" DROP CONSTRAINT "Comprobante_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Comprobante_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Comprobante_id_seq";
