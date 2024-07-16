/*
  Warnings:

  - You are about to drop the `Preferences` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Preferences" DROP CONSTRAINT "Preferences_adoptersId_fkey";

-- AlterTable
ALTER TABLE "Adoptees" ADD COLUMN     "rank" JSONB;

-- AlterTable
ALTER TABLE "Adopters" ADD COLUMN     "rank" JSONB;

-- DropTable
DROP TABLE "Preferences";
