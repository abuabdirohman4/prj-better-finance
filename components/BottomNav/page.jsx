"use client";
import { SESSIONKEY, months } from "@/utils/constants";
import { fetchSheetTransaction } from "@/utils/fetchSheetData";
import { getDefaultSheetName } from "@/utils/helper";
import { setLocal } from "@/utils/session";
import Link from "next/link";
import { TbRefresh } from "react-icons/tb";
import { FaWallet } from "react-icons/fa";
import { GrTransaction, GrMoney } from "react-icons/gr";
import { BiMoneyWithdraw } from "react-icons/bi";
import { AiFillHome } from "react-icons/ai";
import { useState } from "react";
import { getData } from "@/utils/fetch";

export default function BottomNav() {
  const [isLoading, setIsLoading] = useState(false);
  const clientId = "1717515";
  const fetchData = async () => {
    setIsLoading(true);
    const transactions = await fetchSheetTransaction(
      getDefaultSheetName(months)
    );
    console.log("transactions", transactions);
    setLocal(SESSIONKEY.transactions, transactions);
    const categoryGroup = await getData({
      url: "/api/budgets/group",
      params: { clientId },
    });
    console.log("categoryGroup", categoryGroup);
    setLocal(SESSIONKEY.categoryGroup, categoryGroup);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };
  return (
    <div className="fixed bottom-0 mx-auto z-50 w-full max-w-md h-16 bg-[#F1F3F4] border-t border-gray-200">
      <div className="mt-0.5 flex h-full justify-evenly font-medium">
        <Menu name="Home" href="/home" />
        <Menu name="Trans" href="/transactions" />
        <Menu name="Pockets" href="/pockets" />
        {/* <Menu name="Income" href='/' /> */}
        <Menu name="Budgets" href="/budgets" />
        <div className="flex items-center justify-center mb-2">
          <button
            className={`inline-flex items-center justify-center w-10 h-10 font-medium bg-blue-500 rounded-full hover:bg-blue-800 group focus:ring-4 focus:ring-blue-300 focus:outline-none`}
            onClick={fetchData}
          >
            {isLoading ? (
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin fill-blue-600"
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
      </div>
    </div>
  );
}

function Menu({ name, href }) {
  return (
    <Link
      href={href}
      className="inline-flex flex-col items-center w-20 justify-center px-5 border-gray-200 border-x hover:bg-gray-50 group"
    >
      {name == "Home" && (
        <AiFillHome
          className="mb-2 text-gray-500 group-hover:text-blue-600"
          size={20}
        />
      )}
      {name == "Trans" && (
        <GrTransaction
          className="mb-2 text-gray-500 group-hover:text-blue-600"
          size={20}
        />
      )}
      {name == "Pockets" && (
        <FaWallet
          className="mb-2 text-gray-500 group-hover:text-blue-600"
          size={20}
        />
      )}
      {name == "Income" && (
        <BiMoneyWithdraw
          className="mb-2 text-gray-500 group-hover:text-blue-600"
          size={20}
        />
      )}
      {name == "Budgets" && (
        <GrMoney
          className="mb-2 text-gray-500 group-hover:text-blue-600"
          size={20}
        />
      )}
      <span className="text-sm text-gray-500 group-hover:text-blue-600">
        {name}
      </span>
    </Link>
  );
}
