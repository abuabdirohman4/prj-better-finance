import Budget from "@/components/Card/Budget";
import { categories, months } from "@/utils/constants";
import { fetchTransaction } from "@/utils/fetchTransaction";
import {
  formatRupiah,
  getCashValue,
  getDefaultSheetName,
  getTotalObjectValue,
  toCapitalCase,
} from "@/utils/helper";
import Link from "next/link";

const budgetCategory = {
  Living: {
    Charge: 100000,
    Children: 100000,
    Credit: 100000,
    Food: 100000,
    Groceries: 100000,
    "Grab Credit": 100000,
    Health: 100000,
    Transport: 100000,
    "Other Spend": 100000,
  },
  Saving: {
    AP: 100000,
    AR: 100000,
    Emergency: 100000,
    Investment: 100000,
    Retained: 100000,
    Wishlist: 10000,
  },
  Investing: {
    Business: 100000,
    Knowledge: 100000,
    Tools: 100000,
    Subscribe: 10000,
  },
  Giving: {
    "Infaq Rezeki": 100000,
    "Tax Salary": 100000,
    Shodaqoh: 100000,
  },
};

export default async function Budgets({ params }) {
  const transaction = await fetchTransaction(getDefaultSheetName(months));
  const category = toCapitalCase(params.category)
  const categorySpending = {};
  categories[category].forEach((category) => {
    const transactionsInCategory = transaction.filter(
      (item) =>
        item["Category or Account"] === category &&
        item.Transaction === "Spending"
    );
    const totalAmount = transactionsInCategory.reduce(
      (acc, item) => acc + getCashValue(item),
      0
    );
    categorySpending[category] = totalAmount;
  });
  const totalSpending = getTotalObjectValue(categorySpending);
  const totalBudget = Object.values(budgetCategory[category]).reduce(
    (total, value) => total + value,
    0
  );
  const percentage =
    (parseFloat(totalSpending) / -parseFloat(totalBudget)) * 100;
  const stringPercent = percentage.toFixed(0);
  const balance = parseFloat(totalSpending) + parseFloat(totalBudget);

  return (
    <main className={`${category == "living" ? "mb-8" : ""}`}>
      <div className="w-full max-w-md min-h-screen p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <Link href={"/budgets"} className="underline">
          Back
        </Link>
        <div className="flex items-center justify-center mt-2 mb-3">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
            {toCapitalCase(category)}
          </h5>
        </div>
        <div className="flex items-center justify-center mb-4">
          <p className="text-sm text-gray-500 truncate me-2">
            {stringPercent}%
          </p>
          <div className="w-8/12 bg-gray-200 rounded-full">
            <div
              className={`bg-blue-600 text-xs h-2 font-medium text-center p-0.5 leading-none rounded-full`}
              style={{ width: `${percentage > 100 ? "100" : stringPercent}%` }}
            ></div>
          </div>
        </div>
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
        <div className="flow-root mt-5">
          <ul
            role="list"
            className="border-y-[1.5px] border-y-gray-200 divide-y divide-gray-200 dark:divide-gray-700"
          >
            {Object.entries(categorySpending).map(
              ([category, spending], key) => (
                <div key={key}>
                  <Budget
                    category={category}
                    budget={"1000000"}
                    spending={spending}
                  />
                </div>
              )
            )}
          </ul>
        </div>
      </div>
    </main>
  );
}
