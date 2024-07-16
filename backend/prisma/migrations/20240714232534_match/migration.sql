/*
  Warnings:

  - You are about to drop the `AdopteePreference` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AdopterPreference` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `rank` to the `Adoptees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rank` to the `Adopters` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AdopteePreference" DROP CONSTRAINT "AdopteePreference_adopteeId_fkey";

-- DropForeignKey
ALTER TABLE "AdopteePreference" DROP CONSTRAINT "AdopteePreference_adopterId_fkey";

-- DropForeignKey
ALTER TABLE "AdopterPreference" DROP CONSTRAINT "AdopterPreference_adopteeId_fkey";

-- DropForeignKey
ALTER TABLE "AdopterPreference" DROP CONSTRAINT "AdopterPreference_adopterId_fkey";

-- AlterTable
ALTER TABLE "Adoptees" ADD COLUMN     "matched" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rank" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Adopters" ADD COLUMN     "matched" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rank" JSONB NOT NULL;

-- DropTable
DROP TABLE "AdopteePreference";

-- DropTable
DROP TABLE "AdopterPreference";

-- CreateTable
CREATE TABLE "Matches" (
    "id" SERIAL NOT NULL,
    "adoptersId" INTEGER NOT NULL,
    "adopteesId" INTEGER NOT NULL,

    CONSTRAINT "Matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AdopteesToAdopters" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AdopteesToAdopters_AB_unique" ON "_AdopteesToAdopters"("A", "B");

-- CreateIndex
CREATE INDEX "_AdopteesToAdopters_B_index" ON "_AdopteesToAdopters"("B");

-- AddForeignKey
ALTER TABLE "Matches" ADD CONSTRAINT "Matches_adoptersId_fkey" FOREIGN KEY ("adoptersId") REFERENCES "Adopters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matches" ADD CONSTRAINT "Matches_adopteesId_fkey" FOREIGN KEY ("adopteesId") REFERENCES "Adoptees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdopteesToAdopters" ADD CONSTRAINT "_AdopteesToAdopters_A_fkey" FOREIGN KEY ("A") REFERENCES "Adoptees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdopteesToAdopters" ADD CONSTRAINT "_AdopteesToAdopters_B_fkey" FOREIGN KEY ("B") REFERENCES "Adopters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
