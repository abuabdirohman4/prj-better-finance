"use client";

import { useState, useMemo, useEffect } from "react";
import { useTransactions, useBudgets } from "@/utils/hooks";
import { formatCurrency, getCashValue, getCurrentWeek, getBudgetColors } from "@/utils/helper";
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
  const selectedMonth = getDefaultSheetName(months);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const { data: budgetRawData, isLoading: budgetLoading } = useBudgets(selectedMonth);
  const { data: transactionData, isLoading: transactionLoading } = useTransactions(selectedMonth);

  // Process budget data
  const budgetData = useMemo(() => {
    if (!budgetRawData) return null;
    return processBudgetData(budgetRawData, selectedMonth);
  }, [budgetRawData, selectedMonth]);

  // Get current week info
  const currentDate = useMemo(() => new Date(), []);
  const currentWeek = getCurrentWeek(currentDate);

  // Calculate weeks in selected month
  const weeksInMonth = useMemo(() => {
    return getWeeksInMonth(selectedMonth);
  }, [selectedMonth]);

  // Get week info for selected week
  const selectedWeekInfo = useMemo(() => {
    return getWeekInfo(selectedMonth, selectedWeek);
  }, [selectedMonth, selectedWeek]);

  // Get current week number for the selected month
  const currentWeekNumber = useMemo(() => {
    // Check if current date is in the selected month
    const currentMonthIndex = months.indexOf(selectedMonth);
    if (currentDate.getMonth() !== currentMonthIndex) {
      return 1; // If not in the selected month, default to week 1
    }
    
    // Use existing getCurrentWeek function
    const currentWeekInfo = getCurrentWeek(currentDate);
    return currentWeekInfo.week;
  }, [selectedMonth, currentDate]);

  // Auto-select current week when month changes or component loads
  useEffect(() => {
    if (currentWeekNumber > 0 && currentWeekNumber <= weeksInMonth) {
      setSelectedWeek(currentWeekNumber);
    }
  }, [currentWeekNumber, weeksInMonth]);

  // Calculate weekly budgets and spending
  const weeklyData = useMemo(() => {
    if (!budgetData || !budgetData.spending || !transactionData || !Array.isArray(transactionData)) {
      return [];
    }

    // Calculate all weeks in the month for budget distribution
    const allWeeksInfo = Array.from({ length: weeksInMonth }, (_, i) => 
      getWeekInfo(selectedMonth, i + 1)
    );

    return EATING_CATEGORIES.map(category => {
      // Find budget for this category in spending data
      const budget = budgetData.spending[category.key];
      const monthlyBudget = budget ? budget.budget : 0;
      
      // Calculate dynamic weekly budget with monthly pool strategy
      const weeklyBudget = calculateWeeklyBudgetWithPool(
        monthlyBudget, 
        allWeeksInfo, 
        selectedWeek, 
        transactionData, 
        category.key
      );

      // Calculate spending for this week
      const weekSpending = calculateWeekSpending(transactionData, category.key, selectedWeekInfo);
      
      const remaining = Math.abs(weeklyBudget) - weekSpending;
      const percentage = Math.abs(weeklyBudget) > 0 ? (weekSpending / Math.abs(weeklyBudget)) * 100 : 0;

      const colors = getBudgetColors(percentage);

      return {
        ...category,
        monthlyBudget,
        weeklyBudget,
        weekSpending,
        remaining,
        percentage,
        colors
      };
    });
  }, [budgetData, transactionData, selectedWeekInfo, selectedWeek, weeksInMonth, selectedMonth]);

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
          {/* Page Title */}
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Weekly Budget</h1>
              <p className="text-white text-sm">{currentWeek.month} {currentWeek.year}</p>
            </div>
            {/* Settings and Week Selector */}
            <div className="flex items-center space-x-3">
              {/* Week Selector */}
              <div className="relative">
                <select
                  id="week"
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
                  className="appearance-none bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 pr-10 cursor-pointer hover:bg-white/30 transition-all duration-200"
                >
                  {Array.from({ length: weeksInMonth }, (_, i) => i + 1).map((week) => (
                    <option key={week} value={week} className="text-gray-800 bg-white">
                      Week {week}
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
      </div>

      {/* Content */}
      <div className="px-3 pb-24 mt-6 space-y-4">

        {/* Overall Progress */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          {/* Header with Icon */}
          <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Overall Progress</h2>
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
function calculateWeeklyBudgetWithPool(monthlyBudget, allWeeksInfo, currentWeek, transactions, category) {
  if (!monthlyBudget || !allWeeksInfo || !transactions) {
    return 0;
  }

  const monthlyBudgetAmount = Math.abs(monthlyBudget);
  
  // Calculate total days in all weeks
  const totalDays = allWeeksInfo.reduce((total, weekInfo) => {
    const timeDiff = weekInfo.endDate.getTime() - weekInfo.startDate.getTime();
    const daysInWeek = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;
    return total + daysInWeek;
  }, 0);

  // Calculate initial budget per day
  const initialBudgetPerDay = monthlyBudgetAmount / totalDays;

  // Calculate original budget for each week based on actual days
  const originalWeeklyBudgets = allWeeksInfo.map(weekInfo => {
    const timeDiff = weekInfo.endDate.getTime() - weekInfo.startDate.getTime();
    const daysInWeek = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;
    return initialBudgetPerDay * daysInWeek;
  });

  // If no transactions, return original budget for the week
  if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
    return originalWeeklyBudgets[currentWeek - 1] || 0;
  }

  const originalWeekBudget = originalWeeklyBudgets[currentWeek - 1] || 0;
  
  if (currentWeek === 1) {
    return originalWeekBudget;
  }
  
  const overBudgets = [];
  const underBudgets = [];
  
  for (let i = 0; i < currentWeek; i++) {
    const weekOriginalBudget = originalWeeklyBudgets[i] || 0;
    const weekSpending = calculateWeekSpending(transactions, category, allWeeksInfo[i]);
    
    let weekPenalty = 0;
    let weekBonus = 0;
    
    // Calculate penalties from previous weeks' overspending
    for (let j = 0; j < i; j++) {
      if (overBudgets[j] > 0) {
        const remainingDaysFromOverBudgetWeek = allWeeksInfo.slice(j + 1).reduce((total, weekInfo) => {
          const timeDiff = weekInfo.endDate.getTime() - weekInfo.startDate.getTime();
          const daysInWeek = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;
          return total + daysInWeek;
        }, 0);
        
        const penaltyPerDayForThisWeek = remainingDaysFromOverBudgetWeek > 0 ? overBudgets[j] / remainingDaysFromOverBudgetWeek : 0;
        
        const timeDiff = allWeeksInfo[i].endDate.getTime() - allWeeksInfo[i].startDate.getTime();
        const daysInWeek = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;
        
        const penaltyAmountFromThisWeek = penaltyPerDayForThisWeek * daysInWeek;
        weekPenalty += penaltyAmountFromThisWeek;
      }
    }
    
    // Calculate bonuses from previous weeks' underspending
    for (let j = 0; j < i; j++) {
      if (underBudgets[j] > 0) {
        const remainingDaysFromUnderBudgetWeek = allWeeksInfo.slice(j + 1).reduce((total, weekInfo) => {
          const timeDiff = weekInfo.endDate.getTime() - weekInfo.startDate.getTime();
          const daysInWeek = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;
          return total + daysInWeek;
        }, 0);
        
        const bonusPerDayForThisWeek = remainingDaysFromUnderBudgetWeek > 0 ? underBudgets[j] / remainingDaysFromUnderBudgetWeek : 0;
        
        const timeDiff = allWeeksInfo[i].endDate.getTime() - allWeeksInfo[i].startDate.getTime();
        const daysInWeek = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;
        
        const bonusAmountFromThisWeek = bonusPerDayForThisWeek * daysInWeek;
        weekBonus += bonusAmountFromThisWeek;
      }
    }
    
    const weekAdjustedBudget = Math.max(0, weekOriginalBudget - weekPenalty + weekBonus);
    const weekOverBudget = Math.max(0, weekSpending - weekAdjustedBudget);
    const weekUnderBudget = Math.max(0, weekAdjustedBudget - weekSpending);
    
    overBudgets.push(weekOverBudget);
    underBudgets.push(weekUnderBudget);
  }
  
  // Calculate penalties and bonuses for current week
  let currentWeekPenalty = 0;
  let currentWeekBonus = 0;
  
  for (let i = 0; i < overBudgets.length - 1; i++) {
    if (overBudgets[i] > 0) {
      const remainingDaysFromOverBudgetWeek = allWeeksInfo.slice(i + 1).reduce((total, weekInfo) => {
        const timeDiff = weekInfo.endDate.getTime() - weekInfo.startDate.getTime();
        const daysInWeek = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;
        return total + daysInWeek;
      }, 0);
      
      const penaltyPerDayForThisWeek = remainingDaysFromOverBudgetWeek > 0 ? overBudgets[i] / remainingDaysFromOverBudgetWeek : 0;
      
      const currentWeekInfo = allWeeksInfo[currentWeek - 1];
      const timeDiff = currentWeekInfo.endDate.getTime() - currentWeekInfo.startDate.getTime();
      const daysInCurrentWeek = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;
      
      const penaltyAmountFromThisWeek = penaltyPerDayForThisWeek * daysInCurrentWeek;
      currentWeekPenalty += penaltyAmountFromThisWeek;
    }
    
    if (underBudgets[i] > 0) {
      const remainingDaysFromUnderBudgetWeek = allWeeksInfo.slice(i + 1).reduce((total, weekInfo) => {
        const timeDiff = weekInfo.endDate.getTime() - weekInfo.startDate.getTime();
        const daysInWeek = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;
        return total + daysInWeek;
      }, 0);
      
      const bonusPerDayForThisWeek = remainingDaysFromUnderBudgetWeek > 0 ? underBudgets[i] / remainingDaysFromUnderBudgetWeek : 0;
      
      const currentWeekInfo = allWeeksInfo[currentWeek - 1];
      const timeDiff = currentWeekInfo.endDate.getTime() - currentWeekInfo.startDate.getTime();
      const daysInCurrentWeek = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;
      
      const bonusAmountFromThisWeek = bonusPerDayForThisWeek * daysInCurrentWeek;
      currentWeekBonus += bonusAmountFromThisWeek;
    }
  }
  
  return Math.max(0, originalWeekBudget - currentWeekPenalty + currentWeekBonus);
}

function getWeeksInMonth(monthName) {
  const currentYear = new Date().getFullYear();
  const monthIndex = months.indexOf(monthName);
  
  if (monthIndex === -1) return 4;
  
  const firstDayOfMonth = new Date(currentYear, monthIndex, 1);
  const lastDayOfMonth = new Date(currentYear, monthIndex + 1, 0);
  
  const firstMonday = new Date(firstDayOfMonth);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  
  const daysToFirstMonday = firstDayOfWeek === 0 ? 1 : firstDayOfWeek === 1 ? 0 : 8 - firstDayOfWeek;
  if (daysToFirstMonday > 0) {
    firstMonday.setDate(firstDayOfMonth.getDate() + daysToFirstMonday);
  }
  
  if (firstMonday.getMonth() !== monthIndex) {
    firstMonday.setTime(firstDayOfMonth.getTime());
  }
  
  let weekCount = 0;
  let currentWeekStart = new Date(firstMonday);
  
  while (currentWeekStart <= lastDayOfMonth) {
    weekCount++;
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
  }
  
  return Math.max(weekCount, 1);
}

function getWeekInfo(monthName, weekNumber) {
  const currentYear = new Date().getFullYear();
  const monthIndex = months.indexOf(monthName);
  
  if (monthIndex === -1) {
    const now = new Date();
    return getCurrentWeek(now);
  }
  
  const firstDayOfMonth = new Date(currentYear, monthIndex, 1);
  const lastDayOfMonth = new Date(currentYear, monthIndex + 1, 0);
  
  const firstMonday = new Date(firstDayOfMonth);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  
  const daysToFirstMonday = firstDayOfWeek === 0 ? 1 : firstDayOfWeek === 1 ? 0 : 8 - firstDayOfWeek;
  if (daysToFirstMonday > 0) {
    firstMonday.setDate(firstDayOfMonth.getDate() + daysToFirstMonday);
  }
  
  if (firstMonday.getMonth() !== monthIndex) {
    firstMonday.setTime(firstDayOfMonth.getTime());
  }
  
  const weekStartDate = new Date(firstMonday);
  weekStartDate.setDate(firstMonday.getDate() + (weekNumber - 1) * 7);
  weekStartDate.setHours(0, 0, 0, 0);
  
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setDate(weekStartDate.getDate() + 6);
  weekEndDate.setHours(23, 59, 59, 999);
  
  if (weekEndDate > lastDayOfMonth) {
    weekEndDate.setTime(lastDayOfMonth.getTime());
    weekEndDate.setHours(23, 59, 59, 999);
  }
  
  return {
    week: weekNumber,
    month: monthName,
    year: currentYear,
    startDate: weekStartDate,
    endDate: weekEndDate
  };
}

function calculateWeekSpending(transactions, category, currentWeek) {
  if (!transactions || !Array.isArray(transactions)) {
    return 0;
  }

  const filteredTransactions = transactions.filter(transaction => {
    if (transaction.Transaction !== 'Spending') return false;
    if (transaction['Category or Account'].toLowerCase() !== category.toLowerCase()) return false;
    
    let transactionDate;
    if (transaction.Date.includes('/')) {
      const [day, month, year] = transaction.Date.split('/');
      transactionDate = new Date(year, month - 1, day);
    } else {
      transactionDate = new Date(transaction.Date);
    }
    
    const weekStart = new Date(currentWeek.startDate);
    const weekEnd = new Date(currentWeek.endDate);
    
    return transactionDate >= weekStart && transactionDate <= weekEnd;
  });

  return filteredTransactions.reduce((total, transaction) => {
    const amount = Math.abs(getCashValue(transaction));
    return total + amount;
  }, 0);
}


