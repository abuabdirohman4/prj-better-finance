"use client";
import { useState } from "react";
import { months } from "@/utils/constants";
import { useTransactions } from "@/utils/hooks";
import Transaction from "@/components/Card/Transaction";
import {
  formatDate,
  formatCurrency,
  getCashValue,
  getTotalCashGroupedByDate,
} from "@/utils/helper";
import { getDefaultSheetName } from "@/utils/google";
import { groupTransactionsByDate } from "./data";

export default function Transactions() {
  const [selectedMonth, setSelectedMonth] = useState(
    getDefaultSheetName(months)
  );

  // Use SWR hook for data fetching (consistent with budgets page)
  const { data: transactionData, isLoading, error } = useTransactions(selectedMonth);

  // Group transactions by date
  const groupedTransactions = transactionData ? groupTransactionsByDate(transactionData) : {};
  
  // Calculate financial data with proper type checking
  const spending = getTotalCashGroupedByDate(transactionData || [], "Spending");
  const earning = getTotalCashGroupedByDate(transactionData || [], "Earning");
  const balance = earning + spending;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-3 pt-5 pb-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-full h-8">
          <svg viewBox="0 0 400 32" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,32 Q100,20 200,32 T400,20 L400,32 Z" fill="rgb(249 250 251)" className="transition-all duration-300"></path>
          </svg>
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Transactions</h1>
              <p className="text-blue-100 text-sm">Track your financial activities</p>
            </div>
            <div className="relative">
              <select
                id="month"
                className="appearance-none bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 pr-10 cursor-pointer hover:bg-white/30 transition-all duration-200"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {months.map((month) => (
                  <option key={month} value={month} className="text-gray-800 bg-white">
                    {month}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-3 mt-6 mb-8">
        <div className="grid grid-cols-1 gap-4">
          {/* Net Balance Card */}
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
            <p className="text-sm text-gray-600">Positive balance</p>
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
            <h3 className="text-xl font-bold text-gray-900">Transaction</h3>
          </div>
          
          <div className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {/* Skeleton for transactions */}
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-5 bg-gray-200 rounded w-32"></div>
                      <div className="h-5 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading transactions</h3>
                <p className="text-gray-500 text-sm">Failed to fetch transactions for {selectedMonth}. Please try again later.</p>
              </div>
            ) : transactionData && Array.isArray(transactionData) && transactionData.length > 0 ? (
              <div className="space-y-6">
                {Object.keys(groupedTransactions)
                  .sort((a, b) => new Date(b.split('/').reverse().join('-')) - new Date(a.split('/').reverse().join('-')))
                  .map((date) => (
                    <div key={date} className="space-y-4">
                      {/* Date Header */}
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-700">
                          {formatDate(date)}
                        </h4>
                        <div className="text-xs text-gray-500">
                          {groupedTransactions[date].length} transaction{groupedTransactions[date].length !== 1 ? 's' : ''}
                        </div>
                      </div>
                      
                      {/* Transactions for this date */}
                      <div className="space-y-3">
                        {groupedTransactions[date].map((transaction, index) => (
                          <Transaction
                            key={`${date}-${index}`}
                            type={transaction.Transaction}
                            account={transaction.Account}
                            category={transaction["Category or Account"]}
                            note={transaction.Note}
                            cash={getCashValue(transaction)}
                          />
                        ))}
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
