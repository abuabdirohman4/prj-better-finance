"use client";
import Budget from "@/components/Card/Budget";
import SkeletonList from "@/components/Skeleton/List";
import { months } from "@/utils/constants";
import { getData } from "@/utils/fetch";
import { fetchTransaction } from "@/utils/fetchTransaction";
import {
  formatRupiah,
  getCashValue,
  getDefaultSheetName,
  getTotalObjectValue,
} from "@/utils/helper";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function Budgets() {
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const clientId = "1717515";
  const [selectedMonth, setSelectedMonth] = useState(
    getDefaultSheetName(months)
  );
  const [categoryGroup, setCategoryGroup] = useState([]);
  const [totalSpending, setTotalSpending] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);

  const balance = parseFloat(totalSpending) + parseFloat(totalBudget);
  const percentage =
    (parseFloat(totalSpending) / -parseFloat(totalBudget)) * 100;
  const stringPercent = percentage.toFixed(0);

  const sumCategoryGroupSpending = useCallback(
    (transaction, categoryGroupBudget, nameCategoryGroups, typeTransaction) => {
      const newSubCategorySpending = {};
      const newCategorySpending = {};

      for (const group of categoryGroupBudget) {
        const { name: parentCategory } = group;
        const categories = nameCategoryGroups.filter(
          (category) => category.groupName === parentCategory
        );

        let totalGroupAmount = 0;
        for (const category of categories) {
          const transactionsInCategory = transaction.filter(
            (item) =>
              item["Category or Account"] === category.name &&
              item.Transaction === typeTransaction
          );
          const totalAmount = transactionsInCategory.reduce(
            (acc, item) => acc + getCashValue(item),
            0
          );

          // Menambahkan nilai total ke kategori yang sesuai
          if (!newSubCategorySpending[parentCategory]) {
            newSubCategorySpending[parentCategory] = {};
          }
          newSubCategorySpending[parentCategory][category.name] = totalAmount;

          // Tambahkan totalAmount dari kategori ke total grup
          totalGroupAmount += totalAmount;
        }
        newCategorySpending[parentCategory] = totalGroupAmount;
      }
      return newCategorySpending;
    },
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingContent(true);
        const { status, data: categoryGroupBudget } = await getData({
          url: "/api/categories/budgets/group",
          params: { clientId },
        });

        if (status === 200) {
          // Combine the fetched data directly for use
          const amountCategoryGroups = {};
          const nameCategoryGroups = [];

          // Get data & total category group budget
          categoryGroupBudget.forEach((group) => {
            amountCategoryGroups[group.name] = group.totalAmount;
            group.categories.forEach((category) => {
              nameCategoryGroups.push({
                ...category,
                groupName: group.name,
              });
            });
          });
          setTotalBudget(getTotalObjectValue(amountCategoryGroups));

          // Get data & total category group spending
          const transactions = await fetchTransaction(selectedMonth);
          const categoryGroupSpending = sumCategoryGroupSpending(
            transactions,
            categoryGroupBudget,
            nameCategoryGroups,
            "Spending"
          );
          setTotalSpending(getTotalObjectValue(categoryGroupSpending));

          // Combine data
          const mergedData = categoryGroupBudget.map((group) => {
            return {
              name: group.name,
              budget: group.totalAmount,
              spending: categoryGroupSpending[group.name] || 0,
            };
          });
          setCategoryGroup(mergedData);
          setIsLoadingContent(false);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, [selectedMonth, sumCategoryGroupSpending]);

  return (
    <main>
      <div className="w-full max-w-md min-h-screen p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-8">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
            Budgets
          </h5>
          <select
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        {isLoadingContent ? (
          <SkeletonList listNumber={12} />
        ) : (
          <>
            <div className="flex items-center justify-between ">
              <h5 className="text-center">
                <p className="text-base font-medium text-gray-900 truncate dark:text-white">
                  Budget
                </p>
                <div className="text-base font-semibold text-gray-900 dark:text-white">
                  {formatRupiah(totalBudget)}
                </div>
              </h5>
              <h5 className="text-center">
                <p className="text-base font-medium text-gray-900 truncate dark:text-white">
                  Balance
                </p>
                <div
                  className={`text-base font-semibold text-gray-900 dark:text-white ${
                    balance < 0 && "text-red-500"
                  }`}
                >
                  {formatRupiah(balance)}
                </div>
              </h5>
              <h5 className="text-center">
                <p className="text-base font-medium text-gray-900 truncate dark:text-white">
                  Spending
                </p>
                <div className="text-base font-semibold text-red-600 dark:text-white">
                  {formatRupiah(totalSpending)}
                </div>
              </h5>
            </div>
            <div className="flex items-center justify-center mt-4 mb-3">
              <p className="text-sm text-gray-500 truncate me-2">
                {stringPercent}%
              </p>
              <div className="w-8/12 bg-gray-200 rounded-full">
                <div
                  className={`bg-blue-600 text-xs h-2 font-medium text-center p-0.5 leading-none rounded-full`}
                  style={{
                    width: `${percentage > 100 ? "100" : stringPercent}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="flow-root">
              <ul
                role="list"
                className="border-y-[1.5px] border-y-gray-200 divide-y divide-gray-200 dark:divide-gray-700"
              >
                {categoryGroup.map((category, key) => (
                  <div key={key}>
                    <Link
                      href={{
                        pathname: `/budgets/${category.name.toLowerCase()}`,
                        query: { month: selectedMonth },
                      }}
                    >
                      <Budget
                        category={category.name}
                        budget={category.budget}
                        spending={category.spending}
                      />
                    </Link>
                  </div>
                ))}
              </ul>
              <div className="mt-3 text-center underline">
                <Link href="/budgets/create" className="hover:text-blue-500">
                  Add Category Groups
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
