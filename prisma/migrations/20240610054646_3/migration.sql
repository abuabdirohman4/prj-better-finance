/*
  Warnings:

  - You are about to drop the `CategoryGroupMembership` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CategoryGroupMembership" DROP CONSTRAINT "CategoryGroupMembership_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CategoryGroupMembership" DROP CONSTRAINT "CategoryGroupMembership_groupId_fkey";

-- DropTable
DROP TABLE "CategoryGroupMembership";

-- CreateTable
CREATE TABLE "CategoryBudgetGroupMembership" (
    "categoryId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "CategoryBudgetGroupMembership_pkey" PRIMARY KEY ("categoryId","groupId")
);

-- AddForeignKey
ALTER TABLE "CategoryBudgetGroupMembership" ADD CONSTRAINT "CategoryBudgetGroupMembership_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CategoryBudget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryBudgetGroupMembership" ADD CONSTRAINT "CategoryBudgetGroupMembership_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CategoryBudgetGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
