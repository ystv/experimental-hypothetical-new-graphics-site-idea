/*
  Warnings:

  - A unique constraint covering the columns `[active_cue_id]` on the table `events` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "events" ADD COLUMN     "active_cue_id" TEXT;

-- CreateTable
CREATE TABLE "cues" (
    "id" TEXT NOT NULL,
    "label" TEXT,
    "number" INTEGER NOT NULL,
    "event_id" TEXT NOT NULL,

    CONSTRAINT "cues_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "events_active_cue_id_key" ON "events"("active_cue_id");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_active_cue_id_fkey" FOREIGN KEY ("active_cue_id") REFERENCES "cues"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cues" ADD CONSTRAINT "cues_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
