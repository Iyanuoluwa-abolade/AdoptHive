/*
  Warnings:

  - You are about to drop the `AdopteePreferences` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AdopterPreferences` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AdopteePreferences" DROP CONSTRAINT "AdopteePreferences_adopteeId_fkey";

-- DropForeignKey
ALTER TABLE "AdopteePreferences" DROP CONSTRAINT "AdopteePreferences_adopterId_fkey";

-- DropForeignKey
ALTER TABLE "Adopter" DROP CONSTRAINT "Adopter_id_fkey";

-- DropForeignKey
ALTER TABLE "AdopterPreferences" DROP CONSTRAINT "AdopterPreferences_adopteeId_fkey";

-- DropForeignKey
ALTER TABLE "AdopterPreferences" DROP CONSTRAINT "AdopterPreferences_adopterId_fkey";

-- DropTable
DROP TABLE "AdopteePreferences";

-- DropTable
DROP TABLE "AdopterPreferences";

-- CreateTable
CREATE TABLE "AdopterPreference" (
    "id" SERIAL NOT NULL,
    "adopterId" INTEGER NOT NULL,
    "adopteeId" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "AdopterPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdopteePreference" (
    "id" SERIAL NOT NULL,
    "adopteeId" INTEGER NOT NULL,
    "adopterId" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "AdopteePreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdopterPreference_adopterId_adopteeId_key" ON "AdopterPreference"("adopterId", "adopteeId");

-- CreateIndex
CREATE UNIQUE INDEX "AdopteePreference_adopteeId_adopterId_key" ON "AdopteePreference"("adopteeId", "adopterId");

-- AddForeignKey
ALTER TABLE "AdopterPreference" ADD CONSTRAINT "AdopterPreference_adopterId_fkey" FOREIGN KEY ("adopterId") REFERENCES "Adopter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdopterPreference" ADD CONSTRAINT "AdopterPreference_adopteeId_fkey" FOREIGN KEY ("adopteeId") REFERENCES "Adoptee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdopteePreference" ADD CONSTRAINT "AdopteePreference_adopteeId_fkey" FOREIGN KEY ("adopteeId") REFERENCES "Adoptee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdopteePreference" ADD CONSTRAINT "AdopteePreference_adopterId_fkey" FOREIGN KEY ("adopterId") REFERENCES "Adopter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
