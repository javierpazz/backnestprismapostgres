-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "id_encar" TEXT;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_id_encar_fkey" FOREIGN KEY ("id_encar") REFERENCES "Encargado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
