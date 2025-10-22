-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_id_parte_fkey" FOREIGN KEY ("id_parte") REFERENCES "Parte"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_id_instru_fkey" FOREIGN KEY ("id_instru") REFERENCES "Instrumento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_id_config_fkey" FOREIGN KEY ("id_config") REFERENCES "Configuration"("id") ON DELETE SET NULL ON UPDATE CASCADE;
