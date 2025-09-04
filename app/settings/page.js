"use client";
import { useState, useEffect, useMemo } from "react";
import { useGoals, useBudgets } from "@/utils/hooks";
import { categories, months } from "@/utils/constants";
import { toProperCase } from "@/utils/helper";
import { getDefaultSheetName } from "@/utils/google";
import { processBudgetData } from "@/app/budgets/data";
import Cookies from 'js-cookie';
import Link from 'next/link';
import ClearCache from '@/components/PWA/ClearCache';

export default function Settings() {
  const { data: goalsData, isLoading, error } = useGoals();
  const { data: budgetRawData, isLoading: isBudgetLoading, error: budgetError } = useBudgets(getDefaultSheetName(months));
  const [hiddenGoals, setHiddenGoals] = useState({});
  const [selectedGoals, setSelectedGoals] = useState(new Set());
  const [hiddenBudgets, setHiddenBudgets] = useState({});
  const [hiddenCategories, setHiddenCategories] = useState({});
  const [selectedBudgets, setSelectedBudgets] = useState(new Set());
  const [selectedCategories, setSelectedCategories] = useState(new Set());

  // Process budget data when it changes
  const budgetData = useMemo(() => {
    if (!budgetRawData) return null;
    return processBudgetData(budgetRawData, getDefaultSheetName(months));
  }, [budgetRawData]);

  // Load hidden state from cookies when component mounts
  useEffect(() => {
    const savedHiddenGoals = Cookies.get('goals-hidden-state');
    if (savedHiddenGoals) {
      try {
        const parsedHiddenGoals = JSON.parse(savedHiddenGoals);
        setHiddenGoals(parsedHiddenGoals);
      } catch (error) {
        console.error('Error parsing hidden goals state from cookies:', error);
      }
    }

    const savedHiddenBudgets = Cookies.get('budget-hidden-state');
    if (savedHiddenBudgets) {
      try {
        const parsedHiddenBudgets = JSON.parse(savedHiddenBudgets);
        setHiddenBudgets(parsedHiddenBudgets);
      } catch (error) {
        console.error('Error parsing hidden budgets state from cookies:', error);
      }
    }

    const savedHiddenCategories = Cookies.get('budget-category-hidden-state');
    if (savedHiddenCategories) {
      try {
        const parsedHiddenCategories = JSON.parse(savedHiddenCategories);
        setHiddenCategories(parsedHiddenCategories);
      } catch (error) {
        console.error('Error parsing hidden categories state from cookies:', error);
      }
    }
  }, []);

  // Get all hidden goals with their details
  const getHiddenGoalsList = () => {
    if (!goalsData) return [];
    
    const hiddenGoalsList = [];
    
    goalsData.forEach((goal, index) => {
      const goalName = goal['Saving'] || goal[' Saving '] || goal['Saving '] || goal[' Saving'] || goal['Investment'] || goal[' Investment '] || goal['Investment '] || goal[' Investment'];
      const category = goalName ? (goal['Saving'] || goal[' Saving '] || goal['Saving '] || goal[' Saving'] ? 'Saving' : 'Investing') : 'Saving';
      const goalId = `${category}-${goalName || index}`;
      
      if (hiddenGoals[goalId]) {
        hiddenGoalsList.push({
          id: goalId,
          name: goalName,
          category: category,
          goal: goal
        });
      }
    });
    
    return hiddenGoalsList;
  };

  // Function to toggle hide/show individual goal
  const toggleGoalVisibility = (goalId) => {
    const newHiddenGoals = {
      ...hiddenGoals,
      [goalId]: !hiddenGoals[goalId]
    };
    
    setHiddenGoals(newHiddenGoals);
    
    // Save to cookies
    Cookies.set('goals-hidden-state', JSON.stringify(newHiddenGoals), { 
      expires: 365,
      sameSite: 'strict'
    });
  };

  // Function to toggle selection of a goal
  const toggleGoalSelection = (goalId) => {
    const newSelected = new Set(selectedGoals);
    if (newSelected.has(goalId)) {
      newSelected.delete(goalId);
    } else {
      newSelected.add(goalId);
    }
    setSelectedGoals(newSelected);
  };

  // Function to select all goals
  const selectAllGoals = () => {
    const hiddenGoalsList = getHiddenGoalsList();
    setSelectedGoals(new Set(hiddenGoalsList.map(item => item.id)));
  };

  // Function to deselect all goals
  const deselectAllGoals = () => {
    setSelectedGoals(new Set());
  };

  // Function to unhide selected goals
  const unhideSelectedGoals = () => {
    const newHiddenGoals = { ...hiddenGoals };
    selectedGoals.forEach(goalId => {
      delete newHiddenGoals[goalId];
    });
    
    setHiddenGoals(newHiddenGoals);
    setSelectedGoals(new Set());
    
    // Save to cookies
    Cookies.set('goals-hidden-state', JSON.stringify(newHiddenGoals), { 
      expires: 365,
      sameSite: 'strict'
    });
  };

  // Function to toggle selection of a budget item
  const toggleBudgetSelection = (budgetId) => {
    const newSelected = new Set(selectedBudgets);
    if (newSelected.has(budgetId)) {
      newSelected.delete(budgetId);
    } else {
      newSelected.add(budgetId);
    }
    setSelectedBudgets(newSelected);
  };

  // Function to toggle selection of a category
  const toggleCategorySelection = (categoryId) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId);
    } else {
      newSelected.add(categoryId);
    }
    setSelectedCategories(newSelected);
  };

  // Function to select all budget items
  const selectAllBudgets = () => {
    const hiddenBudgetsList = getHiddenBudgetsList();
    setSelectedBudgets(new Set(hiddenBudgetsList.map(item => item.id)));
  };

  // Function to select all categories
  const selectAllCategories = () => {
    const hiddenCategoriesList = getHiddenCategoriesList();
    setSelectedCategories(new Set(hiddenCategoriesList.map(item => item.id)));
  };

  // Function to deselect all budget items
  const deselectAllBudgets = () => {
    setSelectedBudgets(new Set());
  };

  // Function to deselect all categories
  const deselectAllCategories = () => {
    setSelectedCategories(new Set());
  };

  // Function to unhide selected budget items
  const unhideSelectedBudgets = () => {
    const newHiddenBudgets = { ...hiddenBudgets };
    selectedBudgets.forEach(budgetId => {
      delete newHiddenBudgets[budgetId];
    });
    
    setHiddenBudgets(newHiddenBudgets);
    setSelectedBudgets(new Set());
    
    // Save to cookies
    Cookies.set('budget-hidden-state', JSON.stringify(newHiddenBudgets), { 
      expires: 365,
      sameSite: 'strict'
    });
  };

  // Function to unhide selected categories
  const unhideSelectedCategories = () => {
    const newHiddenCategories = { ...hiddenCategories };
    selectedCategories.forEach(categoryId => {
      delete newHiddenCategories[categoryId];
    });
    
    setHiddenCategories(newHiddenCategories);
    setSelectedCategories(new Set());
    
    // Save to cookies
    Cookies.set('budget-category-hidden-state', JSON.stringify(newHiddenCategories), { 
      expires: 365,
      sameSite: 'strict'
    });
  };

  // Get all hidden budget items with their details
  const getHiddenBudgetsList = () => {
    if (!budgetData) return [];
    
    const hiddenBudgetsList = [];
    const usedKeys = new Set(); // Track keys that have been used
    
    // Process spending data
    Object.entries(budgetData.spending || {}).forEach(([key, value]) => {
      if (usedKeys.has(key)) return; // Skip if already processed
      
      // Find category for this budget item
      let categoryKey = null;
      for (const [catKey, catItems] of Object.entries(categories)) {
        if (catItems.some(item => item.toLowerCase() === key.toLowerCase())) {
          categoryKey = catKey;
          break;
        }
      }
      
      if (categoryKey) {
        const budgetId = `${categoryKey}-${key}`;
        if (hiddenBudgets[budgetId]) {
          hiddenBudgetsList.push({
            id: budgetId,
            name: key,
            category: categoryKey,
            budget: value
          });
        }
        usedKeys.add(key);
      }
    });

    // Process transfer data
    Object.entries(budgetData.transfer || {}).forEach(([key, value]) => {
      if (usedKeys.has(key)) return; // Skip if already processed
      
      // Find category for this budget item
      let categoryKey = null;
      for (const [catKey, catItems] of Object.entries(categories)) {
        if (catItems.some(item => item.toLowerCase() === key.toLowerCase())) {
          categoryKey = catKey;
          break;
        }
      }
      
      if (categoryKey) {
        const budgetId = `${categoryKey}-${key}`;
        if (hiddenBudgets[budgetId]) {
          hiddenBudgetsList.push({
            id: budgetId,
            name: key,
            category: categoryKey,
            budget: value
          });
        }
        usedKeys.add(key);
      }
    });

    // Process spendingTF data
    Object.entries(budgetData.spendingTF || {}).forEach(([key, value]) => {
      if (usedKeys.has(key)) return; // Skip if already processed
      
      // Find category for this budget item
      let categoryKey = null;
      for (const [catKey, catItems] of Object.entries(categories)) {
        if (catItems.some(item => item.toLowerCase() === key.toLowerCase())) {
          categoryKey = catKey;
          break;
        }
      }
      
      if (categoryKey) {
        const budgetId = `${categoryKey}-${key}`;
        if (hiddenBudgets[budgetId]) {
          hiddenBudgetsList.push({
            id: budgetId,
            name: key,
            category: categoryKey,
            budget: value
          });
        }
        usedKeys.add(key);
      }
    });
    
    return hiddenBudgetsList;
  };

  // Get all hidden categories with their details
  const getHiddenCategoriesList = () => {
    const hiddenCategoriesList = [];
    
    Object.entries(categories).forEach(([categoryKey, categoryItems]) => {
      if (hiddenCategories[categoryKey]) {
        hiddenCategoriesList.push({
          id: categoryKey,
          name: categoryKey,
          items: categoryItems
        });
      }
    });
    
    return hiddenCategoriesList;
  };

  const hiddenGoalsList = getHiddenGoalsList();
  const hiddenBudgetsList = getHiddenBudgetsList();
  const hiddenCategoriesList = getHiddenCategoriesList();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-3 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link 
                href="/goals"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Settings</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-3 py-6 pb-24">
        {/* Hidden Goals Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Hidden Goals Management</h2>
            <p className="text-sm text-gray-600">
              Manage your hidden goals. You can unhide individual goals or select multiple goals to unhide them all at once.
            </p>
          </div>

          {isLoading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-red-600 font-semibold">Error loading goals</p>
              <p className="text-gray-600 text-sm mt-2">Please try again later</p>
            </div>
          ) : hiddenGoalsList.length === 0 ? (
            <div className="p-6 text-center">
              <div className="text-gray-400 text-6xl mb-4">👁️</div>
              <p className="text-gray-600 font-semibold">No hidden goals</p>
              <p className="text-gray-500 text-sm mt-2">All your goals are currently visible</p>
            </div>
          ) : (
            <div className="p-6">
              {/* Bulk Actions */}
              <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {selectedGoals.size} of {hiddenGoalsList.length} selected
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={selectAllGoals}
                    className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors duration-200"
                  >
                    Select All
                  </button>
                  <button
                    onClick={deselectAllGoals}
                    className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors duration-200"
                  >
                    Deselect All
                  </button>
                  {selectedGoals.size > 0 && (
                    <button
                      onClick={unhideSelectedGoals}
                      className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors duration-200"
                    >
                      Unhide Selected ({selectedGoals.size})
                    </button>
                  )}
                </div>
              </div>

              {/* Goals List */}
              <div className="space-y-2">
                {hiddenGoalsList.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer -mx-2"
                    onClick={() => toggleGoalSelection(item.id)}
                    title="Click to select/deselect this goal"
                  >
                    <input
                      type="checkbox"
                      checked={selectedGoals.has(item.id)}
                      onChange={() => toggleGoalSelection(item.id)}
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 pointer-events-none"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {(() => {
                            const goal = item.goal;
                            const collected = parseFloat(goal.Collected || goal[' Collected '] || goal['Collected '] || goal[' Collected']) || 0;
                            const target = parseFloat(goal.Target || goal[' Target '] || goal['Target '] || goal[' Target']) || 0;
                            const percentage = target > 0 ? (collected / target) * 100 : 0;
                            return `${percentage.toFixed(0)}%`;
                          })()}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.category === 'Saving' 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-green-100 text-green-600'
                        }`}>
                          {item.category}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleGoalVisibility(item.id);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      title="Unhide this goal"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Hidden Budgets Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mt-6">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Hidden Budgets Management</h2>
            <p className="text-sm text-gray-600">
              Manage your hidden budget items. You can unhide individual items or select multiple items to unhide them all at once.
            </p>
          </div>

          {isBudgetLoading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : budgetError ? (
            <div className="p-6 text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-red-600 font-semibold">Error loading budgets</p>
              <p className="text-gray-600 text-sm mt-2">Please try again later</p>
            </div>
          ) : hiddenBudgetsList.length === 0 ? (
            <div className="p-6 text-center">
              <div className="text-gray-400 text-6xl mb-4">💰</div>
              <p className="text-gray-600 font-semibold">No hidden budget items</p>
              <p className="text-gray-500 text-sm mt-2">All your budget items are currently visible</p>
            </div>
          ) : (
            <div className="p-6">
              {/* Bulk Actions */}
              <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {selectedBudgets.size} of {hiddenBudgetsList.length} selected
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={selectAllBudgets}
                    className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors duration-200"
                  >
                    Select All
                  </button>
                  <button
                    onClick={deselectAllBudgets}
                    className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors duration-200"
                  >
                    Deselect All
                  </button>
                  {selectedBudgets.size > 0 && (
                    <button
                      onClick={unhideSelectedBudgets}
                      className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors duration-200"
                    >
                      Unhide Selected ({selectedBudgets.size})
                    </button>
                  )}
                </div>
              </div>

              {/* Budget Items List */}
              <div className="space-y-2">
                {hiddenBudgetsList.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer -mx-2"
                    onClick={() => toggleBudgetSelection(item.id)}
                    title="Click to select/deselect this budget item"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBudgets.has(item.id)}
                      onChange={() => toggleBudgetSelection(item.id)}
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 pointer-events-none"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {toProperCase(item.name)}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {(() => {
                            const budget = item.budget;
                            const actual = Math.abs(parseFloat(budget.actual) || 0);
                            const planned = Math.abs(parseFloat(budget.budget) || 0);
                            const percentage = planned > 0 ? (actual / planned) * 100 : 0;
                            return `${percentage.toFixed(0)}%`;
                          })()}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.category === 'eating' ? 'bg-orange-100 text-orange-600' :
                          item.category === 'living' ? 'bg-blue-100 text-blue-600' :
                          item.category === 'saving' ? 'bg-green-100 text-green-600' :
                          item.category === 'investing' ? 'bg-purple-100 text-purple-600' :
                          item.category === 'giving' ? 'bg-red-100 text-red-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {toProperCase(item.category)}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Extract category and subcategory from budgetId
                        const [categoryKey, subCategory] = item.id.split('-');
                        // Create the toggle function call similar to budgets page
                        const newHiddenBudgets = { ...hiddenBudgets };
                        delete newHiddenBudgets[item.id];
                        setHiddenBudgets(newHiddenBudgets);
                        Cookies.set('budget-hidden-state', JSON.stringify(newHiddenBudgets), { 
                          expires: 365,
                          sameSite: 'strict'
                        });
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      title="Unhide this budget item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Hidden Categories Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mt-6">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Hidden Categories Management</h2>
            <p className="text-sm text-gray-600">
              Manage your hidden budget categories. You can unhide entire categories to show all their items.
            </p>
          </div>

          {hiddenCategoriesList.length === 0 ? (
            <div className="p-6 text-center">
              <div className="text-gray-400 text-6xl mb-4">📊</div>
              <p className="text-gray-600 font-semibold">No hidden categories</p>
              <p className="text-gray-500 text-sm mt-2">All your budget categories are currently visible</p>
            </div>
          ) : (
            <div className="p-6">
              {/* Bulk Actions */}
              <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {selectedCategories.size} of {hiddenCategoriesList.length} selected
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={selectAllCategories}
                    className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors duration-200"
                  >
                    Select All
                  </button>
                  <button
                    onClick={deselectAllCategories}
                    className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors duration-200"
                  >
                    Deselect All
                  </button>
                  {selectedCategories.size > 0 && (
                    <button
                      onClick={unhideSelectedCategories}
                      className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors duration-200"
                    >
                      Unhide Selected ({selectedCategories.size})
                    </button>
                  )}
                </div>
              </div>

              {/* Categories List */}
              <div className="space-y-2">
                {hiddenCategoriesList.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer -mx-2"
                    onClick={() => toggleCategorySelection(item.id)}
                    title="Click to select/deselect this category"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.has(item.id)}
                      onChange={() => toggleCategorySelection(item.id)}
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 pointer-events-none"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {toProperCase(item.name)}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {(() => {
                            if (!budgetData) return '0%';
                            
                            // Use the same logic as budgets page to calculate category totals
                            const categoryKey = item.name.toLowerCase();
                            
                            // Create groupedBudgetData using the same logic as budgets page
                            const groupedBudgetData = (() => {
                              const usedKeys = new Set();
                              
                              const getCategoryForKey = (key) => {
                                if (categories.eating.some(cat => cat.toLowerCase() === key.toLowerCase())) return 'eating';
                                if (categories.living.some(cat => cat.toLowerCase() === key.toLowerCase())) return 'living';
                                if (categories.giving.some(cat => cat.toLowerCase() === key.toLowerCase())) return 'giving';
                                if (categories.saving.some(cat => cat.toLowerCase() === key.toLowerCase())) return 'saving';
                                if (categories.investing.some(cat => cat.toLowerCase() === key.toLowerCase())) return 'investing';
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
                            })();
                            
                            // Calculate totals for this category using the same logic as budgets page
                            const categoryData = groupedBudgetData[categoryKey] || {};
                            const visibleItems = Object.entries(categoryData);
                            
                            const totalBudget = visibleItems.reduce((sum, [_, item]) => sum + Math.abs(item.budget), 0);
                            const totalSpent = visibleItems.reduce((sum, [_, item]) => sum + Math.abs(item.actual), 0);
                            const percentageUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
                            
                            return `${percentageUsed.toFixed(0)}%`;
                          })()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.items.length} items
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Unhide this category
                        const newHiddenCategories = { ...hiddenCategories };
                        delete newHiddenCategories[item.id];
                        setHiddenCategories(newHiddenCategories);
                        Cookies.set('budget-category-hidden-state', JSON.stringify(newHiddenCategories), { 
                          expires: 365,
                          sameSite: 'strict'
                        });
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      title="Unhide this category"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PWA Settings Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mt-6">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">PWA Settings</h2>
            <p className="text-sm text-gray-600">
              Manage Progressive Web App cache and service worker settings.
            </p>
          </div>

          <div className="p-6 pt-0">
            <ClearCache />
          </div>
        </div>
      </div>
    </main>
  );
}
