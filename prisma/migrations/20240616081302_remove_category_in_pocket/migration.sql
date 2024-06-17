/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Pocket` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pocket" DROP CONSTRAINT "Pocket_categoryId_fkey";

-- AlterTable
ALTER TABLE "Pocket" DROP COLUMN "categoryId";
