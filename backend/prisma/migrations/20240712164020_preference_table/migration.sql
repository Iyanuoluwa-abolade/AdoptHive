/*
  Warnings:

  - You are about to drop the column `gender` on the `Adoptee` table. All the data in the column will be lost.
  - You are about to drop the column `preference` on the `Adoptee` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Adopters` table. All the data in the column will be lost.
  - You are about to drop the column `preference` on the `Adopters` table. All the data in the column will be lost.
  - Added the required column `Sex` to the `Adoptee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preferencesId` to the `Adoptee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Sex` to the `Adopters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preferencesId` to the `Adopters` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('Female', 'Male');

-- AlterTable
ALTER TABLE "Adoptee" DROP COLUMN "gender",
DROP COLUMN "preference",
ADD COLUMN     "Sex" TEXT NOT NULL,
ADD COLUMN     "preferencesId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Adopters" DROP COLUMN "gender",
DROP COLUMN "preference",
ADD COLUMN     "Sex" TEXT NOT NULL,
ADD COLUMN     "preferencesId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Preferences" (
    "id" SERIAL NOT NULL,
    "sex" "Sex" NOT NULL,
    "age" INTEGER NOT NULL,

    CONSTRAINT "Preferences_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Adoptee" ADD CONSTRAINT "Adoptee_preferencesId_fkey" FOREIGN KEY ("preferencesId") REFERENCES "Preferences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adopters" ADD CONSTRAINT "Adopters_preferencesId_fkey" FOREIGN KEY ("preferencesId") REFERENCES "Preferences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
