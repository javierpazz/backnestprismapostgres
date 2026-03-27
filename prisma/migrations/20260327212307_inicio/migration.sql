/*
  Warnings:

  - You are about to drop the column `codMac` on the `Maquina` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[codMaq]` on the table `Maquina` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codMaq,codCusId]` on the table `Maquina` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codMaq` to the `Maquina` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Maquina_codMac_key";

-- AlterTable
ALTER TABLE "Maquina" DROP COLUMN "codMac",
ADD COLUMN     "codMaq" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Maquina_codMaq_key" ON "Maquina"("codMaq");

-- CreateIndex
CREATE UNIQUE INDEX "Maquina_codMaq_codCusId_key" ON "Maquina"("codMaq", "codCusId");
