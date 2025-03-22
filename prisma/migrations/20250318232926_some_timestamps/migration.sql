/*
  Warnings:

  - Added the required column `name` to the `event_types` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `event_types` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "event_types" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
