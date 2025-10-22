-- CreateTable
CREATE TABLE "Valuee" (
    "id" TEXT NOT NULL,
    "codVal" TEXT NOT NULL,
    "desVal" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Valuee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Valuee_codVal_key" ON "Valuee"("codVal");

-- CreateIndex
CREATE UNIQUE INDEX "Valuee_desVal_key" ON "Valuee"("desVal");
