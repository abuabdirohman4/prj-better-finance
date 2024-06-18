"use client";
import { SESSIONKEY, months } from "@/utils/constants";
import { getData } from "@/utils/fetch";
import {
  fetchSheetSummary,
  fetchSheetTransaction,
} from "@/utils/fetchSheetData";
import { formatRupiah, getCashValuePocket } from "@/utils/helper";
import { getLocal, setLocal } from "@/utils/session";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const colors = [
  "bg-red-600",
  "bg-yellow-500",
  "bg-green-600",
  "bg-blue-600",
  // "bg-indigo-600",
  "bg-purple-600",
  "bg-pink-600",
  // "bg-gray-600",
  "bg-orange-600",
  "bg-teal-600",
  "bg-cyan-600",
  "bg-lime-600",
  "bg-emerald-600",
  "bg-fuchsia-600",
  "bg-rose-600",
  "bg-violet-600",
  "bg-amber-600",
  "bg-sky-600",
];

async function fetchAllTransactions() {
  const promises = months.map((month) => {
    return fetchSheetTransaction(month);
  });

  // Wait for all promises to resolve and combine the results
  const allData = await Promise.all(promises);
  // Flatten the array of arrays and sort & reverse the combined data
  const combinedData = allData.flat().sort().reverse();
  return combinedData;
}

export default function PocketsPage() {
  const clientId = "1717515";
  const [summary, setSummary] = useState([]);

  const getTotalAmountCategory = useCallback(
    (pockets, transactions, summary) => {
      const summaryPockets = [];
      pockets.forEach((pocket) => {
        // get spending of category pocket
        const transactionsInCategory = transactions.filter(
          (item) =>
            (item.Account === pocket.name ||
              item["Category or Account"] === pocket.name) &&
            !item.Transaction.includes("2")
        );
        let amount = transactionsInCategory.reduce(
          (acc, item) => acc + getCashValuePocket(item, pocket.name),
          0
        );

        let totalAmount = 0;
        // let totalAmount2023 = 0;
        for (const [name, value] of Object.entries(summary)) {
          if (pocket.name == name) {
            // totalAmount2023 = parseFloat(value);
            totalAmount = parseFloat(amount) + parseFloat(value); // amount2024 + amount 2023
          }
        }

        // mapping data budget & spending of category pocket
        summaryPockets.push({
          id: pocket.id,
          name: pocket.name,
          // totalAmount2023: totalAmount2023,
          // totalAmount2024: amount,
          actual: pocket.actual,
          amount: totalAmount,
        });
      });
      console.log("summaryPockets", summaryPockets);
      setSummary(summaryPockets);
    },
    []
  );

  useEffect(() => {
    async function fetchData() {
      console.log("fetchData");
      let pockets = getLocal(SESSIONKEY.pockets);
      if (!pockets) {
        console.log("storage pockets", pockets);
        pockets = await getData({
          url: "/api/pockets",
          params: {
            clientId: clientId,
            reqFunc: "GetPocket",
          },
        });
        if (pockets.status === 200) setLocal(SESSIONKEY.pockets, pockets);
      }

      if (pockets.status === 200) {
        let resSummary = getLocal(SESSIONKEY.summary);
        if (!resSummary) {
          resSummary = await fetchSheetSummary();
          setLocal(SESSIONKEY.summary, resSummary);
        }

        if (resSummary) {
          let transactionsInYear = getLocal(SESSIONKEY.transactionsInYear);
          if (!transactionsInYear) {
            fetchAllTransactions().then((data) => {
              setLocal(SESSIONKEY.transactionsInYear, data);
              getTotalAmountCategory(pockets.data, data, resSummary[0]);
            });
          } else {
            getTotalAmountCategory(
              pockets.data,
              transactionsInYear,
              resSummary[0]
            );
          }
        }
      }
    }

    fetchData();
  }, [getTotalAmountCategory]);

  return (
    <div className="w-full p-8 min-h-[94vh] bg-white border border-gray-200 rounded-lg shadow">
      <div className="flex items-center justify-between mb-8">
        <h5 className="text-xl font-bold leading-none text-gray-900">
          Pockets
        </h5>
      </div>
      <div className="grid grid-cols-3 gap-6 mb-1 text-center">
        {summary.map((pocket, index) => (
          <Link
            key={index}
            href={{
              pathname: `/pockets/${pocket.name}`,
              query: {
                pocketId: pocket.id,
                pocketAmount: pocket.amount,
                color: colors[index % colors.length],
              },
            }}
            className="block max-w-sm bg-white border border-gray-200 rounded-sm shadow cursor-pointer hover:bg-gray-100"
          >
            <h5 className="my-8 font-bold tracking-tight text-gray-900">
              {pocket.name}
            </h5>
            <div className={`${colors[index % colors.length]} p-1.5`}>
              <p className="font-bold text-sm text-white">
                {formatRupiah(pocket.amount)}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-8 text-center underline">
        <Link href="/pockets/create" className="text-black hover:text-blue-500">
          Add Pocket
        </Link>
      </div>
    </div>
  );
}
