/*
  Warnings:

  - Added the required column `duration` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "duration" INTEGER NOT NULL;
