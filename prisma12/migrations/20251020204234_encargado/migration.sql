-- CreateTable
CREATE TABLE "Encargado" (
    "id" TEXT NOT NULL,
    "codEnc" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Encargado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Encargado_codEnc_key" ON "Encargado"("codEnc");

-- CreateIndex
CREATE UNIQUE INDEX "Encargado_name_key" ON "Encargado"("name");
