"use client";
import { fetchTransaction, getCashValue } from "@/utils/fetchTransaction";
import { months } from "@/utils/constants";
import { useEffect, useState } from "react";
import Transaction from "@/components/Card/Transaction";
import { formatRupiah, getDefaultSheetName } from "@/utils/helper";

export default function Transactions() {
  const [transaction, setTransaction] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    getDefaultSheetName(months)
  );

  function getTotalCash(transactions, type) {
    // Inisialisasi total cash
    let total = 0;

    transactions.forEach((data) => {
      if (data.Transaction === type) {
        // Periksa apakah nilai cash dapat diubah menjadi angka
        const cashValue = parseFloat(getCashValue(data));
        if (!isNaN(cashValue)) {
          // Jika valid, tambahkan ke total
          total += cashValue;
        } else {
          // Jika tidak valid, log pesan kesalahan
          console.error(
            `Invalid cash value for transaction: ${JSON.stringify(data.Note)}`
          );
        }
      }
    });

    return total;
  }

  const spending = getTotalCash(transaction, "Spending");
  const earning = getTotalCash(transaction, "Earning");

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTransaction(selectedMonth);
      console.log("data", data);
      setTransaction(data);
    };
    fetchData();
  }, [selectedMonth]);

  return (
    <main className="">
      <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <select
          id="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
        <h5>Spending : {formatRupiah(spending)}</h5>
        <h5>Earning : {formatRupiah(earning)}</h5>
        <div className="flex items-center justify-between mb-4">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
            Latest Transaction
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
            {transaction.map(
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
          </ul>
        </div>
      </div>
    </main>
  );
}
