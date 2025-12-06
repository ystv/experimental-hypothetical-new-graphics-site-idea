/*
  Warnings:

  - You are about to drop the `EventGraphicsCollection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventGraphicsCollection" DROP CONSTRAINT "EventGraphicsCollection_event_id_fkey";

-- DropTable
DROP TABLE "EventGraphicsCollection";

-- CreateTable
CREATE TABLE "event_graphics_collection" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "event_id" TEXT NOT NULL,
    "collection_slug" TEXT NOT NULL,
    "path_mapping" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "event_graphics_collection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "event_graphics_collection" ADD CONSTRAINT "event_graphics_collection_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
