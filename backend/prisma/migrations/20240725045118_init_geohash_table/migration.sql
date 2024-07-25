/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `LocationId` to the `Adoptee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Adoptee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `LocationId` to the `Adopter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Adopter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Adoptee" ADD COLUMN     "LocationId" INTEGER NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Adopter" ADD COLUMN     "LocationId" INTEGER NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "geohash" TEXT,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "Adopter" ADD CONSTRAINT "Adopter_LocationId_fkey" FOREIGN KEY ("LocationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adoptee" ADD CONSTRAINT "Adoptee_LocationId_fkey" FOREIGN KEY ("LocationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
