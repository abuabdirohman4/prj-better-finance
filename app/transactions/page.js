"use client";
import { fetchTransaction, groupTransactionsByDate } from "./data";
import { months } from "@/utils/constants";
import { useEffect, useState } from "react";
import Transaction from "@/components/Card/Transaction";
import {
  formatDate,
  formatCurrency,
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
  const balance = earning + spending;

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTransaction(selectedMonth);
      const groupedData = groupTransactionsByDate(data);
      setTransaction(groupedData);
    };
    fetchData();
  }, [selectedMonth]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-3 pt-8 pb-6">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        
        {/* Asymmetrical Wave Shape at Bottom */}
        <div className="absolute bottom-0 left-0 w-full h-8">
          <svg
            viewBox="0 0 400 32"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0,32 Q100,20 200,32 T400,20 L400,32 Z"
              fill="rgb(249 250 251)"
              className="transition-all duration-300"
            />
          </svg>
        </div>
        
        <div className="relative z-10">
          {/* Top Row - Page Title and Month Selector */}
          <div className="flex items-center justify-between mb-4">
            {/* Page Title */}
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Transactions</h1>
              <p className="text-blue-100 text-sm">Track your financial activities</p>
            </div>

            {/* Month Selector */}
            <div className="relative">
              <select
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="appearance-none bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 pr-10 cursor-pointer hover:bg-white/30 transition-all duration-200"
              >
                {months.map((month) => (
                  <option key={month} value={month} className="text-gray-800 bg-white">
                    {month}
                  </option>
                ))}
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="px-3 mt-6 mb-8">
        <div className="grid grid-cols-1 gap-4">
          {/* Balance Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Net Balance</h2>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {formatCurrency(balance, "signs")}
            </div>
            <p className="text-sm text-gray-600">
              {balance >= 0 ? 'Positive balance' : 'Negative balance'}
            </p>
          </div>

          {/* Income & Expense Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Income Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl border border-green-200 p-4">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-green-800">Income</span>
              </div>
              <div className="text-xl font-bold text-green-900">
                {formatCurrency(earning, "signs")}
              </div>
            </div>

            {/* Expense Card */}
            <div className="bg-gradient-to-br from-red-50 to-rose-100 rounded-2xl border border-red-200 p-4">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-red-800">Expenses</span>
              </div>
              <div className="text-xl font-bold text-red-900">
                {formatCurrency(spending, "signs")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="px-3 pb-24">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">Transaction History</h3>
            <p className="text-sm text-gray-600 mt-1">All your financial activities for {selectedMonth}</p>
          </div>
          
          <div className="p-6">
            {Object.keys(transaction).length > 0 ? (
              <div className="space-y-6">
                {Object.keys(transaction).map((date) => (
                  <div key={date} className="space-y-3">
                    {/* Date Header */}
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <h4 className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                        {formatDate(date)}
                      </h4>
                    </div>
                    
                    {/* Transactions for this date */}
                    <div className="space-y-3 ml-5">
                      {transaction[date].map(
                        (data, key) =>
                          data.Note !== "Moving Period" && (
                            <div key={key}>
                              <Transaction
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
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                <p className="text-gray-500 text-sm">There are no transactions for {selectedMonth} yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
