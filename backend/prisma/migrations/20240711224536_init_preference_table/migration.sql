/*
  Warnings:

  - Added the required column `preference` to the `Adoptee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preference` to the `Adopters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Adopters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Adoptee" ADD COLUMN     "preference" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Adopters" ADD COLUMN     "preference" JSONB NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;
