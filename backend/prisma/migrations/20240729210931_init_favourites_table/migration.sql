-- CreateTable
CREATE TABLE "Favourite" (
    "id" SERIAL NOT NULL,
    "UserId" INTEGER NOT NULL,
    "adopterId" INTEGER,
    "adopteeId" INTEGER,

    CONSTRAINT "Favourite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Favourite_UserId_adopterId_adopteeId_key" ON "Favourite"("UserId", "adopterId", "adopteeId");

-- AddForeignKey
ALTER TABLE "Favourite" ADD CONSTRAINT "Favourite_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favourite" ADD CONSTRAINT "Favourite_adopterId_fkey" FOREIGN KEY ("adopterId") REFERENCES "Adopter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favourite" ADD CONSTRAINT "Favourite_adopteeId_fkey" FOREIGN KEY ("adopteeId") REFERENCES "Adoptee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
