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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-6 pt-8 pb-6">
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
              <h1 className="text-2xl font-bold text-white mb-1">Budgets</h1>
              <p className="text-blue-100 text-sm">Track your spending limits</p>
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

      {/* Budget Summary Cards */}
      <div className="px-6 mt-6 mb-8">
        <div className="grid grid-cols-1 gap-4">
          {/* Overall Progress Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Overall Budget Progress</h2>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Budget Usage</span>
                <span className={`text-sm font-semibold ${colors.text}`}>
                  {percentageFromSheet.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${colors.progress}`}
                  style={{ width: `${Math.min(percentageFromSheet, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Budget</p>
                <p className="text-lg font-bold text-blue-600">
                  {formatCurrency(totalBudgetFromSheet, "brackets")}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(totalActualFromSheet, "brackets")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="px-6 pb-24">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">Budget Categories</h3>
            <p className="text-sm text-gray-600 mt-1">Manage your spending by category</p>
          </div>
          
          <div className="p-6">
            {/* Loading State */}
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading budget data...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Grouped Categories */}
                {Object.entries(groupedBudgetData).map(([categoryKey, categoryData]) => {
                  const totals = categoryTotals[categoryKey];
                  const categoryColors = getBudgetColors(totals.percentageUsed);
                  
                  return (
                    <div key={categoryKey} className="border border-gray-200 rounded-xl overflow-hidden">
                      {/* Category Header */}
                      <div 
                        className="relative cursor-pointer p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-200"
                        onClick={() => toggleCategory(categoryKey)}
                      >
                        {/* Arrow icon */}
                        <div className="absolute top-4 right-4 z-10">
                          <svg 
                            className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                              collapsedCategories[categoryKey] ? 'rotate-180' : ''
                            }`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                        
                        {/* Category Info */}
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white text-lg">
                              {categoryKey === 'eating' ? '🍽️' : 
                               categoryKey === 'living' ? '🏠' : 
                               categoryKey === 'saving' ? '💰' : 
                               categoryKey === 'investing' ? '💹' : 
                               categoryKey === 'giving' ? '❤️' : '📋'}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 capitalize">
                              {categoryKey}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {Object.keys(categoryData).length} subcategories
                            </p>
                          </div>
                        </div>
                        
                        {/* Category Summary */}
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div className="text-center">
                            <div className="text-gray-600 mb-1">Budget</div>
                            <div className="font-semibold text-blue-600">
                              {formatCurrency(totals.budget, "brackets")}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-600 mb-1">Spent</div>
                            <div className="font-semibold text-red-600">
                              {formatCurrency(totals.spent, "brackets")}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-600 mb-1">Remaining</div>
                            <div className={`font-semibold ${
                              totals.remaining >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {formatCurrency(totals.remaining, "brackets")}
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${categoryColors.progress}`}
                              style={{ width: `${Math.min(totals.percentageUsed, 100)}%` }}
                            ></div>
                          </div>
                          <div className={`text-xs text-center mt-2 ${categoryColors.text}`}>
                            {totals.percentageUsed.toFixed(1)}% used
                          </div>
                        </div>
                      </div>
                      
                      {/* Collapsible Subcategories */}
                      <div className={`overflow-hidden transition-all duration-300 ${
                        collapsedCategories[categoryKey] ? 'max-h-0 opacity-0' : 'max-h-screen opacity-100'
                      }`}>
                        <div className="p-4 bg-gray-50 space-y-3">
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
                                  : 'bg-white border-gray-200'
                              }`}>
                                <div className="flex justify-between items-center mb-3">
                                  <h6 className="font-medium text-gray-900 text-sm">
                                    {toProperCase(subCategory)}
                                  </h6>
                                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
                                    {formatCurrency(subBudget, "brackets")}
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3 text-xs mb-3">
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
                                
                                {/* Progress Bar per Sub-category */}
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className={`h-1.5 rounded-full transition-all duration-300 ${subColors.progress}`}
                                    style={{ width: `${Math.min(subPercentageUsed, 100)}%` }}
                                  ></div>
                                </div>
                                <div className={`text-xs text-center mt-2 ${subColors.text}`}>
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
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
