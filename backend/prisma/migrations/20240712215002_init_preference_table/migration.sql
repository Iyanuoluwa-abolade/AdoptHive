/*
  Warnings:

  - You are about to drop the column `preferencesId` on the `Adoptees` table. All the data in the column will be lost.
  - You are about to drop the column `preferencesId` on the `Adopters` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Adoptees" DROP CONSTRAINT "Adoptees_preferencesId_fkey";

-- DropForeignKey
ALTER TABLE "Adopters" DROP CONSTRAINT "Adopters_preferencesId_fkey";

-- AlterTable
ALTER TABLE "Adoptees" DROP COLUMN "preferencesId";

-- AlterTable
ALTER TABLE "Adopters" DROP COLUMN "preferencesId";

-- AlterTable
ALTER TABLE "Preferences" ADD COLUMN     "adoptersId" INTEGER;

-- AddForeignKey
ALTER TABLE "Preferences" ADD CONSTRAINT "Preferences_adoptersId_fkey" FOREIGN KEY ("adoptersId") REFERENCES "Adopters"("id") ON DELETE SET NULL ON UPDATE CASCADE;
