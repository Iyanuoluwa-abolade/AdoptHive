-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "FirstName" TEXT NOT NULL,
    "MiddleName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "Username" TEXT NOT NULL,
    "Password" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_Username_key" ON "user"("Username");
