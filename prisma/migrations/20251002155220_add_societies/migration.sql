-- AlterTable
ALTER TABLE "event_types" ADD COLUMN     "society_skeleton" JSONB NOT NULL DEFAULT '[]';

-- CreateTable
CREATE TABLE "societies" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "path" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "society_selected" INTEGER,

    CONSTRAINT "societies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "societies_event_id_path_key" ON "societies"("event_id", "path");

-- AddForeignKey
ALTER TABLE "societies" ADD CONSTRAINT "societies_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
