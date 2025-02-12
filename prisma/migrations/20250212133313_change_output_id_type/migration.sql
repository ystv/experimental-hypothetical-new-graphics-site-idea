/*
  Warnings:

  - The primary key for the `Output` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Output` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `output_id` on the `QuestionOutput` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `output_id` on the `questions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "QuestionOutput" DROP CONSTRAINT "QuestionOutput_output_id_fkey";

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_output_id_fkey";

-- AlterTable
ALTER TABLE "Output" DROP CONSTRAINT "Output_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Output_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "QuestionOutput" DROP COLUMN "output_id",
ADD COLUMN     "output_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "output_id",
ADD COLUMN     "output_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "QuestionOutput_output_id_key" ON "QuestionOutput"("output_id");

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_output_id_fkey" FOREIGN KEY ("output_id") REFERENCES "Output"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionOutput" ADD CONSTRAINT "QuestionOutput_output_id_fkey" FOREIGN KEY ("output_id") REFERENCES "Output"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
