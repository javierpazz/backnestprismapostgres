-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
