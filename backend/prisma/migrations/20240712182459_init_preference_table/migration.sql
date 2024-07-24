/*
  Warnings:

  - You are about to drop the `Adoptee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Adopter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AdopterToAdoptee` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AdopterToAdoptee" DROP CONSTRAINT "AdopterToAdoptee_adopteeId_fkey";

-- DropForeignKey
ALTER TABLE "AdopterToAdoptee" DROP CONSTRAINT "AdopterToAdoptee_adopterId_fkey";

-- DropTable
DROP TABLE "Adoptee";

-- DropTable
DROP TABLE "Adopter";

-- DropTable
DROP TABLE "AdopterToAdoptee";

-- CreateTable
CREATE TABLE "Adoptees" (
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
    "preferencesId" INTEGER NOT NULL,

    CONSTRAINT "Adoptees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Adopters" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "sex" "Sex" NOT NULL,
    "status" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "background" TEXT NOT NULL,
    "preferencesId" INTEGER NOT NULL,

    CONSTRAINT "Adopters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Preferences" (
    "id" SERIAL NOT NULL,
    "sex" "Sex" NOT NULL,
    "age" INTEGER NOT NULL,

    CONSTRAINT "Preferences_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Adoptees" ADD CONSTRAINT "Adoptees_preferencesId_fkey" FOREIGN KEY ("preferencesId") REFERENCES "Preferences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adopters" ADD CONSTRAINT "Adopters_preferencesId_fkey" FOREIGN KEY ("preferencesId") REFERENCES "Preferences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
