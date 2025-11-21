-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_id_config_fkey" FOREIGN KEY ("id_config") REFERENCES "Configuration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
