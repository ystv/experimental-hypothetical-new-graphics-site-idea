/*
  Warnings:

  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Layer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MultiTextSelected` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MultiTextSelected" DROP CONSTRAINT "MultiTextSelected_multi_text_id_fkey";

-- DropForeignKey
ALTER TABLE "MultiTextSelected" DROP CONSTRAINT "MultiTextSelected_selected_option_id_fkey";

-- DropForeignKey
ALTER TABLE "multi_texts" DROP CONSTRAINT "multi_texts_event_id_fkey";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "Layer";

-- DropTable
DROP TABLE "MultiTextSelected";

-- CreateTable
CREATE TABLE "layers" (
    "id" TEXT NOT NULL,
    "style" JSONB,

    CONSTRAINT "layers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_types" (
    "id" TEXT NOT NULL,
    "multi_text_skeleton" JSONB NOT NULL,

    CONSTRAINT "event_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "type_id" TEXT NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "multi_texts_selected" (
    "multi_text_id" TEXT NOT NULL,
    "selected_option_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "multi_texts_selected_multi_text_id_key" ON "multi_texts_selected"("multi_text_id");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "event_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "multi_texts" ADD CONSTRAINT "multi_texts_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "multi_texts_selected" ADD CONSTRAINT "multi_texts_selected_multi_text_id_fkey" FOREIGN KEY ("multi_text_id") REFERENCES "multi_texts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "multi_texts_selected" ADD CONSTRAINT "multi_texts_selected_selected_option_id_fkey" FOREIGN KEY ("selected_option_id") REFERENCES "multi_text_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
