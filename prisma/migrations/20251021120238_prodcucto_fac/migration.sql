-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "codSupId" TEXT;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_codSupId_fkey" FOREIGN KEY ("codSupId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
