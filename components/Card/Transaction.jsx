import { formatRupiah } from "@/utils/helper";

export default function CardTransaction({
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
        <p className="text-base font-medium text-gray-900 truncate">{note}</p>
        <p className="text-sm text-gray-500 truncate">
          {category === "-"
            ? account
            : type.includes("Transfer")
            ? `${account} ke ${category}`
            : `${account} (${category})`}
        </p>
      </div>
      <div
        className={`inline-flex items-center text-base font-semibold text-gray-900 ${
          cash > 0 && "text-green-600"
        }`}
      >
        {cash > 0 ? `+${formatRupiah(cash)}` : formatRupiah(cash)}
      </div>
    </div>
  );
}
