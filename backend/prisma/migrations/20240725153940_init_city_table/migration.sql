/*
  Warnings:

  - The primary key for the `TextScore` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `TextScore` table. All the data in the column will be lost.
  - Added the required column `city` to the `Adoptee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Adopter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Adoptee" ADD COLUMN     "city" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Adopter" ADD COLUMN     "city" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TextScore" DROP CONSTRAINT "TextScore_pkey",
DROP COLUMN "id";
