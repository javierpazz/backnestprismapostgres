-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_codCom_fkey" FOREIGN KEY ("codCom") REFERENCES "Comprobante"("id") ON DELETE SET NULL ON UPDATE CASCADE;
