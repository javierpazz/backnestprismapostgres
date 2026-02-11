-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_id_config_fkey";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_id_config_fkey" FOREIGN KEY ("id_config") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_fkey" FOREIGN KEY ("user") REFERENCES "Configuration"("id") ON DELETE SET NULL ON UPDATE CASCADE;
