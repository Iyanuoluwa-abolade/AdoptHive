-- CreateTable
CREATE TABLE "Adopters" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "background" TEXT NOT NULL,

    CONSTRAINT "Adopters_pkey" PRIMARY KEY ("id")
);
