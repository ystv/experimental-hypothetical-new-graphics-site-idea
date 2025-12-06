-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_type_id_fkey";

-- AlterTable
ALTER TABLE "events" ALTER COLUMN "type_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "event_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;
