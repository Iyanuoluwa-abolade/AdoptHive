/*
  Warnings:

  - You are about to drop the column `state` on the `Adoptee` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Adopter` table. All the data in the column will be lost.
  - Added the required column `country` to the `Adoptee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Adopter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Adoptee" DROP COLUMN "state",
ADD COLUMN     "country" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Adopter" DROP COLUMN "state",
ADD COLUMN     "country" TEXT NOT NULL;
