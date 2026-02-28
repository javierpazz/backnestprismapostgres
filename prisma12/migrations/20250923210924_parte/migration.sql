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

-- CreateIndex
CREATE UNIQUE INDEX "Parte_codPar_key" ON "Parte"("codPar");

-- CreateIndex
CREATE UNIQUE INDEX "Parte_name_key" ON "Parte"("name");
