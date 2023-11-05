/*
  Warnings:

  - A unique constraint covering the columns `[userId,movieId]` on the table `Interested` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Interested_userId_movieId_key" ON "Interested"("userId", "movieId");
