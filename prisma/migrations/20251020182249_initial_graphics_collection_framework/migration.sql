-- CreateTable
CREATE TABLE "EventGraphicsCollection" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "event_id" TEXT NOT NULL,
    "collection_slug" TEXT NOT NULL,
    "path_mapping" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "EventGraphicsCollection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EventGraphicsCollection" ADD CONSTRAINT "EventGraphicsCollection_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
