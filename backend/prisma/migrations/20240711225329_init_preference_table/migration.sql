-- AlterTable
ALTER TABLE "Adoptee" ALTER COLUMN "preference" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Adopters" ALTER COLUMN "preference" DROP NOT NULL;
