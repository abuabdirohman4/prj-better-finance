import { formatCurrency } from "@/utils/helper";

export default function Transaction({
  date,
  type,
  account,
  category,
  note,
  cash,
}) {
  return (
    <div className="flex items-center py-2 sm:py-3">
      <div className="flex-shrink-0">
        {type.includes("Earning") ? "E" : type.includes("Spending") ? "S" : "T"}
      </div>
      <div className="flex-1 min-w-0 ms-4">
        <p className="text-base font-medium text-gray-900 truncate dark:text-white">
          {note}
        </p>
        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
          {category === "-"
            ? account
            : type.includes("Transfer")
            ? `${account} ke ${category}`
            : `${account} (${category})`}
        </p>
      </div>
      <div
        className={`inline-flex items-center text-base font-semibold text-gray-900 dark:text-white ${
          cash > 0 && "text-green-600"
        }`}
      >
        {cash > 0 ? `${formatCurrency(cash, "signs")}` : formatCurrency(cash, "signs")}
      </div>
    </div>
  );
}
