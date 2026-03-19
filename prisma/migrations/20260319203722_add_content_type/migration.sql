/*
  Warnings:

  - You are about to drop the column `videoUrl` on the `Lesson` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('VIDEO', 'AUDIO', 'PDF');

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "videoUrl",
ADD COLUMN     "contentType" "ContentType" NOT NULL DEFAULT 'VIDEO',
ADD COLUMN     "contentUrl" TEXT NOT NULL DEFAULT '';
