"use client";
import Link from "next/link";
import Budget from "@/components/Card/Budget";
import { categories, months } from "@/utils/constants";
import { fetchTransaction } from "../transactions/data";
import {
  formatCurrency,
  getBudgetColors,
  getCashValue,
  getTotalObjectValue,
} from "@/utils/helper";
import { getDefaultSheetName } from "@/utils/google";
import { useCallback, useEffect, useState } from "react";

const budgetCategory = {
  eating: 3200000,
  living: 4726350,
  saving: 1969232,
  investing: 1941000,
  giving: 1026074,
  shodaqoh: 300000,
};

export default function Budgets() {
  const [categorySpending, setCategorySpending] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(getDefaultSheetName(months));
  const [totalSpending, setTotalSpending] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const balance = parseFloat(totalSpending) + parseFloat(totalBudget);
  const percentage = (parseFloat(totalSpending) / -parseFloat(totalBudget)) * 100;
  const stringPercent = percentage.toFixed(0);
  const colors = getBudgetColors(percentage);
  console.log('colors')

  const sumCategory = useCallback(
    (transaction, categoryList, typeTransaction) => {
      const newSubCategorySpending = {};
      const newCategorySpending = {};
      for (const category of categoryList) {
        const transactionsInCategory = transaction.filter(
          (item) =>
            item["Category or Account"] === category &&
            item.Transaction === typeTransaction
        );
        const totalAmount = transactionsInCategory.reduce(
          (acc, item) => acc + getCashValue(item),
          0
        );
        // Menentukan kategori induk
        let parentCategory = "";
        for (const item in categories) {
          if (categories[item].includes(category)) {
            parentCategory = item;
          }
        }
        // Menambahkan nilai total ke kategori yang sesuai
        if (parentCategory) {
          if (!newSubCategorySpending[parentCategory]) {
            newSubCategorySpending[parentCategory] = {};
          }
          newSubCategorySpending[parentCategory][category] = totalAmount;
        }
      }

      for (const category in categories) {
        const totalAmount = Object.values(
          newSubCategorySpending[category]
        ).reduce((acc, curr) => acc + curr, 0);
        newCategorySpending[category] = totalAmount;
      }

      setCategorySpending(newCategorySpending);
      return newCategorySpending;
    },
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTransaction(selectedMonth);
      const totalSpendingCategory = sumCategory(
        data,
        [
          ...categories.eating,
          ...categories.living,
          ...categories.saving,
          ...categories.investing,
          ...categories.giving,
          ...categories.shodaqoh,
        ],
        "Spending"
      );
      setTotalSpending(getTotalObjectValue(totalSpendingCategory));
      setTotalBudget(getTotalObjectValue(budgetCategory));
    };
    fetchData();
  }, [selectedMonth, sumCategory]);

  return (
    <main className="mb-10">
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
        <div className="flex items-center justify-between ">
          <h5 className="text-center">
            <p className="text-base font-medium text-gray-900 truncate dark:text-white">
              Budget
            </p>
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              {formatCurrency(totalBudget, "brackets")}
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
              {formatCurrency(balance, "brackets")}
            </div>
          </h5>
          <h5 className="text-center">
            <p className="text-base font-medium text-gray-900 truncate dark:text-white">
              Spending
            </p>
            <div className="text-base font-semibold text-red-600 dark:text-white">
              {formatCurrency(totalSpending, "brackets")}
            </div>
          </h5>
        </div>
        <div className="flex items-center justify-center mt-4 mb-3">
          <p className={`text-sm text-gray-500 truncate me-2 ${colors.text}`}>
            {stringPercent}%
          </p>
          <div className="w-8/12 bg-gray-200 rounded-full">
            <div
              className={`text-xs h-2 font-medium text-center p-0.5 leading-none rounded-full ${colors.progress}`}
              style={{ width: `${percentage > 100 ? "100" : stringPercent}%` }}
            ></div>
          </div>
        </div>
        <div className="flow-root">
          <ul
            role="list"
          >
            {Object.keys(categories).map((category, key) => {
              const totalSpending = categorySpending[category];
              const totalBudget = budgetCategory[category];
              return (
                <div key={key}>
                  <Link
                    href={{
                      pathname: `/budgets/${category}`,
                      query: {},
                    }}
                  >
                    <Budget
                      category={category}
                      budget={totalBudget}
                      spending={totalSpending}
                    />
                  </Link>
                </div>
              );
            })}
          </ul>
        </div>
      </div>
    </main>
  );
}
