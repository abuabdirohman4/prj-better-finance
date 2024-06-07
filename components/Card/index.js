import formatRupiah from "@/utils/formatRupiah";

export default function Card({ date, type, account, category, note, cash }) {
  return (
    <div className="flow-root">
      <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
        <li className="py-3 sm:py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {type.includes("Earning")
                ? "E"
                : type.includes("Spending")
                ? "S"
                : "T"}
            </div>
            <div className="flex-1 min-w-0 ms-4">
              <p className="text-base font-medium text-gray-900 truncate dark:text-white">
                {note}
              </p>
              <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                {account} - {category}
              </p>
              <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                {date}
              </p>
            </div>
            <div
              className={`inline-flex items-center text-base font-semibold text-gray-900 dark:text-white ${
                cash < 0 && "text-red-500"
              }`}
            >
              {formatRupiah(cash)}
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}
