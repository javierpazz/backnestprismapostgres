-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "orderId" TEXT;

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "paymentMethod" TEXT,
    "numberOfItems" INTEGER,
    "subTotal" DOUBLE PRECISION,
    "shippingPrice" DOUBLE PRECISION,
    "tax" DOUBLE PRECISION,
    "total" DOUBLE PRECISION,
    "totalBuy" DOUBLE PRECISION,
    "id_client" TEXT,
    "id_parte" TEXT,
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
    "user" TEXT,
    "id_delivery" TEXT,
    "id_address" TEXT,
    "supplier" TEXT,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "paidAt" TIMESTAMP(3),
    "isDelivered" BOOLEAN NOT NULL DEFAULT false,
    "deliveredAt" TIMESTAMP(3),
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

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingAddress" (
    "id" TEXT NOT NULL,
    "fullName" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "address" TEXT,
    "address2" TEXT,
    "city" TEXT,
    "postalCode" TEXT,
    "zip" TEXT,
    "country" TEXT,
    "cuit" TEXT,
    "phone" TEXT,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "ShippingAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentResult" (
    "id" TEXT NOT NULL,
    "status" TEXT,
    "update_time" TEXT,
    "email_address" TEXT,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "PaymentResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShippingAddress_orderId_key" ON "ShippingAddress"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentResult_orderId_key" ON "PaymentResult"("orderId");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingAddress" ADD CONSTRAINT "ShippingAddress_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentResult" ADD CONSTRAINT "PaymentResult_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
