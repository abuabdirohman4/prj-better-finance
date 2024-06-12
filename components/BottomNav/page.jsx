"use client";
import { SESSIONKEY, months } from "@/utils/constants";
import { fetchTransaction } from "@/utils/fetchTransaction";
import { getDefaultSheetName } from "@/utils/helper";
import { setSession } from "@/utils/session";
import Link from "next/link";
import { TbRefresh } from "react-icons/tb";
import { FaCheck } from "react-icons/fa";
import { useState } from "react";

export default function BottomNav() {
  const [isLoading, setIsLoading] = useState(false);
  const fetchData = async () => {
    const transactions = await fetchTransaction(getDefaultSheetName(months));
    setSession(SESSIONKEY.transactions, transactions);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };
  return (
    <div className="sticky bottom-0 mx-auto z-50 w-full max-w-md h-16 bg-[#F1F3F4] border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
      <div className="mt-0.5 flex h-full justify-evenly font-medium">
        <Link
          href={"/transactions"}
          className="inline-flex flex-col items-center justify-center w-32 px-5 border-gray-200 border-x hover:bg-gray-50 dark:hover:bg-gray-800 group dark:border-gray-600"
        >
          <svg
            className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
          </svg>
          <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
            Transactions
          </span>
        </Link>
        <div className="flex items-center justify-center mb-2">
          <button
            className={`inline-flex items-center justify-center w-10 h-10 font-medium  rounded-full hover:bg-blue-800 group focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800 ${
              isLoading ? "bg-green-500" : "bg-blue-500"
            }`}
            onClick={fetchData}
          >
            {isLoading ? (
              <FaCheck color="white" size={25} />
            ) : (
              <TbRefresh color="white" size={35} />
            )}
          </button>
        </div>
        <Link
          href={"/budgets"}
          className="inline-flex flex-col items-center justify-center w-32 px-5 border-e border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 group dark:border-gray-600"
        >
          <svg
            className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M11.074 4 8.442.408A.95.95 0 0 0 7.014.254L2.926 4h8.148ZM9 13v-1a4 4 0 0 1 4-4h6V6a1 1 0 0 0-1-1H1a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h17a1 1 0 0 0 1-1v-2h-6a4 4 0 0 1-4-4Z" />
            <path d="M19 10h-6a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1Zm-4.5 3.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM12.62 4h2.78L12.539.41a1.086 1.086 0 1 0-1.7 1.352L12.62 4Z" />
          </svg>
          <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
            Budgets
          </span>
        </Link>
      </div>
    </div>
  );
}
