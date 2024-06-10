-- DropForeignKey
ALTER TABLE "CategoryBudget" DROP CONSTRAINT "CategoryBudget_clientId_fkey";

-- DropForeignKey
ALTER TABLE "CategoryBudgetGroup" DROP CONSTRAINT "CategoryBudgetGroup_clientId_fkey";

-- DropForeignKey
ALTER TABLE "MonthlyCategoryBudget" DROP CONSTRAINT "MonthlyCategoryBudget_clientId_fkey";

-- DropForeignKey
ALTER TABLE "MonthlyIncome" DROP CONSTRAINT "MonthlyIncome_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_clientId_fkey";

-- AlterTable
ALTER TABLE "CategoryBudget" ALTER COLUMN "clientId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "CategoryBudgetGroup" ALTER COLUMN "clientId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "clientId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "MonthlyCategoryBudget" ALTER COLUMN "clientId" SET DATA TYPE TEXT,
ALTER COLUMN "year" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "MonthlyIncome" ALTER COLUMN "clientId" SET DATA TYPE TEXT,
ALTER COLUMN "year" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "clientId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "CategoryBudget" ADD CONSTRAINT "CategoryBudget_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("clientId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryBudgetGroup" ADD CONSTRAINT "CategoryBudgetGroup_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("clientId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyCategoryBudget" ADD CONSTRAINT "MonthlyCategoryBudget_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("clientId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyIncome" ADD CONSTRAINT "MonthlyIncome_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("clientId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("clientId") ON DELETE RESTRICT ON UPDATE CASCADE;
