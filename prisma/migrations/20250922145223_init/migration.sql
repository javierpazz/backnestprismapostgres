-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "role" TEXT NOT NULL DEFAULT 'user',
    "roles" TEXT[] DEFAULT ARRAY['user']::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Configuration" (
    "id" SERIAL NOT NULL,
    "codCon" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domcomer" TEXT,
    "cuit" TEXT,
    "coniva" TEXT,
    "ib" TEXT,
    "feciniact" TIMESTAMP(3),
    "numIntRem" INTEGER NOT NULL DEFAULT 0,
    "numIntRec" INTEGER NOT NULL DEFAULT 0,
    "numIntOdp" INTEGER NOT NULL DEFAULT 0,
    "numIntCaj" INTEGER NOT NULL DEFAULT 0,
    "numIntMov" INTEGER NOT NULL DEFAULT 0,
    "numIntCli" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Configuration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Configuration_codCon_key" ON "Configuration"("codCon");

-- CreateIndex
CREATE UNIQUE INDEX "Configuration_name_key" ON "Configuration"("name");
