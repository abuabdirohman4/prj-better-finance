"use client";
import { SESSIONKEY, categories, months } from "@/utils/constants";
import { fetchSummary, fetchTransaction } from "@/utils/fetchTransaction";
import { getCashValue, getCashValuePocket } from "@/utils/helper";
import { getLocal, setLocal } from "@/utils/session";
import { useCallback, useEffect, useState } from "react";

const pockets = [
  { name: "Wallet" },
  { name: "Mandiri" },
  { name: "BCA" },
  { name: "Ponch" },
  { name: "Dana" },
  { name: "Flip" },
  { name: "GoPay" },
  { name: "Grab" },
  { name: "Jenius" },
  { name: "MyTelkomsel" },
  { name: "E-Toll" },
  { name: "Ovo" },
  { name: "AR" },
  { name: "AP" },
  // { name: "BNI" },
];

export default function PocketsPage() {
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
          name: pocket.name,
          // totalAmount2023: totalAmount2023,
          // totalAmount2024: amount,
          totalAmount: totalAmount,
        });
      });
      console.log("summaryPockets", summaryPockets);
      setSummary(summaryPockets);
    },
    []
  );

  useEffect(() => {
    async function fetchAllTransactions() {
      const promises = months.map((month) => {
        return fetchTransaction(month);
      });

      // Wait for all promises to resolve and combine the results
      const allData = await Promise.all(promises);
      // Flatten the array of arrays and sort & reverse the combined data
      const combinedData = allData.flat().sort().reverse();
      return combinedData;
    }

    async function fetchData() {
      console.log("fetchData");
      let resSummary = getLocal(SESSIONKEY.summary);
      if (!resSummary) {
        resSummary = await fetchSummary();
        setLocal(SESSIONKEY.summary, resSummary);
      }

      if (resSummary) {
        let transactionsInYear = getLocal(SESSIONKEY.transactionsInYear);
        if (!transactionsInYear) {
          fetchAllTransactions().then((data) => {
            setLocal(SESSIONKEY.transactionsInYear, data);
            getTotalAmountCategory(pockets, data, resSummary[0]);
          });
        } else {
          getTotalAmountCategory(pockets, transactionsInYear, resSummary[0]);
        }
      }
    }

    fetchData();
  }, [getTotalAmountCategory]);

  return (
    <div className="bg-white min-h-[94vh]">
      <ul>
        {summary.map((pocket, index) => (
          <li key={index} className="text-black">{pocket.name}: {pocket.totalAmount}</li>
        ))}
      </ul>
    </div>
  );
}
