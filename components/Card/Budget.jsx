import { formatRupiah } from "@/utils/helper";

export default function CardBudget({ category, budget, spending }) {
  const percentage = budget ? (parseFloat(spending) / -parseFloat(budget)) * 100 : 0;
  const stringPercent = percentage.toFixed(0);
  const balance = parseFloat(spending) + parseFloat(budget);
  return (
    <li className="py-3 sm:py-4">
      <div className="flex-1 min-w-0 mb-2">
        <p className="text-sm font-medium text-gray-900 truncate">
          {category}
        </p>
      </div>
      <div className="flex items-center">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 truncate">Budget</p>
        </div>
        <div className="inline-flex items-center text-base font-semibold text-gray-900">
          {formatRupiah(budget)}
        </div>
      </div>
      <div className="flex items-center">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 truncate">Spending</p>
        </div>
        <div className="inline-flex items-center text-base font-semibold text-red-500">
          {formatRupiah(spending)}
        </div>
      </div>
      <div className="flex items-center">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 truncate">Balance</p>
        </div>
        <div
          className={`inline-flex items-center text-base font-semibold ${
            balance < 0 && "text-red-500"
          }`}
        >
          {formatRupiah(balance)}
        </div>
      </div>
      <div className="flex items-center">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 truncate"></p>
        </div>
        <p className="text-sm text-gray-500 truncate me-2">
          {!stringPercent ? "0" : stringPercent}%
        </p>
        <div className="w-8/12 bg-gray-200 rounded-full">
          <div
            className={`bg-blue-600 text-xs h-2 font-medium text-center p-0.5 leading-none rounded-full`}
            style={{ width: `${percentage > 100 ? "100" : stringPercent}%` }}
          ></div>
        </div>
      </div>
    </li>
  );
}
