/*
  Warnings:

  - Made the column `path` on table `multi_texts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "multi_texts" ALTER COLUMN "path" SET NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;
