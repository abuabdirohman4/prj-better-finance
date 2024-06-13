"use client";
import { SESSIONKEY, months } from "@/utils/constants";
import { fetchTransaction } from "@/utils/fetchTransaction";
import { getDefaultSheetName } from "@/utils/helper";
import { setLocal, setSession } from "@/utils/session";
import Link from "next/link";
import { TbRefresh } from "react-icons/tb";
import { useState } from "react";
import { getData } from "@/utils/fetch";

export default function BottomNav() {
  const [isLoading, setIsLoading] = useState(false);
  const clientId = "1717515";
  const fetchData = async () => {
    setIsLoading(true);
    const transactions = await fetchTransaction(getDefaultSheetName(months));
    console.log("transactions", transactions);
    setLocal(SESSIONKEY.transactions, transactions);
    const categoryBudgetGroup = await getData({
      url: "/api/budgets/group",
      params: { clientId },
    });
    console.log("categoryBudgetGroup", categoryBudgetGroup);
    setLocal(SESSIONKEY.categoryBudgetGroup, categoryBudgetGroup);

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
            className={`inline-flex items-center justify-center w-10 h-10 font-medium bg-blue-500 rounded-full hover:bg-blue-800 group focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800`}
            onClick={fetchData}
          >
            {isLoading ? (
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
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
