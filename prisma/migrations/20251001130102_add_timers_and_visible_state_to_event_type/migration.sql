/*
  Warnings:

  - Added the required column `duration_seconds` to the `timers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "event_types" ADD COLUMN     "timer_skeleton" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "visible_state_skeleton" JSONB NOT NULL DEFAULT '[]',
ALTER COLUMN "multi_text_skeleton" SET DEFAULT '[]';

-- AlterTable
ALTER TABLE "timers" ADD COLUMN     "allow_overtime" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "countdown" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "duration_seconds" INTEGER NOT NULL;
