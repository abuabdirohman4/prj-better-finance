"use client";
import Budget from "@/components/Card/Budget";
import { months } from "@/utils/constants";
import { fetchTransaction, getCashValue } from "@/utils/fetchTransaction";
import { getDefaultSheetName } from "@/utils/helper";
import { useCallback, useEffect, useState } from "react";

// const Earning = [
//   "Salary",
//   "Business",
//   "Investment",
//   "Other Earn",
//   "Emergency",
//   "Saving",
//   "Retained",
//   "Interest",
//   "A Payable",
//   "A Receivable",
// ];
// const Living = [
//   "Charge",
//   "Children",
//   "Credit",
//   "Food",
//   "Groceries",
//   "Grab Credit",
//   "Health",
//   "Transport",
//   "Other Spend",
// ];
// const Saving = ["AP", "AR", "Emergency", "Investment", "Retained", "Wishlist"];
// const Investing = ["Business", "Knowledge", "Tools", "Subscribe"];
// const Giving = [
//   "Infaq Rezeki",
//   "Tax Salary",
//   "Shodaqoh",
//   // "Orang Tua",
//   // "Saudara",
//   // "Lain-lain",
// ];

const categories = {
  Living: [
    "Charge",
    "Children",
    "Credit",
    "Food",
    "Groceries",
    "Grab Credit",
    "Health",
    "Transport",
    "Other Spend",
  ],
  Saving: ["AP", "AR", "Emergency", "Investment", "Retained", "Wishlist"],
  Investing: ["Business", "Knowledge", "Tools", "Subscribe"],
  Giving: [
    "Infaq Rezeki",
    "Tax Salary",
    "Shodaqoh",
    // "Orang Tua",
    // "Saudara",
    // "Lain-lain",
  ],
};

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
  const [transaction, setTransaction] = useState([]);
  const [categoryTotal, setCategoryTotal] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    getDefaultSheetName(months)
  );

  const sumSubcategories = (category) => {
    let sum = 0;

    console.log("category", category);
    // console.log("categories[category]", categories[category]);
    // console.log("categoryTotal", categoryTotal);
    // console.log("categoryTotal[category]", categoryTotal[category]);
    // console.log(
    //   "categoryTotal[category][subcategory]",
    //   categoryTotal[category]['Food']
    // );
    // categories[category].forEach((subcategory) => {
    //   sum += categoryTotal[category][subcategory] || 0;
    // });
    // for (const subCategory in category) {
    //   sum += category[subCategory];
    // }
    return sum;
  };

  const calculateCategoryTotal = (categoryData, categoryList) => {
    let total = 0;
    for (const key of categoryList) {
      console.log("key", key);
      console.log("categoryData", categoryData);
      if (key in categoryData) {
        total += categoryData[key];
      }
    }
    return total;
  };

  // const sumCategory = useCallback((transaction, categories) => {
  const sumCategory = useCallback((transaction, categoryList) => {
    console.log("categoryList", categoryList);
    const newCategoryTotal = {};
    for (const category of categoryList) {
      // categories.forEach((category) => {
      const transactionsInCategory = transaction.filter(
        (item) => item["Category or Account"] === category
      );
      const totalAmount = transactionsInCategory.reduce(
        (acc, item) => acc + getCashValue(item),
        0
      );

      // Menentukan kategori induk
      let parentCategory;
      if (categories.Living.includes(category)) {
        parentCategory = "Living";
      } else if (categories.Saving.includes(category)) {
        parentCategory = "Saving";
      } else if (categories.Investing.includes(category)) {
        parentCategory = "Investing";
      } else if (categories.Giving.includes(category)) {
        parentCategory = "Giving";
      }

      // Menambahkan nilai total ke kategori yang sesuai
      if (parentCategory) {
        if (!newCategoryTotal[parentCategory]) {
          newCategoryTotal[parentCategory] = {};
        }
        newCategoryTotal[parentCategory][category] = totalAmount;
      }

      console.log("newCategoryTotal", newCategoryTotal);
      // const totalLiving = calculateCategoryTotal(newCategoryTotal.Living,categories.Living);
      // console.log("categories.Investing", categories.Investing);
      // const totalInvesting = calculateCategoryTotal(newCategoryTotal.Investing,categories.Investing);
      // console.log('totalLiving', totalLiving);
      // console.log('totalInvesting', totalInvesting);
      // const subcategoryTotal = sumSubcategories(newCategoryTotal);
      // console.log("subcategoryTotal", subcategoryTotal);
      // newCategoryObject[category] = {
      //   ...categoryObject[category],
      //   Total: subcategoryTotal,
      // };
      //  else {
      //   newCategoryTotal[category] = totalAmount;
      // }

      // newCategoryTotal[category] = totalAmount;
      // });
    }
    // const total = Object.entries(newCategoryTotal).reduce(
    //   (acc, curr) => acc + curr,
    //   0
    // );
    // console.log("total", total);

    setCategoryTotal(newCategoryTotal);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTransaction(selectedMonth);
      setTransaction(data);
      // sumCategory(data);
      sumCategory(data, [
        // ...Earning,
        ...categories.Living,
        // ...categories.Saving,
        ...categories.Investing,
        // ...categories.Giving,
      ]);
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
            {/* {Object.entries(categoryTotal).map(([category, actual], key) => (
              <div key={key}>
                <Budget
                  category={category}
                  budget={alokasiLiving[category]}
                  actual={actual}
                />
              </div>
            ))} */}
            {Object.keys(categories).map((category, key) => {
              // console.log("categoryTotal", categoryTotal[category]);
              // const total = 0;
              // const total = Object.values(categoryTotal[category]).reduce(
              //   (acc, curr) => acc + curr,
              //   0
              // );
              // const sum = await sumSubcategories(category);
              // console.log("sum", sumSubcategories(category));
              return (
                <div key={key}>
                  <Budget category={category} budget={10000} actual={0} />
                </div>
              );
            })}
          </ul>
        </div>
      </div>
    </main>
  );
}
