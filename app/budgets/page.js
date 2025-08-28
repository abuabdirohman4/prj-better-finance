"use client";
import { categories, months } from "@/utils/constants";
import { fetchTransaction } from "../transactions/data";
import {
  formatCurrency,
  getBudgetColors,
  getCashValue,
  getTotalObjectValue,
  toProperCase,
} from "@/utils/helper";
import { getDefaultSheetName } from "@/utils/google";
import { useCallback, useEffect, useState } from "react";
import { fetchBudgets } from "./data";
import Cookies from 'js-cookie';

export default function Budgets() {
  const [categorySpending, setCategorySpending] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(getDefaultSheetName(months));
  const [totalSpending, setTotalSpending] = useState(0);
  const [budgetData, setBudgetData] = useState(null);
  
  // State untuk mengontrol collapse setiap kategori dengan default hide semua
  const [collapsedCategories, setCollapsedCategories] = useState({
    eating: true,
    living: true,
    saving: true,
    investing: true,
    giving: true
  });

  // Load collapse state dari cookies saat component mount
  useEffect(() => {
    const savedCollapseState = Cookies.get('budget-collapse-state');
    if (savedCollapseState) {
      try {
        const parsedState = JSON.parse(savedCollapseState);
        setCollapsedCategories(prev => ({
          ...prev,
          ...parsedState
        }));
      } catch (error) {
        console.error('Error parsing collapse state from cookies:', error);
      }
    }
  }, []);

  // Function untuk toggle collapse dan simpan ke cookies
  const toggleCategory = (categoryKey) => {
    const newState = {
      ...collapsedCategories,
      [categoryKey]: !collapsedCategories[categoryKey]
    };
    
    setCollapsedCategories(newState);
    
    // Simpan ke cookies
    Cookies.set('budget-collapse-state', JSON.stringify(newState), { 
      expires: 365,
      sameSite: 'strict'
    });
  };

  const sumCategory = useCallback(
    (transaction, categoryList, typeTransaction) => {
      const newSubCategorySpending = {};
      const newCategorySpending = {};
      for (const category of categoryList) {
        const transactionsInCategory = transaction.filter(
          (item) =>
            item["Category or Account"] === category &&
            item.Transaction === typeTransaction
        );
        const totalAmount = transactionsInCategory.reduce(
          (acc, item) => acc + getCashValue(item),
          0
        );
        // Menentukan kategori induk
        let parentCategory = "";
        for (const item in categories) {
          if (categories[item].includes(category)) {
            parentCategory = item;
          }
        }
        // Menambahkan nilai total ke kategori yang sesuai
        if (parentCategory) {
          if (!newSubCategorySpending[parentCategory]) {
            newSubCategorySpending[parentCategory] = {};
          }
          newSubCategorySpending[parentCategory][category] = totalAmount;
        }
      }

      for (const category in categories) {
        const totalAmount = Object.values(
          newSubCategorySpending[category]
        ).reduce((acc, curr) => acc + curr, 0);
        newCategorySpending[category] = totalAmount;
      }

      setCategorySpending(newCategorySpending);
      return newCategorySpending;
    },
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      // Fetch transaction data
      const data = await fetchTransaction(selectedMonth);
      const totalSpendingCategory = sumCategory(
        data,
        [
          ...categories.eating,
          ...categories.living,
          ...categories.saving,
          ...categories.investing,
          ...categories.giving,
        ],
        "Spending"
      );
      setTotalSpending(getTotalObjectValue(totalSpendingCategory));

      // Fetch budget data
      const budgetData = await fetchBudgets(selectedMonth);
      setBudgetData(budgetData);
    };
    fetchData();
  }, [selectedMonth, sumCategory]);

  // Group budget data berdasarkan categories constants dengan case-insensitive matching
  // DAN mencegah duplikasi dengan prioritas kategori
  const groupedBudgetData = budgetData ? (() => {
    const usedKeys = new Set(); // Track keys yang sudah digunakan
    
    const getCategoryForKey = (key) => {
      // Prioritas: eating > living > giving > saving > investing
      if (categories.eating.some(cat => 
        cat.toLowerCase() === key.toLowerCase() || 
        cat.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(cat.toLowerCase())
      )) return 'eating';
      
      if (categories.living.some(cat => 
        cat.toLowerCase() === key.toLowerCase() || 
        cat.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(cat.toLowerCase())
      )) return 'living';
      
      if (categories.giving.some(cat => 
        cat.toLowerCase() === key.toLowerCase() || 
        cat.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(cat.toLowerCase())
      )) return 'giving';
      
      if (categories.saving.some(cat => 
        cat.toLowerCase() === key.toLowerCase() || 
        cat.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(cat.toLowerCase())
      )) return 'saving';
      
      if (categories.investing.some(cat => 
        cat.toLowerCase() === key.toLowerCase() || 
        cat.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(cat.toLowerCase())
      )) return 'investing';
      
      return null;
    };

    const result = {
      eating: {},
      living: {},
      saving: {},
      investing: {},
      giving: {}
    };

    // Process spending data
    Object.entries(budgetData.spending || {}).forEach(([key, value]) => {
      const category = getCategoryForKey(key);
      if (category && !usedKeys.has(key)) {
        result[category][key] = value;
        usedKeys.add(key);
      }
    });

    // Process transfer data
    Object.entries(budgetData.transfer || {}).forEach(([key, value]) => {
      const category = getCategoryForKey(key);
      if (category && !usedKeys.has(key)) {
        result[category][key] = value;
        usedKeys.add(key);
      }
    });

    return result;
  })() : null;

  // Calculate totals per category dengan konsep yang lebih jelas
  const calculateCategoryTotals = (groupedBudgetData) => {
    if (!groupedBudgetData) return {};
    
    const categoryTotals = {};
    
    Object.entries(groupedBudgetData).forEach(([categoryKey, categoryData]) => {
      const totalBudget = Object.values(categoryData).reduce((sum, item) => sum + Math.abs(item.budget), 0);
      const totalSpent = Object.values(categoryData).reduce((sum, item) => sum + Math.abs(item.actual), 0);
      const totalRemaining = totalBudget - totalSpent;
      const percentageUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
      
      categoryTotals[categoryKey] = {
        budget: totalBudget,
        spent: totalSpent,
        remaining: totalRemaining,
        percentageUsed: percentageUsed
      };
    });
    
    return categoryTotals;
  };

  const categoryTotals = calculateCategoryTotals(groupedBudgetData);

  // Calculate totals from grouped data
  const totalBudgetFromSheet = groupedBudgetData ? 
    Object.values(groupedBudgetData).reduce((sum, categoryData) => 
      Object.values(categoryData).reduce((catSum, item) => catSum + Math.abs(item.budget), 0) + sum, 0
    ) : 0;
  
  const totalActualFromSheet = groupedBudgetData ? 
    Object.values(groupedBudgetData).reduce((sum, categoryData) => 
      Object.values(categoryData).reduce((catSum, item) => catSum + Math.abs(item.actual), 0) + sum, 0
    ) : 0;

  // Hitung percentage dan colors berdasarkan data dari sheet
  const percentageFromSheet = totalBudgetFromSheet !== 0 ? Math.abs(totalActualFromSheet / totalBudgetFromSheet * 100) : 0;
  const colors = getBudgetColors(percentageFromSheet);

  // Loading state
  const isLoading = !groupedBudgetData;

  return (
    <main className="mb-10">
      <div className="w-full max-w-md min-h-screen p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-8">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
            Budgets
          </h5>
          <select
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading budget data...</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h6 className="text-sm font-medium text-blue-800 mb-2">Total Budget</h6>
                <p className="text-lg font-bold text-blue-900">
                  {formatCurrency(totalBudgetFromSheet, "brackets")}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h6 className="text-sm font-medium text-green-800 mb-2">Total Actual</h6>
                <p className="text-lg font-bold text-green-900">
                  {formatCurrency(totalActualFromSheet, "brackets")}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center justify-center mb-6">
              <p className={`text-sm text-gray-500 truncate me-2 ${colors.text}`}>
                {percentageFromSheet.toFixed(0)}%
              </p>
              <div className="w-8/12 bg-gray-200 rounded-full">
                <div
                  className={`text-xs h-2 font-medium text-center p-0.5 leading-none rounded-full ${colors.progress}`}
                  style={{ width: `${Math.min(percentageFromSheet, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Grouped Categories */}
            {Object.entries(groupedBudgetData).map(([categoryKey, categoryData]) => {
              const totals = categoryTotals[categoryKey];
              const categoryColors = getBudgetColors(totals.percentageUsed);
              
              return (
                <div key={categoryKey} className="mb-6">
                  <div 
                    className="relative cursor-pointer p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    onClick={() => toggleCategory(categoryKey)}
                  >
                    {/* Arrow icon di pojok kanan atas - tidak mempengaruhi layout */}
                    <div className="absolute top-4 right-4 z-10">
                      <svg 
                        className={`w-4 h-4 text-gray-600 transition-transform ${
                          collapsedCategories[categoryKey] ? 'rotate-180' : ''
                        }`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    
                    {/* Content tanpa padding-right - arrow tidak mempengaruhi layout */}
                    <div className="flex-1">
                      <div className="mb-2">
                        <h6 className="text-lg font-semibold text-gray-900 capitalize flex items-center">
                          {categoryKey === 'eating' ? '🍽️' : 
                           categoryKey === 'living' ? '🏠' : 
                           categoryKey === 'saving' ? '💰' : 
                           categoryKey === 'investing' ? '💹' : 
                           categoryKey === 'giving' ? '❤️' : '📋'} {categoryKey}
                        </h6>
                      </div>
                      
                      {/* Category Summary yang lebih compact */}
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div className="text-gray-600">Budget</div>
                          <div className="font-medium text-blue-600">
                            {formatCurrency(totals.budget, "brackets")}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-600">Spent</div>
                          <div className="font-medium text-red-600">
                            {formatCurrency(totals.spent, "brackets")}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-600">Remaining</div>
                          <div className={`font-medium ${
                            totals.remaining >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(totals.remaining, "brackets")}
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress Bar yang lebih compact dengan warna dari getBudgetColors */}
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-300 ${categoryColors.progress}`}
                            style={{ width: `${Math.min(totals.percentageUsed, 100)}%` }}
                          ></div>
                        </div>
                        <div className={`text-xs text-center mt-1 ${categoryColors.text}`}>
                          {totals.percentageUsed.toFixed(1)}% used
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Collapsible content */}
                  <div className={`overflow-hidden transition-all duration-300 ${
                    collapsedCategories[categoryKey] ? 'max-h-0 opacity-0' : 'max-h-screen opacity-100'
                  }`}>
                    <div className="space-y-2 mt-3">
                      {Object.entries(categoryData).map(([subCategory, data]) => {
                        const subBudget = Math.abs(data.budget);
                        const subSpent = Math.abs(data.actual);
                        const subRemaining = subBudget - subSpent;
                        const subPercentageUsed = subBudget > 0 ? (subSpent / subBudget) * 100 : 0;
                        const subColors = getBudgetColors(subPercentageUsed);
                        
                        return (
                          <div key={subCategory} className={`p-3 rounded-lg border ${
                            categoryKey === 'saving' || categoryKey === 'investing' 
                              ? 'bg-blue-50 border-blue-200' 
                              : 'bg-gray-50 border-gray-200'
                          }`}>
                            <div className="flex justify-between items-center mb-2">
                              <h6 className="font-medium text-gray-900 text-sm">
                                {toProperCase(subCategory)}
                              </h6>
                              <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                                {formatCurrency(subBudget, "brackets")}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 text-xs mb-2">
                              <div>
                                <span className="text-gray-600">Spent:</span>
                                <span className="ml-1 font-medium text-red-600">
                                  {formatCurrency(subSpent, "brackets")}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">Remaining:</span>
                                <span className={`ml-1 font-medium ${
                                  subRemaining >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {formatCurrency(subRemaining, "brackets")}
                                </span>
                              </div>
                            </div>
                            
                            {/* Progress Bar per Sub-category dengan warna dari getBudgetColors */}
                            <div className="w-full bg-gray-200 rounded-full h-1">
                              <div 
                                className={`h-1 rounded-full transition-all duration-300 ${subColors.progress}`}
                                style={{ width: `${Math.min(subPercentageUsed, 100)}%` }}
                              ></div>
                            </div>
                            <div className={`text-xs text-center mt-1 ${subColors.text}`}>
                              {subPercentageUsed.toFixed(1)}% used
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </main>
  );
}
