/*
  Warnings:

  - You are about to drop the column `rank` on the `Adoptees` table. All the data in the column will be lost.
  - You are about to drop the column `rank` on the `Adopters` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Adoptees" DROP COLUMN "rank";

-- AlterTable
ALTER TABLE "Adopters" DROP COLUMN "rank";

-- CreateTable
CREATE TABLE "AdopterPreference" (
    "id" SERIAL NOT NULL,
    "rank" INTEGER NOT NULL,
    "adopterId" INTEGER NOT NULL,
    "adopteeId" INTEGER NOT NULL,

    CONSTRAINT "AdopterPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdopteePreference" (
    "id" SERIAL NOT NULL,
    "rank" INTEGER NOT NULL,
    "adopteeId" INTEGER NOT NULL,
    "adopterId" INTEGER NOT NULL,

    CONSTRAINT "AdopteePreference_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AdopterPreference" ADD CONSTRAINT "AdopterPreference_adopterId_fkey" FOREIGN KEY ("adopterId") REFERENCES "Adopters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdopterPreference" ADD CONSTRAINT "AdopterPreference_adopteeId_fkey" FOREIGN KEY ("adopteeId") REFERENCES "Adoptees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdopteePreference" ADD CONSTRAINT "AdopteePreference_adopteeId_fkey" FOREIGN KEY ("adopteeId") REFERENCES "Adoptees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdopteePreference" ADD CONSTRAINT "AdopteePreference_adopterId_fkey" FOREIGN KEY ("adopterId") REFERENCES "Adopters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
