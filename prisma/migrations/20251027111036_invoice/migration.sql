-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_id_config2_fkey" FOREIGN KEY ("id_config2") REFERENCES "Configuration"("id") ON DELETE SET NULL ON UPDATE CASCADE;
