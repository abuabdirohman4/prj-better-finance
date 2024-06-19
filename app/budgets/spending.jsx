"use client";
import CardBudget from "@/components/Card/Budget";
import SkeletonList from "@/components/Skeleton/List";
import { months } from "@/utils/constants";
import { fetchCategoryGroups, fetchTransactions } from "@/utils/fetch";
import {
  formatRupiah,
  getDefaultSheetName,
  getTotalObjectValue,
} from "@/utils/helper";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function SpendingTabs({ selectedMonth }) {
  const year = new Date().getFullYear().toString();
  const currentMonth = getDefaultSheetName(months);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
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
        if (!group.groupId) {
          const transactionsInCategory = transaction.filter(
            (item) =>
              item.categoryId === group.categoryId &&
              item.type === typeTransaction
          );
          const totalCategorySpending = transactionsInCategory.reduce(
            (acc, item) => acc + item.amount,
            0
          );
          newCategorySpending[group.name] = totalCategorySpending;
        } else {
          const { name: parentCategory } = group;
          const categories = nameCategoryGroups.filter(
            (category) => category.groupName === parentCategory
          );

          let totalGroupAmount = 0;
          for (const category of categories) {
            const transactionsInCategory = transaction.filter(
              (item) =>
                item.category.name === category.name &&
                item.type === typeTransaction
            );
            const totalGroupSpending = transactionsInCategory.reduce(
              (acc, item) => acc + item.amount,
              0
            );

            // Menambahkan nilai total ke kategori yang sesuai
            if (!newSubCategorySpending[parentCategory]) {
              newSubCategorySpending[parentCategory] = {};
            }
            newSubCategorySpending[parentCategory][category.name] =
              totalGroupSpending;

            // Tambahkan totalGroupSpending dari kategori ke total grup
            totalGroupAmount += totalGroupSpending;
          }
          newCategorySpending[parentCategory] = totalGroupAmount;
        }
      }
      return newCategorySpending;
    },
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingContent(true);

        const categoryGroup = await fetchCategoryGroups(false);
        if (categoryGroup.status === 200) {
          const categoryGroupBudget = categoryGroup.data;
          const amountCategoryGroups = {};
          const nameCategoryGroups = [];

          // Get data & total category group budget
          categoryGroupBudget.forEach((group) => {
            amountCategoryGroups[group.name] = group.budget;
            group.categories.forEach((category) => {
              nameCategoryGroups.push({
                ...category,
                groupName: group.name,
              });
            });
          });
          setTotalBudget(getTotalObjectValue(amountCategoryGroups));

          // Get data & total category group spending
          const transactions = await fetchTransactions(false, {});
          const categoryGroupSpending = sumCategoryGroupSpending(
            transactions,
            categoryGroupBudget,
            nameCategoryGroups,
            "spending"
          );
          setTotalSpending(getTotalObjectValue(categoryGroupSpending));

          // Combine data
          const mergedData = categoryGroupBudget.map((group) => {
            const categories = [];
            group.categories.map((category) => {
              const transactionsInCategory = transactions.filter(
                (item) =>
                  item.categoryId === category.id && item.type === "spending"
              );
              const totalSpending = transactionsInCategory.reduce(
                (acc, item) => acc + item.amount,
                0
              );
              categories.push({
                id: category.id,
                name: category.name,
                budget: category.budget,
                spending: totalSpending,
              });
            });
            return {
              groupId: group.groupId,
              name: group.name,
              budget: group.budget,
              spending: categoryGroupSpending[group.name] || 0,
              categories: categories,
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
  }, [selectedMonth, currentMonth, sumCategoryGroupSpending]);

  return (
    <>
      {isLoadingContent ? (
        <SkeletonList listNumber={12} />
      ) : (
        <>
          <div className="flex items-center justify-between ">
            <h5 className="text-center">
              <p className="text-base font-medium text-gray-900 truncate">
                Budget
              </p>
              <div className="text-base font-semibold text-gray-900">
                {formatRupiah(totalBudget)}
              </div>
            </h5>
            <h5 className="text-center">
              <p className="text-base font-medium text-gray-900 truncate">
                Balance
              </p>
              <div
                className={`text-base font-semibold text-gray-900 ${
                  balance < 0 && "text-red-500"
                }`}
              >
                {formatRupiah(balance)}
              </div>
            </h5>
            <h5 className="text-center">
              <p className="text-base font-medium text-gray-900 truncate">
                Spending
              </p>
              <div className="text-base font-semibold text-red-600">
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
            <ul role="list">
              {categoryGroup.map((group, key) => (
                <div key={key}>
                  <Link
                    // href={{
                    //   pathname: `/budgets/${category.name.toLowerCase()}`,
                    //   query: {
                    //     month: selectedMonth,
                    //     year: year,
                    //     groupId: category.groupId,
                    //   },
                    // }}
                    href=""
                  >
                    <CardBudget
                      name={group.name}
                      budget={group.budget}
                      spending={group.spending}
                      subCategory={group.categories}
                    />
                  </Link>
                </div>
              ))}
            </ul>
            {/* <div className="mt-3 text-center underline">
              <Link
                href="/budgets/create-group"
                className="text-black hover:text-blue-500"
              >
                Add Category Groups
              </Link>
            </div> */}
          </div>
        </>
      )}
    </>
  );
}
