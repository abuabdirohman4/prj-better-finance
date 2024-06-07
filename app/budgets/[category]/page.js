"use client";
import Budget from "@/components/Card/Budget";
import { categories, months } from "@/utils/constants";
import { fetchTransaction, getCashValue } from "@/utils/fetchTransaction";
import { getDefaultSheetName } from "@/utils/helper";
import { useCallback, useEffect, useState } from "react";

const alokasiLiving = {
  Charge: 500000,
  Children: 500000,
  Credit: 500000,
  Food: 500000,
  Groceries: 500000,
  "Grab Credit": 500000,
  Health: 500000,
  Transport: 500000,
  "Other Spend": 500000,
};

export default function Budgets({ params }) {
  const [categoryTotal, setCategoryTotal] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    getDefaultSheetName(months)
  );

  const sumCategory = useCallback(
    (transaction, categories, typeTransaction) => {
      const newCategoryTotal = {};
      categories.forEach((category) => {
        const transactionsInCategory = transaction.filter(
          (item) =>
            item["Category or Account"] === category &&
            item.Transaction === typeTransaction
        );
        const totalAmount = transactionsInCategory.reduce(
          (acc, item) => acc + getCashValue(item),
          0
        );
        newCategoryTotal[category] = totalAmount;
      });

      setCategoryTotal(newCategoryTotal);
    },
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTransaction(selectedMonth);
      sumCategory(data, [...categories[params.category]], "Spending");
    };
    fetchData();
  }, [selectedMonth, sumCategory, params.category]);

  return (
    <main>
      <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
            Budgets
          </h5>
          <a
            href="#"
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
          >
            View all
          </a>
        </div>
        <div className="flow-root">
          <ul
            role="list"
            className="divide-y divide-gray-200 dark:divide-gray-700"
          >
            {Object.entries(categoryTotal).map(([category, actual], key) => (
              <div key={key}>
                <Budget
                  category={category}
                  budget={alokasiLiving[category]}
                  actual={actual}
                />
              </div>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
