"use client";
import { fetchTransaction } from "./data";
import { months } from "@/utils/constants";
import { useEffect, useState } from "react";
import Transaction from "@/components/Card/Transaction";
import {
  formatDate,
  formatRupiah,
  getCashValue,
  getTotalCashGroupedByDate,
} from "@/utils/helper";
import { getDefaultSheetName } from "@/utils/google";
import Image from "next/image";

export default function Transactions() {
  const [transaction, setTransaction] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    getDefaultSheetName(months)
  );

  const spending = getTotalCashGroupedByDate(transaction, "Spending");
  const earning = getTotalCashGroupedByDate(transaction, "Earning");

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTransaction(selectedMonth);
      setTransaction(data);
    };
    fetchData();
  }, [selectedMonth]);

  return (
    <main className="mb-8">
      <div className="p-4 bg-[#F1F3F4] rounded-t-lg border-gray-200 shadow sm:p-8">
        <div className="flex justify-center">
          <Image
            src="/img/money-bag.svg"
            width={100}
            height={100}
            alt="Picture of the author"
          />
        </div>
        <div className="flex items-center justify-between ">
          <h5 className="text-center">
            <p className="text-base font-medium text-gray-900 truncate dark:text-white">
              Earning
            </p>
            <div className="text-base font-semibold text-green-600 dark:text-white">
              +{formatRupiah(earning)}
            </div>
          </h5>
          <h5 className="text-center">
            <p className="text-base font-medium text-gray-900 truncate dark:text-white">
              Spending
            </p>
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              {formatRupiah(spending)}
            </div>
          </h5>
        </div>
      </div>
      <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg rounded-t-none shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
            Transactions
          </h5>
          <select
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="flow-root">
          <ul role="list">
            {Object.keys(transaction).map((date) => (
              <li key={date} className="py-2 sm:py-3">
                <p className="text-sm text-gray-500 mb-2 truncate dark:text-gray-400">
                  {formatDate(date)}
                </p>
                {transaction[date].map(
                  (data, key) =>
                    data.Note !== "Moving Period" && (
                      <div key={key}>
                        <Transaction
                          date={data.Date}
                          type={data.Transaction}
                          account={data.Account}
                          category={data["Category or Account"]}
                          note={data.Note}
                          cash={getCashValue(data)}
                        />
                      </div>
                    )
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
