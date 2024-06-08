import Budget from "@/components/Card/Budget";
import { categories, months } from "@/utils/constants";
import { fetchTransaction } from "@/utils/fetchTransaction";
import { getCashValue, getDefaultSheetName } from "@/utils/helper";

export default async function Budgets({ params }) {
  const transaction = await fetchTransaction(getDefaultSheetName(months));

  const categoryTotal = {};
  categories[params.category].forEach((category) => {
    const transactionsInCategory = transaction.filter(
      (item) =>
        item["Category or Account"] === category &&
        item.Transaction === "Spending"
    );
    const totalAmount = transactionsInCategory.reduce(
      (acc, item) => acc + getCashValue(item),
      0
    );
    categoryTotal[category] = totalAmount;
  });

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
                  budget={"1000000"}
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
