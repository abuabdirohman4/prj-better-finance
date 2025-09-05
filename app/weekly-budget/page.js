"use client";
import { useState, useMemo } from "react";
import { useTransactions, useBudgets } from "@/utils/hooks";
import { formatCurrency, getCashValue, getCurrentWeek } from "@/utils/helper";
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


      return {
        ...category,
        monthlyBudget,
        weeklyBudget,
        weekSpending,
        remaining,
        percentage: Math.min(percentage, 100)
      };
    });
  }, [budgetData, transactionData, currentWeek]);

  const totalWeeklyBudget = weeklyData.reduce((sum, item) => sum + Math.abs(item.weeklyBudget), 0);
  const totalWeekSpending = weeklyData.reduce((sum, item) => sum + item.weekSpending, 0);
  const totalRemaining = totalWeeklyBudget - totalWeekSpending;

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
              <p className="text-orange-100 text-sm">Week {currentWeek.week + 1} ({currentWeek.month} {currentWeek.year})</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">
                {formatCurrency(Math.abs(totalRemaining))}
              </div>
              <div className="text-orange-100 text-sm">Remaining</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-8 pb-24 space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Weekly Budget</div>
            <div className="text-xl font-bold text-gray-900">{formatCurrency(Math.abs(totalWeeklyBudget))}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Days Left</div>
            <div className="text-xl font-bold text-gray-900">{daysLeftInWeek} days</div>
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
                  <div className={`text-lg font-bold ${category.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(category.remaining)}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    category.percentage >= 100 ? 'bg-red-500' : 
                    category.percentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span className={`font-medium ${
                  category.percentage >= 100 ? 'text-red-600' : 
                  category.percentage >= 80 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {category.percentage.toFixed(0)}%
                </span>
                <span>100%</span>
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
