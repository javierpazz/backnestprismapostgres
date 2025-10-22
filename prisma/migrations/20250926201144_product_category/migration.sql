-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_instrumentoId_fkey";

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "instrumentoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_instrumentoId_fkey" FOREIGN KEY ("instrumentoId") REFERENCES "Instrumento"("id") ON DELETE SET NULL ON UPDATE CASCADE;
