import { formatRupiah, toCapitalCase } from "@/utils/helper";
import Link from "next/link";

export default function Budget({ category, budget, actual }) {
  const percentage = (parseFloat(actual) / -parseFloat(budget)) * 100;
  const stringPercent = percentage.toFixed(0);
  return (
    <Link href={`/budgets/${category}`}>
      <li className="py-3 sm:py-4">
        <div className="flex-1 min-w-0 mb-2">
          <p className="text-sm font-medium text-gray-900 truncate">
            {toCapitalCase(category)}
          </p>
        </div>
        <div className="flex items-center">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 truncate">Alokasi</p>
          </div>
          <div className="inline-flex items-center text-base font-semibold text-gray-900">
            {formatRupiah(budget)}
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 truncate">Pemakaian</p>
          </div>
          <div className="inline-flex items-center text-base font-semibold text-red-500">
            {formatRupiah(actual)}
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 truncate">Penyerapan</p>
          </div>
          <p className="text-sm text-gray-500 truncate me-2">
            {stringPercent == "NaN" ? "0" : stringPercent}%
          </p>
          <div className="w-7/12 bg-gray-200 rounded-full">
            <div
              className={`bg-blue-600 text-xs h-2 font-medium text-center p-0.5 leading-none rounded-full`}
              style={{ width: `${percentage > 100 ? "100" : stringPercent}%` }}
            ></div>
          </div>
        </div>
      </li>
    </Link>
  );
}
