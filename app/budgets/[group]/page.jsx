import { GetTotalAmountCategoryBudgets } from "@/app/api/budgets/categories/route";
import Budget from "@/components/Card/Budget";
import { months } from "@/utils/constants";
import { fetchTransaction } from "@/utils/fetchTransaction";
import {
  formatRupiah,
  getCashValue,
  getDefaultSheetName,
  getMonthInNumber,
  toCapitalCase,
} from "@/utils/helper";
import Link from "next/link";

export default async function Budgets({ params, searchParams }) {
  const clientId = "1717515";
  const type = "spending";
  const group = toCapitalCase(params.group);
  const groupId = searchParams.groupId;
  const monthInNumber = getMonthInNumber(searchParams.month);
  const year = getMonthInNumber(searchParams.year);
  const transaction = await fetchTransaction(getDefaultSheetName(months));
  const categoryBudget = await GetTotalAmountCategoryBudgets(
    clientId,
    group,
    type
  );

  const categories = [];
  categoryBudget.forEach((category) => {
    // get spending of category
    const transactionsInCategory = transaction.filter(
      (item) =>
        item["Category or Account"] === category.name &&
        item.Transaction === "Spending"
    );
    const totalAmount = transactionsInCategory.reduce(
      (acc, item) => acc + getCashValue(item),
      0
    );

    // mapping data budget & spending of category
    categories.push({
      name: category.name,
      budget: category.totalAmount,
      spending: totalAmount,
    });
  });
  console.log("categories", categories);

  // get total budget & spending
  const totalAmount = categories.reduce(
    (acc, category) => {
      acc.totalBudget += category.budget;
      acc.totalSpending += category.spending;
      return acc;
    },
    { totalBudget: 0, totalSpending: 0 }
  );

  // final data
  const totalBudget = totalAmount.totalBudget;
  const totalSpending = totalAmount.totalSpending;
  const percentage =
    (parseFloat(totalSpending) / -parseFloat(totalBudget)) * 100;
  const stringPercent = percentage.toFixed(0);
  const balance = parseFloat(totalSpending) + parseFloat(totalBudget);

  return (
    <main>
      <div className="w-full max-w-md min-h-screen p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <Link href={"/budgets"} className="underline">
          Back
        </Link>
        <div className="flex items-center justify-center mt-2 mb-3">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
            {toCapitalCase(group)}
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
            {categories.map((category, key) => (
              <div key={key}>
                <Budget
                  category={category.name}
                  budget={category.budget}
                  spending={category.spending}
                />
              </div>
            ))}
          </ul>
          <div className="mt-3 text-center underline">
            <Link
              // href={`/budgets/create/${group}`}
              href={`/budgets/${group}/create-category`}
              className="hover:text-blue-500"
            >
              Add Category For {toCapitalCase(group)}
            </Link>
          </div>
          <div className="mt-3 text-center underline">
            <Link
              href={{
                pathname: `/budgets/${group}/add-budget`,
                query: {
                  groupId: groupId,
                  monthInNumber: monthInNumber,
                  year: year,
                },
              }}
              className="hover:text-blue-500"
            >
              Update Budget of Categories {toCapitalCase(group)}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
