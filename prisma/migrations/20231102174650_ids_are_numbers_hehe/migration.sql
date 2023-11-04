/*
  Warnings:

  - The primary key for the `Movie` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `movieId` on the `Interested` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Movie` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `B` on the `_CategoryToMovie` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Interested" DROP CONSTRAINT "Interested_movieId_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToMovie" DROP CONSTRAINT "_CategoryToMovie_B_fkey";

-- AlterTable
ALTER TABLE "Interested" DROP COLUMN "movieId",
ADD COLUMN     "movieId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Movie" DROP CONSTRAINT "Movie_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "Movie_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "_CategoryToMovie" DROP COLUMN "B",
ADD COLUMN     "B" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToMovie_AB_unique" ON "_CategoryToMovie"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToMovie_B_index" ON "_CategoryToMovie"("B");

-- AddForeignKey
ALTER TABLE "Interested" ADD CONSTRAINT "Interested_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToMovie" ADD CONSTRAINT "_CategoryToMovie_B_fkey" FOREIGN KEY ("B") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
