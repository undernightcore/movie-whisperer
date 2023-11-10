/*
  Warnings:

  - Made the column `poster` on table `Movie` required. This step will fail if there are existing NULL values in that column.

*/

DELETE FROM "Movie" WHERE poster IS NULL;

-- AlterTable
ALTER TABLE "Movie" ALTER COLUMN "poster" SET NOT NULL;
