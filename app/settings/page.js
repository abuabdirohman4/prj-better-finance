"use client";
import { useState, useEffect } from "react";
import { useGoals } from "@/utils/hooks";
import Cookies from 'js-cookie';
import Link from 'next/link';

export default function Settings() {
  const { data: goalsData, isLoading, error } = useGoals();
  const [hiddenGoals, setHiddenGoals] = useState({});
  const [selectedGoals, setSelectedGoals] = useState(new Set());

  // Load hidden goals from cookies when component mounts
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

  const hiddenGoalsList = getHiddenGoalsList();

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
                    className="flex items-center space-x-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer -m-2"
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
      </div>
    </main>
  );
}
