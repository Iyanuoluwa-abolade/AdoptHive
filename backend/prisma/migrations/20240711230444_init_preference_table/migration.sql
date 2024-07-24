/*
  Warnings:

  - Added the required column `gender` to the `Adoptee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Adopters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Adoptee" ADD COLUMN     "gender" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Adopters" ADD COLUMN     "gender" TEXT NOT NULL;
