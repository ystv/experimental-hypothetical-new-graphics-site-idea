/*
  Warnings:

  - Added the required column `content` to the `multi_text_options` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "multi_text_options" ADD COLUMN     "content" TEXT NOT NULL;
