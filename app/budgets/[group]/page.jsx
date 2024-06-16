import { GetTotalAmountCategory } from "@/app/api/budgets/categories/route";
import CardBudget from "@/components/Card/Budget";
import { SESSIONKEY, months } from "@/utils/constants";
import { fetchTransaction } from "@/utils/fetchTransaction";
import {
  formatRupiah,
  getCashValue,
  getDefaultSheetName,
  getMonthInNumber,
  toCapitalCase,
} from "@/utils/helper";
import { getLocal, setLocal } from "@/utils/session";
import Link from "next/link";

export default async function Budgets({ params, searchParams }) {
  const clientId = "1717515";
  const type = "spending";
  const group = toCapitalCase(params.group);
  const groupId = searchParams.groupId;
  const currentMonth = getDefaultSheetName(months);
  const month = searchParams.month;
  const monthInNumber = getMonthInNumber(month);
  const year = searchParams.year;
  const categoryBudget = await GetTotalAmountCategory(
    clientId,
    group,
    type
  );
  let transactions = getLocal(SESSIONKEY.transactions);
  if (!transactions || currentMonth != month) {
    console.log("storage transactions", transactions);
    transactions = await fetchTransaction(month);
    setLocal(SESSIONKEY.transactions, transactions);
  }

  const categories = [];
  categoryBudget.forEach((category) => {
    // get spending of category
    const transactionsInCategory = transactions.filter(
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
    <div className="w-full max-w-md p-8 pb-10 min-h-[94vh] border border-gray-200 border-b-0 rounded-lg shadow">
      <Link href={"/budgets"} className="underline">
        Back
      </Link>
      <div className="flex items-center justify-center mt-2 mb-3">
        <h5 className="text-xl font-bold leading-none text-gray-900">
          {toCapitalCase(group)}
        </h5>
      </div>
      <div className="flex items-center justify-center mb-4">
        <p className="text-sm text-gray-500 truncate me-2">{stringPercent}%</p>
        <div className="w-8/12 bg-gray-200 rounded-full">
          <div
            className={`bg-blue-600 text-xs h-2 font-medium text-center p-0.5 leading-none rounded-full`}
            style={{ width: `${percentage > 100 ? "100" : stringPercent}%` }}
          ></div>
        </div>
      </div>
      <div className="flex items-center justify-between ">
        <h5 className="text-center">
          <p className="text-base font-medium text-gray-900 truncate">Budget</p>
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
      <div className="flow-root mt-5">
        <ul
          role="list"
          className="border-y-[1.5px] border-y-gray-200 divide-y divide-gray-200"
        >
          {categories.map((category, key) => (
            <div key={key}>
              <CardBudget
                category={category.name}
                budget={category.budget}
                spending={category.spending}
              />
            </div>
          ))}
        </ul>
        <div className="mt-3 text-center underline">
          <Link
            href={{
              pathname: `/budgets/${group}/create-category`,
              query: {
                groupId: groupId,
              },
            }}
            className="text-black hover:text-blue-500"
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
            className="text-black hover:text-blue-500"
          >
            Update Budget of Categories {toCapitalCase(group)}
          </Link>
        </div>
      </div>
    </div>
  );
}
