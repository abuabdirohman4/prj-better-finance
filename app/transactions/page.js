"use client";
import Card from "@/components/Card";
import { fetchTransaction } from "@/utils/fetchTransaction";
import formatRupiah from "@/utils/formatRupiah";
import { useEffect, useState } from "react";

// export default async function Transactions() {
export default function Transactions() {
  const [transaction, setTransaction] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("May");

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTransaction(selectedSheet);
      console.log("data", data);
      setTransaction(data);
    };
    fetchData();
  }, [selectedSheet]);

  const getCashValue = (data) => {
    const ATM = ["Mandiri", "BCA"];
    const Platform = [
      "Ponch",
      "Dana",
      "Flip",
      "Gopay",
      "Grab",
      "Jenius",
      "MyTelkomsel",
      "Ovo",
    ];
    if (data.Account === "Wallet") {
      return data.Wallet;
    } else if (ATM.includes(data.Account)) {
      return data.ATM;
    } else if (Platform.includes(data.Account)) {
      return data.Platform;
    } else if (data.Account === "BNI") {
      return data.INVESTMENT;
    } else if (data.Account === "AR") {
      return data.AR;
    } else if (data.Account === "AP") {
      return data.AP;
    } else {
      return data.NET;
    }
  };

  const getTotalCash = (transactions, type) => {
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
  };

  const spending = getTotalCash(transaction, "Spending");
  const earning = getTotalCash(transaction, "Earning");
  return (
    <main className="">
      <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <select
          value={selectedSheet}
          onChange={(e) => setSelectedSheet(e.target.value)}
        >
          <option value="Jan">Jan</option>
          <option value="Feb">Feb</option>
          <option value="Mar">Mar</option>
          <option value="Apr">Apr</option>
          <option value="May">May</option>
          <option value="Jun">Jun</option>
          <option value="Jul">Jul</option>
          <option value="Aug">Aug</option>
          <option value="Sep">Sep</option>
          <option value="Oct">Oct</option>
          <option value="Nov">Nov</option>
          <option value="Dec">Dec</option>
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
        {transaction.map(
          (data, key) =>
            data.Note !== "Moving Period" && (
              <div key={key}>
                <Card
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
      </div>
    </main>
  );
}
