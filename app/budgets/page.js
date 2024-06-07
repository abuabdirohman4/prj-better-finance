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

export default function Budgets() {
  const [categoryTotal, setCategoryTotal] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    getDefaultSheetName(months)
  );

  const sumCategory = useCallback(
    (transaction, categoryList, typeTransaction) => {
      const newSubCategoryTotal = {};
      const newCategoryTotal = {};
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
          if (!newSubCategoryTotal[parentCategory]) {
            newSubCategoryTotal[parentCategory] = {};
          }
          newSubCategoryTotal[parentCategory][category] = totalAmount;
        }
      }

      for (const category in categories) {
        const totalAmount = Object.values(newSubCategoryTotal[category]).reduce(
          (acc, curr) => acc + curr,
          0
        );
        newCategoryTotal[category] = totalAmount;
      }

      setCategoryTotal(newCategoryTotal);
    },
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTransaction(selectedMonth);
      sumCategory(
        data,
        [
          ...categories.living,
          ...categories.saving,
          ...categories.investing,
          ...categories.giving,
        ],
        "Spending"
      );
    };
    fetchData();
  }, [selectedMonth, sumCategory]);

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
            {Object.keys(categories).map((category, key) => {
              return (
                <div key={key}>
                  <Budget
                    category={category}
                    budget={10000}
                    actual={categoryTotal[category]}
                  />
                </div>
              );
            })}
          </ul>
        </div>
      </div>
    </main>
  );
}
