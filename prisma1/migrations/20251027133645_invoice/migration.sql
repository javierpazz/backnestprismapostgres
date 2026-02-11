-- CreateTable
CREATE TABLE "Receipt" (
    "id" TEXT NOT NULL,
    "subTotal" DOUBLE PRECISION,
    "total" DOUBLE PRECISION,
    "totalBuy" DOUBLE PRECISION,
    "codConNum" INTEGER,
    "isPaid" BOOLEAN DEFAULT false,
    "paidAt" TIMESTAMP(3),
    "recNum" INTEGER,
    "recDat" TIMESTAMP(3),
    "cajNum" INTEGER,
    "cajDat" TIMESTAMP(3),
    "desval" TEXT,
    "ordNum" INTEGER,
    "notes" TEXT,
    "salbuy" TEXT,
    "id_client" TEXT,
    "id_config" TEXT,
    "id_encarg" TEXT,
    "user" TEXT,
    "supplier" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceiptItem" (
    "id" TEXT NOT NULL,
    "desval" TEXT NOT NULL,
    "numval" DOUBLE PRECISION,
    "amountval" DOUBLE PRECISION NOT NULL,
    "receiptId" TEXT NOT NULL,
    "valuee" TEXT NOT NULL,

    CONSTRAINT "ReceiptItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_id_config_fkey" FOREIGN KEY ("id_config") REFERENCES "Configuration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_id_encarg_fkey" FOREIGN KEY ("id_encarg") REFERENCES "Encargado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_supplier_fkey" FOREIGN KEY ("supplier") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptItem" ADD CONSTRAINT "ReceiptItem_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "Receipt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptItem" ADD CONSTRAINT "ReceiptItem_valuee_fkey" FOREIGN KEY ("valuee") REFERENCES "Valuee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
