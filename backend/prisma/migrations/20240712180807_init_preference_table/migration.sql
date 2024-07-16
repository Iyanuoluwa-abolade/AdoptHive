/*
  Warnings:

  - You are about to drop the column `preferencesId` on the `Adoptee` table. All the data in the column will be lost.
  - You are about to drop the `Adopters` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Preferences` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Adoptee" DROP CONSTRAINT "Adoptee_preferencesId_fkey";

-- DropForeignKey
ALTER TABLE "Adopters" DROP CONSTRAINT "Adopters_preferencesId_fkey";

-- AlterTable
ALTER TABLE "Adoptee" DROP COLUMN "preferencesId";

-- DropTable
DROP TABLE "Adopters";

-- DropTable
DROP TABLE "Preferences";

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

    CONSTRAINT "Adopter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdopterToAdoptee" (
    "adopterId" INTEGER NOT NULL,
    "adopteeId" INTEGER NOT NULL,
    "rank" INTEGER,

    CONSTRAINT "AdopterToAdoptee_pkey" PRIMARY KEY ("adopterId","adopteeId")
);

-- AddForeignKey
ALTER TABLE "AdopterToAdoptee" ADD CONSTRAINT "AdopterToAdoptee_adopterId_fkey" FOREIGN KEY ("adopterId") REFERENCES "Adopter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdopterToAdoptee" ADD CONSTRAINT "AdopterToAdoptee_adopteeId_fkey" FOREIGN KEY ("adopteeId") REFERENCES "Adoptee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
