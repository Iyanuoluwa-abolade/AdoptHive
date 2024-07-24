/*
  Warnings:

  - The values [AP,OS] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `MiddleName` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `Adoptees` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Adopters` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Matches` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AdopteesToAdopters` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('Adopter', 'Adoptee');
ALTER TABLE "user" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Matches" DROP CONSTRAINT "Matches_adopteesId_fkey";

-- DropForeignKey
ALTER TABLE "Matches" DROP CONSTRAINT "Matches_adoptersId_fkey";

-- DropForeignKey
ALTER TABLE "_AdopteesToAdopters" DROP CONSTRAINT "_AdopteesToAdopters_A_fkey";

-- DropForeignKey
ALTER TABLE "_AdopteesToAdopters" DROP CONSTRAINT "_AdopteesToAdopters_B_fkey";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "MiddleName";

-- DropTable
DROP TABLE "Adoptees";

-- DropTable
DROP TABLE "Adopters";

-- DropTable
DROP TABLE "Matches";

-- DropTable
DROP TABLE "_AdopteesToAdopters";

-- CreateTable
CREATE TABLE "Adopter" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "sex" "Sex" NOT NULL,
    "status" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "background" TEXT NOT NULL,
    "UserId" INTEGER NOT NULL,

    CONSTRAINT "Adopter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Adoptee" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "sex" "Sex" NOT NULL,
    "birthdate" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "background" TEXT NOT NULL,
    "interests" TEXT NOT NULL,
    "education" TEXT NOT NULL,
    "traits" TEXT NOT NULL,
    "dreams" TEXT NOT NULL,
    "UserId" INTEGER NOT NULL,

    CONSTRAINT "Adoptee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdopterPreferences" (
    "id" SERIAL NOT NULL,
    "adopterId" INTEGER NOT NULL,
    "adopteeId" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "AdopterPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdopteePreferences" (
    "id" SERIAL NOT NULL,
    "adopteeId" INTEGER NOT NULL,
    "adopterId" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "AdopteePreferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Adopter_UserId_key" ON "Adopter"("UserId");

-- CreateIndex
CREATE UNIQUE INDEX "Adoptee_UserId_key" ON "Adoptee"("UserId");

-- CreateIndex
CREATE UNIQUE INDEX "AdopterPreferences_adopterId_adopteeId_key" ON "AdopterPreferences"("adopterId", "adopteeId");

-- CreateIndex
CREATE UNIQUE INDEX "AdopteePreferences_adopteeId_adopterId_key" ON "AdopteePreferences"("adopteeId", "adopterId");

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- AddForeignKey
ALTER TABLE "Adopter" ADD CONSTRAINT "Adopter_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adopter" ADD CONSTRAINT "Adopter_id_fkey" FOREIGN KEY ("id") REFERENCES "Adoptee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adoptee" ADD CONSTRAINT "Adoptee_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdopterPreferences" ADD CONSTRAINT "AdopterPreferences_adopterId_fkey" FOREIGN KEY ("adopterId") REFERENCES "Adopter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdopterPreferences" ADD CONSTRAINT "AdopterPreferences_adopteeId_fkey" FOREIGN KEY ("adopteeId") REFERENCES "Adoptee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdopteePreferences" ADD CONSTRAINT "AdopteePreferences_adopteeId_fkey" FOREIGN KEY ("adopteeId") REFERENCES "Adoptee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdopteePreferences" ADD CONSTRAINT "AdopteePreferences_adopterId_fkey" FOREIGN KEY ("adopterId") REFERENCES "Adopter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
