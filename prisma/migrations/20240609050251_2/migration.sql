/*
  Warnings:

  - Added the required column `type` to the `CategoryBudget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `MonthlyCategoryBudget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CategoryBudget" ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MonthlyCategoryBudget" ADD COLUMN     "type" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "MonthlyIncome" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "MonthlyIncome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyIncome_categoryId_clientId_year_month_key" ON "MonthlyIncome"("categoryId", "clientId", "year", "month");

-- AddForeignKey
ALTER TABLE "MonthlyIncome" ADD CONSTRAINT "MonthlyIncome_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CategoryBudget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyIncome" ADD CONSTRAINT "MonthlyIncome_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("clientId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CategoryBudget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("clientId") ON DELETE RESTRICT ON UPDATE CASCADE;
