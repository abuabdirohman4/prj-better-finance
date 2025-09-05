"use client";
import { useState, useMemo } from "react";
import { useTransactions, useBudgets } from "@/utils/hooks";
import { formatCurrency, formatCurrencyShort, getCashValue, getCurrentWeek, getBudgetColors } from "@/utils/helper";
import { months } from "@/utils/constants";
import { getDefaultSheetName } from "@/utils/google";
import { processBudgetData } from "@/app/budgets/data";

// Eating categories configuration
const EATING_CATEGORIES = [
  { key: 'DINING OUT', name: 'Dining Out', icon: '🍽️', color: 'bg-red-500' },
  { key: 'FOOD', name: 'Food', icon: '🍕', color: 'bg-orange-500' },
  { key: 'GROCERIES', name: 'Groceries', icon: '🛒', color: 'bg-green-500' },
  { key: 'GRAB CREDIT', name: 'Grab Credit', icon: '🚗', color: 'bg-blue-500' }
];

export default function WeeklyBudget() {
  const [selectedMonth, setSelectedMonth] = useState(getDefaultSheetName(months));
  const [selectedWeek, setSelectedWeek] = useState(1);
  const { data: budgetRawData, isLoading: budgetLoading, error: budgetError } = useBudgets(selectedMonth);
  const { data: transactionData, isLoading: transactionLoading, error: transactionError } = useTransactions(selectedMonth);

  // Process budget data
  const budgetData = useMemo(() => {
    if (!budgetRawData) return null;
    return processBudgetData(budgetRawData, selectedMonth);
  }, [budgetRawData, selectedMonth]);

  // Get current week info
  const currentDate = new Date();
  const currentWeek = getCurrentWeek(currentDate);
  const daysLeftInWeek = getDaysLeftInWeek(currentDate);

  // Calculate weekly budgets and spending
  const weeklyData = useMemo(() => {
    if (!budgetData || !budgetData.spending || !transactionData || !Array.isArray(transactionData)) {
      return [];
    }

    return EATING_CATEGORIES.map(category => {
      // Find budget for this category in spending data
      const budget = budgetData.spending[category.key];
      const monthlyBudget = budget ? budget.budget : 0;
      const weeklyBudget = monthlyBudget / 4; // Divide by 4 weeks

      // Calculate spending for this week
      const weekSpending = calculateWeekSpending(transactionData, category.key, currentWeek);
      const remaining = Math.abs(weeklyBudget) - weekSpending;
      const percentage = Math.abs(weeklyBudget) > 0 ? (weekSpending / Math.abs(weeklyBudget)) * 100 : 0;


      // const finalPercentage = Math.min(percentage, 100);
      // const colors = getBudgetColors(finalPercentage);
      const colors = getBudgetColors(percentage);

      return {
        ...category,
        monthlyBudget,
        weeklyBudget,
        weekSpending,
        remaining,
        // percentage: finalPercentage,
        percentage,
        colors
      };
    });
  }, [budgetData, transactionData, currentWeek]);

  const totalWeeklyBudget = weeklyData.reduce((sum, item) => sum + Math.abs(item.weeklyBudget), 0);
  const totalWeekSpending = weeklyData.reduce((sum, item) => sum + item.weekSpending, 0);
  const totalRemaining = totalWeeklyBudget - totalWeekSpending;
  const totalPercentage = totalWeeklyBudget > 0 ? (totalWeekSpending / totalWeeklyBudget) * 100 : 0;
  const totalColors = getBudgetColors(totalPercentage);

  if (budgetLoading || transactionLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Show empty state if no data
  if (!budgetData || !transactionData) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="p-4">
          <div className="text-center py-8">
            <div className="text-gray-500">No budget data available</div>
          </div>
        </div>
      </main>
    );
  }

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
              <h1 className="text-2xl font-bold text-white mb-1">Weekly Budget</h1>
              <p className="text-orange-100 text-sm">{currentWeek.month} {currentWeek.year}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-3 pb-24 mt-6 space-y-4">

        {/* Overall Progress */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          {/* Header with Icon */}
          <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Overall Progress</h2>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="col-span-2">
              <p className="text-sm text-gray-600 mb-1">Spending / Budget</p>
              <p className="text-lg font-bold text-gray-700">
                {formatCurrency(Math.abs(totalWeekSpending))} / {formatCurrency(Math.abs(totalWeeklyBudget))}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Remaining</p>
              <p className={`text-lg font-bold ${
                totalRemaining >= 0 ? 'text-gray-700' : 'text-red-600'
              }`}>
              {/* <p className={`text-lg font-bold ${totalColors.text}`}></p> */}
                {formatCurrency(totalRemaining)}
              </p>
            </div>
          </div>

          {/* Progress Bar with Percentage */}
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-200 ease-out ${totalColors.progress}`}
                style={{ 
                  width: `${Math.min(totalPercentage, 100)}%` 
                }}
              ></div>
            </div>
            <span className={`text-sm font-semibold ${totalColors.text}`}>
              {totalPercentage.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Category Cards */}
        <div className="space-y-3">
          {weeklyData.map((category) => (
            <div key={category.key} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 flex items-center justify-center text-white text-2xl`}>
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <div className="text-sm text-gray-500">
                      {formatCurrency(category.weekSpending)} / {formatCurrency(Math.abs(category.weeklyBudget))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${category.colors.text}`}>
                    {formatCurrency(category.remaining)}
                  </div>
                </div>
              </div>

              {/* Progress Bar with Percentage */}
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${category.colors.progress}`}
                    style={{ width: `${Math.min(category.percentage, 100)}%` }}
                  ></div>
                </div>
                <div className={`text-sm font-medium ${category.colors.text}`}>
                  {category.percentage.toFixed(0)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

// Helper functions
function getDaysLeftInWeek(date) {
  const dayOfWeek = date.getDay();
  // Sunday = 0, Monday = 1, ..., Saturday = 6
  // Days left in week (including today)
  return dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
}

function calculateWeekSpending(transactions, category, currentWeek) {
  if (!transactions || !Array.isArray(transactions)) {
    return 0;
  }

  const filteredTransactions = transactions.filter(transaction => {
    // Filter by category and spending type
    if (transaction.Transaction !== 'Spending') return false;
    if (transaction['Category or Account'].toLowerCase() !== category.toLowerCase()) return false;
    
    // Parse date - handle DD/MM/YYYY format
    let transactionDate;
    if (transaction.Date.includes('/')) {
      // DD/MM/YYYY format
      const [day, month, year] = transaction.Date.split('/');
      transactionDate = new Date(year, month - 1, day);
    } else {
      // Try standard date parsing
      transactionDate = new Date(transaction.Date);
    }
    
    const weekStart = new Date(currentWeek.startDate);
    const weekEnd = new Date(currentWeek.endDate);
    
    const isInWeek = transactionDate >= weekStart && transactionDate <= weekEnd;
    return isInWeek;
  });

  const total = filteredTransactions.reduce((total, transaction) => {
    const amount = Math.abs(getCashValue(transaction));
    return total + amount;
  }, 0);

  return total;
}
