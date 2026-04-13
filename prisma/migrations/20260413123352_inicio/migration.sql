-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "liqDat" TIMESTAMP(3),
ADD COLUMN     "liqNum" INTEGER;

-- CreateTable
CREATE TABLE "ServiceItem" (
    "id" TEXT NOT NULL,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "medPro" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "image" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "totalItem" DOUBLE PRECISION,
    "size" TEXT,
    "porIva" DOUBLE PRECISION NOT NULL,
    "venDat" TIMESTAMP(3),
    "observ" TEXT,
    "terminado" BOOLEAN,
    "productId" TEXT NOT NULL,
    "serviceId" TEXT,

    CONSTRAINT "ServiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "paymentMethod" TEXT,
    "numberOfItems" INTEGER,
    "subTotal" DOUBLE PRECISION,
    "shippingPrice" DOUBLE PRECISION,
    "tax" DOUBLE PRECISION,
    "total" DOUBLE PRECISION,
    "totalBuy" DOUBLE PRECISION,
    "itemsInOrder" INTEGER NOT NULL,
    "id_client" TEXT,
    "id_maquin" TEXT,
    "supplier" TEXT,
    "id_parte" TEXT,
    "id_encar" TEXT,
    "id_instru" TEXT,
    "id_config" TEXT,
    "id_config2" TEXT,
    "codConNum" TEXT,
    "codCom" TEXT,
    "libNum" INTEGER,
    "folNum" INTEGER,
    "asiNum" INTEGER,
    "asiDat" TIMESTAMP(3),
    "escNum" INTEGER,
    "asieNum" INTEGER,
    "asieDat" TIMESTAMP(3),
    "terminado" BOOLEAN NOT NULL DEFAULT false,
    "isHaber" BOOLEAN,
    "ajuste" BOOLEAN,
    "user" TEXT,
    "id_delivery" TEXT,
    "id_address" TEXT,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "paidAt" TIMESTAMP(3),
    "isDelivered" BOOLEAN NOT NULL DEFAULT false,
    "deliveredAt" TIMESTAMP(3),
    "liqNum" INTEGER,
    "liqDat" TIMESTAMP(3),
    "remNum" INTEGER,
    "remDat" TIMESTAMP(3),
    "dueDat" TIMESTAMP(3),
    "movpvNum" INTEGER,
    "movpvDat" TIMESTAMP(3),
    "invNum" INTEGER,
    "invDat" TIMESTAMP(3),
    "recNum" INTEGER,
    "recDat" TIMESTAMP(3),
    "desVal" TEXT,
    "ordNum" INTEGER,
    "notes" TEXT,
    "salbuy" TEXT,
    "pedcotNum" INTEGER,
    "pedcotDat" TIMESTAMP(3),
    "cotNum" INTEGER,
    "cotDat" TIMESTAMP(3),
    "ordYes" TEXT,
    "staOrd" TEXT,
    "status" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentServiceResult" (
    "id" TEXT NOT NULL,
    "status" TEXT,
    "update_time" TEXT,
    "email_address" TEXT,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "PaymentServiceResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ServiceItem_serviceId_idx" ON "ServiceItem"("serviceId");

-- CreateIndex
CREATE INDEX "ServiceItem_productId_idx" ON "ServiceItem"("productId");

-- CreateIndex
CREATE INDEX "ServiceItem_terminado_idx" ON "ServiceItem"("terminado");

-- CreateIndex
CREATE INDEX "Service_id_client_idx" ON "Service"("id_client");

-- CreateIndex
CREATE INDEX "Service_id_instru_idx" ON "Service"("id_instru");

-- CreateIndex
CREATE INDEX "Service_terminado_idx" ON "Service"("terminado");

-- CreateIndex
CREATE INDEX "Service_salbuy_invNum_invDat_idx" ON "Service"("salbuy", "invNum", "invDat");

-- CreateIndex
CREATE INDEX "Service_id_client_salbuy_idx" ON "Service"("id_client", "salbuy");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentServiceResult_serviceId_key" ON "PaymentServiceResult"("serviceId");

-- AddForeignKey
ALTER TABLE "ServiceItem" ADD CONSTRAINT "ServiceItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceItem" ADD CONSTRAINT "ServiceItem_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_id_maquin_fkey" FOREIGN KEY ("id_maquin") REFERENCES "Maquina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_supplier_fkey" FOREIGN KEY ("supplier") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_id_parte_fkey" FOREIGN KEY ("id_parte") REFERENCES "Parte"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_id_encar_fkey" FOREIGN KEY ("id_encar") REFERENCES "Encargado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_id_instru_fkey" FOREIGN KEY ("id_instru") REFERENCES "Instrumento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_id_config_fkey" FOREIGN KEY ("id_config") REFERENCES "Configuration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_id_config2_fkey" FOREIGN KEY ("id_config2") REFERENCES "Configuration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_codCom_fkey" FOREIGN KEY ("codCom") REFERENCES "Comprobante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentServiceResult" ADD CONSTRAINT "PaymentServiceResult_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
