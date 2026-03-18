-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "passingScore" INTEGER NOT NULL DEFAULT 70;

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "lessonId" INTEGER NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Choice" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "Choice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Choice" ADD CONSTRAINT "Choice_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
