/*
  Warnings:

  - You are about to drop the column `userId` on the `UserAddress` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user]` on the table `UserAddress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user` to the `UserAddress` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserAddress" DROP CONSTRAINT "UserAddress_userId_fkey";

-- DropIndex
DROP INDEX "UserAddress_userId_key";

-- AlterTable
ALTER TABLE "UserAddress" DROP COLUMN "userId",
ADD COLUMN     "user" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserAddress_user_key" ON "UserAddress"("user");

-- AddForeignKey
ALTER TABLE "UserAddress" ADD CONSTRAINT "UserAddress_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
