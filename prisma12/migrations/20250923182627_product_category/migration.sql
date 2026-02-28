/*
  Warnings:

  - The primary key for the `Configuration` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Configuration" DROP CONSTRAINT "Configuration_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Configuration_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Configuration_id_seq";
