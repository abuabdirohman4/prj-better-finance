"use client";
import SwipeTabs from "@/components/SwipeTabs/page";
import { months } from "@/utils/constants";
import { getDefaultSheetName } from "@/utils/helper";
import { useState } from "react";
import SpendingTabs from "./spending";

export default function Budgets() {
  const currentMonth = getDefaultSheetName(months);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const year = new Date().getFullYear().toString();

  return (
    <main>
      <div className="w-full max-w-md p-8 pb-0 bg-white border border-gray-200 rounded-lg shadow">
        <div className="flex items-center justify-between mb-8">
          <h5 className="text-xl font-bold leading-none text-gray-900">
            Budgets
          </h5>
          <div>
            <div className="flex">
              <select
                className="appearance-none bg-gray-50 border border-gray-300 border-r-4 border-transparent outline outline-gray-300 text-gray-900 text-sm rounded-s-lg border-s-gray-100 border-s-2 focus:ring-gray-100 block w-12 text-center cursor-pointer hover:bg-gray-200 hover:border-s-gray-200"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                }}
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                className="appearance-none bg-gray-50 border border-gray-300 border-r-4 border-transparent outline outline-gray-300 text-gray-900 text-sm rounded-e-lg border-s-gray-100 border-s-2 focus:ring-gray-100 block w-12 text-center cursor-pointer hover:bg-gray-200 hover:border-s-gray-200"
                onChange={() => false}
              >
                <option key={year} value={year}>
                  {year}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <SwipeTabs
        tabs={[
          { title: "Earning", content: "" },
          {
            title: "Spending",
            content: <SpendingTabs selectedMonth={selectedMonth} />,
          },
        ]}
        defaultTabs={1}
      />
    </main>
  );
}
