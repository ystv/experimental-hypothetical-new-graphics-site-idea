/*
  Warnings:

  - You are about to drop the column `question_id` on the `Output` table. All the data in the column will be lost.
  - Added the required column `output_id` to the `questions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Output" DROP CONSTRAINT "Output_question_id_fkey";

-- AlterTable
ALTER TABLE "Output" DROP COLUMN "question_id";

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "output_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "QuestionOutput" (
    "output_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "QuestionOutput_output_id_key" ON "QuestionOutput"("output_id");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionOutput_question_id_key" ON "QuestionOutput"("question_id");

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_output_id_fkey" FOREIGN KEY ("output_id") REFERENCES "Output"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionOutput" ADD CONSTRAINT "QuestionOutput_output_id_fkey" FOREIGN KEY ("output_id") REFERENCES "Output"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionOutput" ADD CONSTRAINT "QuestionOutput_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
