-- CreateTable
CREATE TABLE "TextScore" (
    "id" SERIAL NOT NULL,
    "adopterId" INTEGER NOT NULL,
    "adopteeId" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TextScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TextScore_adopterId_adopteeId_key" ON "TextScore"("adopterId", "adopteeId");

-- AddForeignKey
ALTER TABLE "TextScore" ADD CONSTRAINT "TextScore_adopterId_fkey" FOREIGN KEY ("adopterId") REFERENCES "Adopter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextScore" ADD CONSTRAINT "TextScore_adopteeId_fkey" FOREIGN KEY ("adopteeId") REFERENCES "Adoptee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
