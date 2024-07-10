/*
  Warnings:

  - Added the required column `Role` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('AP', 'OS');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "Role" "Role" NOT NULL;
