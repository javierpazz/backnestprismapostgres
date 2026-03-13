-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('shirts', 'pants', 'hoodies', 'hats');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('men', 'women', 'kid', 'unisex');

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAddress" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "address2" TEXT,
    "postalCode" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "numLogs" INTEGER NOT NULL DEFAULT 0,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "role" TEXT NOT NULL DEFAULT 'user',
    "roles" TEXT[] DEFAULT ARRAY['user']::TEXT[],
    "resetToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "codCus" TEXT NOT NULL,
    "nameCus" TEXT NOT NULL,
    "emailCus" TEXT,
    "domcomer" TEXT,
    "cuit" TEXT,
    "coniva" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "codSup" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "domcomer" TEXT,
    "cuit" TEXT,
    "coniva" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Valuee" (
    "id" TEXT NOT NULL,
    "codVal" TEXT NOT NULL,
    "desVal" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Valuee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StateOrd" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StateOrd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Encargado" (
    "id" TEXT NOT NULL,
    "codEnc" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Encargado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comprobante" (
    "id" TEXT NOT NULL,
    "codComC" TEXT,
    "nameCom" TEXT,
    "claCom" TEXT,
    "isHaber" BOOLEAN NOT NULL DEFAULT true,
    "noDisc" BOOLEAN NOT NULL DEFAULT true,
    "toDisc" BOOLEAN NOT NULL DEFAULT false,
    "itDisc" BOOLEAN NOT NULL DEFAULT false,
    "interno" BOOLEAN NOT NULL DEFAULT false,
    "numInt" INTEGER,
    "codConId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comprobante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parte" (
    "id" TEXT NOT NULL,
    "codPar" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "domcomer" TEXT,
    "cuit" TEXT,
    "coniva" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Parte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Configuration" (
    "id" TEXT NOT NULL,
    "codCon" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domcomer" TEXT,
    "cuit" TEXT,
    "coniva" TEXT,
    "ib" TEXT,
    "feciniact" TEXT,
    "numIntRem" INTEGER NOT NULL DEFAULT 0,
    "numIntRec" INTEGER NOT NULL DEFAULT 0,
    "numIntOdp" INTEGER NOT NULL DEFAULT 0,
    "numIntCaj" INTEGER NOT NULL DEFAULT 0,
    "numIntMov" INTEGER NOT NULL DEFAULT 0,
    "numIntCli" INTEGER NOT NULL DEFAULT 100000,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Configuration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instrumento" (
    "id" TEXT NOT NULL,
    "codIns" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "publico" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Instrumento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "codPro" TEXT NOT NULL,
    "codigoPro" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "medPro" TEXT NOT NULL,
    "slug" TEXT,
    "image" TEXT,
    "images" TEXT[],
    "image1" TEXT,
    "image2" TEXT,
    "image3" TEXT,
    "brand" TEXT,
    "category" TEXT,
    "id_config" TEXT,
    "id_category" TEXT,
    "categoryId" TEXT,
    "ecoActive" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION DEFAULT 0,
    "priceBuy" DOUBLE PRECISION DEFAULT 0,
    "inStock" DOUBLE PRECISION DEFAULT 0,
    "minStock" DOUBLE PRECISION DEFAULT 0,
    "porIva" DOUBLE PRECISION DEFAULT 0,
    "rating" DOUBLE PRECISION DEFAULT 0,
    "numReviews" INTEGER,
    "tags" TEXT[],
    "type" "ProductType",
    "gender" "Gender",
    "sizes" TEXT[],
    "supplierId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT,
    "comment" TEXT,
    "rating" DOUBLE PRECISION,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "medPro" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "image" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "size" TEXT,
    "porIva" DOUBLE PRECISION NOT NULL,
    "venDat" TIMESTAMP(3),
    "observ" TEXT,
    "terminado" BOOLEAN,
    "productId" TEXT NOT NULL,
    "instrumentoId" TEXT,
    "orderId" TEXT,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

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
    "itemsInOrder" INTEGER NOT NULL,
    "id_client" TEXT,
    "supplier" TEXT,
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
CREATE TABLE "OrderAddress" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "address2" TEXT,
    "postalCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "OrderAddress_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE UNIQUE INDEX "UserAddress_userId_key" ON "UserAddress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_codCus_key" ON "Customer"("codCus");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_nameCus_key" ON "Customer"("nameCus");

-- CreateIndex
CREATE INDEX "Customer_nameCus_idx" ON "Customer"("nameCus");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_codSup_key" ON "Supplier"("codSup");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_name_key" ON "Supplier"("name");

-- CreateIndex
CREATE INDEX "Supplier_name_idx" ON "Supplier"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Valuee_codVal_key" ON "Valuee"("codVal");

-- CreateIndex
CREATE UNIQUE INDEX "Valuee_desVal_key" ON "Valuee"("desVal");

-- CreateIndex
CREATE UNIQUE INDEX "Encargado_codEnc_key" ON "Encargado"("codEnc");

-- CreateIndex
CREATE UNIQUE INDEX "Encargado_name_key" ON "Encargado"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Comprobante_codComC_codConId_key" ON "Comprobante"("codComC", "codConId");

-- CreateIndex
CREATE UNIQUE INDEX "Parte_codPar_key" ON "Parte"("codPar");

-- CreateIndex
CREATE UNIQUE INDEX "Parte_name_key" ON "Parte"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Configuration_codCon_key" ON "Configuration"("codCon");

-- CreateIndex
CREATE UNIQUE INDEX "Configuration_name_key" ON "Configuration"("name");

-- CreateIndex
CREATE INDEX "Instrumento_publico_idx" ON "Instrumento"("publico");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Product_supplierId_idx" ON "Product"("supplierId");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_codigoPro_idx" ON "Product"("codigoPro");

-- CreateIndex
CREATE UNIQUE INDEX "Product_codigoPro_id_config_key" ON "Product"("codigoPro", "id_config");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");

-- CreateIndex
CREATE INDEX "OrderItem_instrumentoId_idx" ON "OrderItem"("instrumentoId");

-- CreateIndex
CREATE INDEX "OrderItem_terminado_idx" ON "OrderItem"("terminado");

-- CreateIndex
CREATE INDEX "Order_id_client_idx" ON "Order"("id_client");

-- CreateIndex
CREATE INDEX "Order_id_instru_idx" ON "Order"("id_instru");

-- CreateIndex
CREATE INDEX "Order_terminado_idx" ON "Order"("terminado");

-- CreateIndex
CREATE INDEX "Order_salbuy_invNum_invDat_idx" ON "Order"("salbuy", "invNum", "invDat");

-- CreateIndex
CREATE INDEX "Order_id_client_salbuy_idx" ON "Order"("id_client", "salbuy");

-- CreateIndex
CREATE UNIQUE INDEX "OrderAddress_orderId_key" ON "OrderAddress"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "ShippingAddress_orderId_key" ON "ShippingAddress"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentResult_orderId_key" ON "PaymentResult"("orderId");

-- CreateIndex
CREATE INDEX "Receipt_id_client_idx" ON "Receipt"("id_client");

-- CreateIndex
CREATE INDEX "Receipt_salbuy_idx" ON "Receipt"("salbuy");

-- CreateIndex
CREATE INDEX "Receipt_recDat_idx" ON "Receipt"("recDat");

-- AddForeignKey
ALTER TABLE "UserAddress" ADD CONSTRAINT "UserAddress_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAddress" ADD CONSTRAINT "UserAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comprobante" ADD CONSTRAINT "Comprobante_codConId_fkey" FOREIGN KEY ("codConId") REFERENCES "Configuration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_id_config_fkey" FOREIGN KEY ("id_config") REFERENCES "Configuration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_instrumentoId_fkey" FOREIGN KEY ("instrumentoId") REFERENCES "Instrumento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_supplier_fkey" FOREIGN KEY ("supplier") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_id_parte_fkey" FOREIGN KEY ("id_parte") REFERENCES "Parte"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_id_instru_fkey" FOREIGN KEY ("id_instru") REFERENCES "Instrumento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_id_config_fkey" FOREIGN KEY ("id_config") REFERENCES "Configuration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_id_config2_fkey" FOREIGN KEY ("id_config2") REFERENCES "Configuration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_codCom_fkey" FOREIGN KEY ("codCom") REFERENCES "Comprobante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderAddress" ADD CONSTRAINT "OrderAddress_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderAddress" ADD CONSTRAINT "OrderAddress_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingAddress" ADD CONSTRAINT "ShippingAddress_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentResult" ADD CONSTRAINT "PaymentResult_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_id_config_fkey" FOREIGN KEY ("id_config") REFERENCES "Configuration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_id_encarg_fkey" FOREIGN KEY ("id_encarg") REFERENCES "Encargado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_supplier_fkey" FOREIGN KEY ("supplier") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptItem" ADD CONSTRAINT "ReceiptItem_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "Receipt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptItem" ADD CONSTRAINT "ReceiptItem_valuee_fkey" FOREIGN KEY ("valuee") REFERENCES "Valuee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
