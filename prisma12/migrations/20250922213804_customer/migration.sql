-- CreateTable
CREATE TABLE "Supplier" (
    "id" SERIAL NOT NULL,
    "codSup" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "domcomer" TEXT,
    "cuit" TEXT,
    "coniva" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_codSup_key" ON "Supplier"("codSup");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_name_key" ON "Supplier"("name");
