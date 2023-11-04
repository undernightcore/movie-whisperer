/*
  Warnings:

  - Added the required column `content` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
CREATE EXTENSION IF NOT EXISTS vector;

-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "vector" vector;
