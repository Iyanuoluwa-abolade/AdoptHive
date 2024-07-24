/*
  Warnings:

  - You are about to drop the column `Sex` on the `Adoptee` table. All the data in the column will be lost.
  - You are about to drop the column `Sex` on the `Adopters` table. All the data in the column will be lost.
  - Added the required column `sex` to the `Adoptee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sex` to the `Adopters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Adoptee" DROP COLUMN "Sex",
ADD COLUMN     "sex" "Sex" NOT NULL;

-- AlterTable
ALTER TABLE "Adopters" DROP COLUMN "Sex",
ADD COLUMN     "sex" "Sex" NOT NULL;
