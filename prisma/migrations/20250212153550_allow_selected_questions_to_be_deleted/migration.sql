-- DropForeignKey
ALTER TABLE "QuestionOutput" DROP CONSTRAINT "QuestionOutput_question_id_fkey";

-- AlterTable
ALTER TABLE "QuestionOutput" ALTER COLUMN "question_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "QuestionOutput" ADD CONSTRAINT "QuestionOutput_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
