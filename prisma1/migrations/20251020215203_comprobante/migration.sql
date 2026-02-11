-- CreateTable
CREATE TABLE "Comprobante" (
    "id" SERIAL NOT NULL,
    "codCom" TEXT,
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

-- CreateIndex
CREATE UNIQUE INDEX "Comprobante_codCom_codConId_key" ON "Comprobante"("codCom", "codConId");

-- AddForeignKey
ALTER TABLE "Comprobante" ADD CONSTRAINT "Comprobante_codConId_fkey" FOREIGN KEY ("codConId") REFERENCES "Configuration"("id") ON DELETE SET NULL ON UPDATE CASCADE;
