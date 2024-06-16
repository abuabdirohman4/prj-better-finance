/*
  Warnings:

  - You are about to drop the `Brand` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CategoryBudget` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CategoryBudgetGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CategoryBudgetGroupMembership` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MonthlyCategoryBudget` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MonthlyIncome` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `desc` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CategoryBudget" DROP CONSTRAINT "CategoryBudget_clientId_fkey";

-- DropForeignKey
ALTER TABLE "CategoryBudgetGroup" DROP CONSTRAINT "CategoryBudgetGroup_clientId_fkey";

-- DropForeignKey
ALTER TABLE "CategoryBudgetGroupMembership" DROP CONSTRAINT "CategoryBudgetGroupMembership_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CategoryBudgetGroupMembership" DROP CONSTRAINT "CategoryBudgetGroupMembership_groupId_fkey";

-- DropForeignKey
ALTER TABLE "MonthlyCategoryBudget" DROP CONSTRAINT "MonthlyCategoryBudget_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "MonthlyCategoryBudget" DROP CONSTRAINT "MonthlyCategoryBudget_clientId_fkey";

-- DropForeignKey
ALTER TABLE "MonthlyIncome" DROP CONSTRAINT "MonthlyIncome_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "MonthlyIncome" DROP CONSTRAINT "MonthlyIncome_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_brandId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_categoryId_fkey";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "desc" TEXT NOT NULL,
ADD COLUMN     "pocket1" INTEGER,
ADD COLUMN     "pocket2" INTEGER;

-- DropTable
DROP TABLE "Brand";

-- DropTable
DROP TABLE "CategoryBudget";

-- DropTable
DROP TABLE "CategoryBudgetGroup";

-- DropTable
DROP TABLE "CategoryBudgetGroupMembership";

-- DropTable
DROP TABLE "MonthlyCategoryBudget";

-- DropTable
DROP TABLE "MonthlyIncome";

-- DropTable
DROP TABLE "Product";

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "parentId" INTEGER,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryGroup" (
    "id" SERIAL NOT NULL,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CategoryGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryGroupMembership" (
    "categoryId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "CategoryGroupMembership_pkey" PRIMARY KEY ("categoryId","groupId")
);

-- CreateTable
CREATE TABLE "MonthlyCategory" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "clientId" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "MonthlyCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pocket" (
    "id" SERIAL NOT NULL,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "actual" DOUBLE PRECISION NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Pocket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyCategory_categoryId_clientId_year_month_key" ON "MonthlyCategory"("categoryId", "clientId", "year", "month");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("clientId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryGroup" ADD CONSTRAINT "CategoryGroup_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("clientId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryGroupMembership" ADD CONSTRAINT "CategoryGroupMembership_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryGroupMembership" ADD CONSTRAINT "CategoryGroupMembership_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CategoryGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyCategory" ADD CONSTRAINT "MonthlyCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyCategory" ADD CONSTRAINT "MonthlyCategory_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("clientId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_pocket1_fkey" FOREIGN KEY ("pocket1") REFERENCES "Pocket"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_pocket2_fkey" FOREIGN KEY ("pocket2") REFERENCES "Pocket"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pocket" ADD CONSTRAINT "Pocket_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("clientId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pocket" ADD CONSTRAINT "Pocket_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
