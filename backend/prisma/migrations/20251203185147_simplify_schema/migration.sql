/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `reports` table. All the data in the column will be lost.
  - The `userId` column on the `reports` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `crowdLevel` to the `reports` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."reports" DROP CONSTRAINT "reports_userId_fkey";

-- AlterTable
ALTER TABLE "reports" DROP COLUMN "updatedAt",
ADD COLUMN     "crowdLevel" TEXT NOT NULL,
ALTER COLUMN "imageUrl" DROP NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
