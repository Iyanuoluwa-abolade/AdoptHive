-- CreateTable
CREATE TABLE "Adoptee" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "background" TEXT NOT NULL,
    "interests" TEXT NOT NULL,
    "education" TEXT NOT NULL,
    "traits" TEXT NOT NULL,
    "dreams" TEXT NOT NULL,

    CONSTRAINT "Adoptee_pkey" PRIMARY KEY ("id")
);
