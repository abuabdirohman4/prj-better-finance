"use client";
import CardTransaction from "@/components/Card/Transaction";
import SkeletonList from "@/components/Skeleton/List";
import SkeletonText from "@/components/Skeleton/Text";
import TransactionsAction from "@/components/TransactionsAction/page";
import { months } from "@/utils/constants";
import { fetchIcons, fetchTransactions } from "@/utils/fetch";
import {
  formatDateWithTodayYesterdayCheck,
  formatRupiah,
  getTotalCashGroupedByDate,
} from "@/utils/helper";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Transactions() {
  const [isLoadingPage, setisLoadingPage] = useState(true);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [transaction, setTransaction] = useState([]);
  const currentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [icons, setIcons] = useState([]);

  const spending = getTotalCashGroupedByDate(transaction, "spending");
  const earning = getTotalCashGroupedByDate(transaction, "earning");

  const groupTransactionsByDate = (transactions) => {
    // Mengelompokkan data berdasarkan tanggal
    const grouped = transactions.reverse().reduce((groups, transaction) => {
      const date = new Date(transaction.date)
        .toLocaleString("en-GB", {
          timeZone: "Asia/Jakarta",
        })
        .split(",")[0];

      if (date) {
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(transaction);
      } else {
        console.log(`invalid date for:`);
        console.log(transaction);
      }
      return groups;
    }, {});

    // Mengurutkan tanggal dari yang paling baru ke yang paling lama
    const sortedDates = Object.keys(grouped).sort((a, b) => {
      const [dayA, monthA, yearA] = a.split("/").map(Number);
      const [dayB, monthB, yearB] = b.split("/").map(Number);

      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);

      return dateB - dateA;
    });

    // Membuat objek baru berdasarkan tanggal yang sudah diurutkan
    const sortedGrouped = {};
    sortedDates.forEach((date) => {
      sortedGrouped[date] = grouped[date];
    });

    return sortedGrouped;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingContent(true);
      const transactions = await fetchTransactions(false, {
        date: { month: selectedMonth },
      });
      const group = groupTransactionsByDate(transactions);
      setTransaction(group);
      console.log("group", group);

      const icons = await fetchIcons(false);
      setIcons(icons.data)

      setisLoadingPage(false);
      setIsLoadingContent(false);
    };
    fetchData();
  }, [currentMonth, selectedMonth]);

  return (
    <div>
      {isLoadingPage ? (
        <SkeletonList listNumber={15} />
      ) : (
        <>
          <div className="p-8 pb-4 bg-[#F1F3F4] rounded-t-lg border-gray-200 shadow">
            <div className="flex justify-center">
              <Image
                src="/img/money-bag.svg"
                width={100}
                height={100}
                alt="Picture of the author"
                priority={true}
              />
            </div>
            <div className="mt-6">
              <TransactionsAction />
            </div>
            <div className="flex items-center justify-between ">
              {isLoadingContent ? (
                <div className="w-1/3">
                  <SkeletonText row={2} />
                </div>
              ) : (
                <h5 className="text-center">
                  <p className="text-base font-medium text-gray-900 truncate">
                    Earning
                  </p>
                  <div className="text-base font-semibold text-green-600">
                    +{formatRupiah(earning)}
                  </div>
                </h5>
              )}
              {isLoadingContent ? (
                <div className="w-1/3">
                  <SkeletonText row={2} />
                </div>
              ) : (
                <h5 className="text-center">
                  <p className="text-base font-medium text-gray-900 truncate">
                    Spending
                  </p>
                  <div className="text-base font-semibold text-gray-900">
                    {formatRupiah(spending)}
                  </div>
                </h5>
              )}
            </div>
          </div>
          <div className="w-full min-h-[72vh] max-w-md p-8 bg-white border border-b-0 border-gray-200 rounded-lg rounded-t-none">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-xl font-bold leading-none text-gray-900">
                Transactions
              </h5>
              <select
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                {months.map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            {isLoadingContent ? (
              <SkeletonList listNumber={9} />
            ) : (
              <div className="flow-root">
                <ul role="list">
                  {Object.keys(transaction).map((date) => (
                    <li key={date} className="py-2 sm:py-3">
                      <p className="text-sm text-gray-500 mb-2 truncate">
                        {formatDateWithTodayYesterdayCheck(date)}
                      </p>
                      {transaction[date].map((data, key) => (
                        <div key={key}>
                          <CardTransaction
                            date={data.date}
                            type={data.type}
                            icons={icons}
                            account={data.pockets.name}
                            category={data.category && data.category.name}
                            note={data.desc}
                            cash={data.amount}
                          />
                        </div>
                      ))}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
