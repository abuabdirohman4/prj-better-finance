"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useTransactions, useAccounts } from '@/utils/hooks';
import { months } from '@/utils/constants';
import { formatCurrency, getCashValue, getTotalCashGroupedByDate } from '@/utils/helper';
import { getDefaultSheetName } from '@/utils/google';
import AccountCard from '@/components/Card/Account';

export default function Home() {
  const selectedMonth = getDefaultSheetName(months);
  const { data: transactionData, isLoading, error } = useTransactions(selectedMonth);
  const { data: accountData, isLoading: accountsLoading } = useAccounts();

  // Calculate financial data with proper type checking
  const spending = getTotalCashGroupedByDate(transactionData || [], "Spending");
  const earning = getTotalCashGroupedByDate(transactionData || [], "Earning");
  const balance = earning - spending;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header Section - Livin By Mandiri Style */}
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 z-40 overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-6 pt-5 pb-4 max-w-md w-full">
        
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
          {/* Top Row - User Profile and Month Selector */}
          <div className="flex items-center justify-between mb-4">
            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                <span className="text-white font-bold text-white">AA</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">ABU ABDIROHMAN</h2>
                <div className="flex items-center space-x-2 text-blue-200 text-sm">
                  <span>Software Engineer</span>
                </div>
              </div>
            </div>

            {/* Month Selector */}
            {/* <div className="relative">
              <select
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
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="px-3 mt-6 mb-8 pt-24">
        <div className="grid grid-cols-1 gap-4">
          {/* Balance Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Total Assets</h2>
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {isLoading ? (
                <div className="animate-pulse bg-gray-200 h-10 w-32 rounded"></div>
              ) : (
                formatCurrency(100000000)
              )}
            </div>
          </div>

          {/* Income & Expense Cards */}
          {/* <div className="grid grid-cols-2 gap-4"> */}
            {/* Income Card */}
            {/* <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl border border-green-200 p-4">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-green-800">Income</span>
              </div>
              <div className="text-xl font-bold text-green-900">
                {isLoading ? (
                  <div className="animate-pulse bg-green-200 h-6 w-20 rounded"></div>
                ) : (
                  formatCurrency(earning, "signs")
                )}
              </div>
            </div> */}

            {/* Expense Card */}
            {/* <div className="bg-gradient-to-br from-red-50 to-rose-100 rounded-2xl border border-red-200 p-4">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-red-800">Expenses</span>
              </div>
              <div className="text-xl font-bold text-red-900">
                {isLoading ? (
                  <div className="animate-pulse bg-red-200 h-6 w-20 rounded"></div>
                ) : (
                  formatCurrency(spending, "signs")
                )}
              </div>
            </div> */}
          {/* </div> */}
        </div>
      </div>

      {/* Top Accounts */}
      <div className="px-3 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Used Accounts</h3>
        {accountsLoading ? (
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-3">
                <div className="animate-pulse">
                  <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {accountData && accountData
              .filter(account => ['Wallet', 'Mandiri', 'BCA'].includes(account.name))
              .map((account) => (
                <AccountCard key={account.name} account={account} />
              ))}
          </div>
        )}
      </div>

      {/* Recent Activity Preview */}
      <div className="px-3 pb-24">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
            <Link
              href="/transactions"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </Link>
          </div>
          
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : transactionData && transactionData.length > 0 ? (
            <div className="space-y-3">
              {transactionData.slice(0, 3).map((transaction, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.Transaction === 'Spending' 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {transaction.Transaction === 'Spending' ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {transaction.Note || transaction["Category or Account"]}
                    </p>
                    <p className="text-xs text-gray-500">
                      {transaction.Date} • {transaction["Category or Account"]}
                    </p>
                  </div>
                  <div className={`text-sm font-semibold ${
                    transaction.Transaction === 'Spending' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {transaction.Transaction === 'Spending' ? '-' : '+'}
                    {formatCurrency(Math.abs(getCashValue(transaction)), "brackets")}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">No transactions yet</p>
              <p className="text-gray-400 text-xs">Start by adding your first transaction</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
