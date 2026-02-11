-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_supplier_fkey" FOREIGN KEY ("supplier") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
