"use client";
import { useState, useEffect } from "react";
import { useGoals } from "@/utils/hooks";
import Goal from "@/components/Card/Goal";
import Cookies from 'js-cookie';
import { formatCurrency, getGoalColors } from "@/utils/helper";

export default function Goals() {
  const { data: goalsData, isLoading, error } = useGoals();
  const [collapsedTypes, setCollapsedTypes] = useState({
    Saving: true,
    Investing: true
  });
  const [hiddenGoals, setHiddenGoals] = useState({});

  useEffect(() => {
    const savedCollapseState = Cookies.get('goals-collapse-state');
    if (savedCollapseState) {
      try {
        const parsedState = JSON.parse(savedCollapseState);
        setCollapsedTypes(prev => ({
          ...prev,
          ...parsedState
        }));
      } catch (error) {
        console.error('Error parsing collapse state from cookies:', error);
      }
    }

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

  const toggleType = (typeKey) => {
    const newState = {
      ...collapsedTypes,
      [typeKey]: !collapsedTypes[typeKey]
    };
    
    setCollapsedTypes(newState);
    Cookies.set('goals-collapse-state', JSON.stringify(newState), { 
      expires: 365,
      sameSite: 'strict'
    });
  };

  const toggleGoalVisibility = (goalId) => {
    const newHiddenGoals = {
      ...hiddenGoals,
      [goalId]: !hiddenGoals[goalId]
    };
    
    setHiddenGoals(newHiddenGoals);
    Cookies.set('goals-hidden-state', JSON.stringify(newHiddenGoals), { 
      expires: 365,
      sameSite: 'strict'
    });
  };

  const groupedGoals = goalsData ? (() => {
    const groups = {
      Saving: [],
      Investing: []
    };
    
    goalsData.forEach((goal, index) => {
      const type = goal.Type || goal[' Type '] || goal['Type '] || goal[' Type'] || 
                   goal['Type'] || goal[' Type '] || goal['Type '] || goal[' Type'];
      const cleanType = type ? type.trim() : '';
      
      if (cleanType === 'Sinking' || cleanType === 'Wishlist') {
        groups.Saving.push(goal);
      } else if (cleanType === 'Business' || cleanType === 'Emergency' || cleanType === 'Investment') {
        groups.Investing.push(goal);
      }
    });
    
    return Object.fromEntries(
      Object.entries(groups).filter(([_, goals]) => goals.length > 0)
    );
  })() : {};

  const calculateTotals = (goals, category) => {
    return goals.reduce((totals, goal, index) => {
      const collected = parseFloat(goal.Collected || goal[' Collected '] || goal['Collected '] || goal[' Collected']) || 0;
      const target = parseFloat(goal.Target || goal[' Target '] || goal['Target '] || goal[' Target']) || 0;
      const monthly = parseFloat(goal.Monthly || goal[' Monthly '] || goal['Monthly '] || goal[' Monthly']) || 0;
      
      totals.totalCollected += collected;
      totals.totalTarget += target;
      totals.totalMonthly += monthly;
      
      return totals;
    }, { totalCollected: 0, totalTarget: 0, totalMonthly: 0 });
  };

  const getSectionIcon = (category) => {
    switch (category) {
      case 'Saving':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        );
      case 'Investing':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
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
              <h1 className="text-2xl font-bold text-white mb-1">Goals</h1>
              <p className="text-blue-100 text-sm">Track your financial goals</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 mt-6 mb-8">
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Overall Goals Progress</h2>
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Collected</p>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(goalsData ? goalsData.reduce((sum, goal) => sum + (parseFloat(goal.Collected || goal[' Collected '] || goal['Collected '] || goal[' Collected']) || 0), 0) : 0)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Target</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(goalsData ? goalsData.reduce((sum, goal) => sum + (parseFloat(goal.Target || goal[' Target '] || goal['Target '] || goal[' Target']) || 0), 0) : 0)}
                </p>
              </div>
            </div>
            
            {goalsData && goalsData.length > 0 && (() => {
              const totalCollected = goalsData.reduce((sum, goal) => sum + (parseFloat(goal.Collected || goal[' Collected '] || goal['Collected '] || goal[' Collected']) || 0), 0);
              const totalTarget = goalsData.reduce((sum, goal) => sum + (parseFloat(goal.Target || goal[' Target '] || goal['Target '] || goal[' Target']) || 0), 0);
              const overallProgress = totalTarget > 0 ? (totalCollected / totalTarget) * 100 : 0;
              const colors = getGoalColors(overallProgress);
              
              return (
                <div className="mt-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-200 ease-out ${colors.progress}`}
                        style={{ 
                          width: `${Math.min(overallProgress, 100)}%` 
                        }}
                      ></div>
                    </div>
                    <span className={`text-sm font-semibold ${colors.text}`}>
                      {overallProgress.toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      <div className="px-3 pb-24">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 pb-0 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">Financial Goals</h3>
          </div>
          
          <div className="p-6">
            {isLoading ? (
              <div className="space-y-4">
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
              <div className="text-center py-8">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <p className="text-red-600 font-semibold">Error loading goals</p>
                <p className="text-gray-600 text-sm mt-2">Please try again later</p>
              </div>
            ) : goalsData && Array.isArray(goalsData) && goalsData.length > 0 ? (
              <div className="space-y-6">
                {Object.keys(groupedGoals).map((category) => {
                  const goals = groupedGoals[category];
                  const totals = calculateTotals(goals, category);
                  const overallProgress = totals.totalTarget > 0 ? (totals.totalCollected / totals.totalTarget) * 100 : 0;

                  return (
                    <div key={category} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div 
                        className="relative cursor-pointer p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-200"
                        onClick={() => toggleType(category)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 bg-gradient-to-r from-blue-500 to-blue-600`}>
                              <div className="text-white">
                                {getSectionIcon(category)}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">
                                {category === 'Saving' ? 'Saving' : 
                                 category === 'Investing' ? 'Investment' : category}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {goals.length} goal{goals.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                {formatCurrency(totals.totalCollected, 'short')} / {formatCurrency(totals.totalTarget, 'short')}
                              </p>
                            </div>
                            
                            <div className="flex-shrink-0">
                              <svg 
                                className={`w-5 h-5 text-gray-600 transition-all duration-200 ease-out md:duration-500 md:ease-in-out transform-gpu ${
                                  collapsedTypes[category] ? 'rotate-180 md:scale-110 scale-100' : 'rotate-0 scale-100'
                                }`}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-200 ease-out ${getGoalColors(overallProgress).progress}`}
                              style={{ width: `${Math.min(overallProgress, 100)}%` }}
                            ></div>
                          </div>
                          <span className={`text-sm font-medium ${getGoalColors(overallProgress).text}`}>
                            {overallProgress.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className={`overflow-hidden transition-all duration-500 ease-in-out md:duration-500 duration-200 ${
                        collapsedTypes[category] 
                          ? 'max-h-0 opacity-0 scale-95 transform-gpu md:scale-95 scale-100' 
                          : 'max-h-[5000px] opacity-100 scale-100 transform-gpu'
                      }`}>
                        <div className={`p-4 bg-gray-50 space-y-3 transition-all duration-500 ease-in-out md:duration-500 duration-200 ${
                          collapsedTypes[category] 
                            ? 'transform -translate-y-2 opacity-0 md:-translate-y-2 translate-y-0' 
                            : 'transform translate-y-0 opacity-100'
                        }`}>
                          {goals
                            .filter(goal => {
                              const goalId = `${category}-${goal['Saving'] || goal[' Saving '] || goal['Saving '] || goal[' Saving'] || goal['Investment'] || goal[' Investment '] || goal['Investment '] || goal[' Investment'] || index}`;
                              return !hiddenGoals[goalId];
                            })
                            .map((goal, index) => {
                              const goalId = `${category}-${goal['Saving'] || goal[' Saving '] || goal['Saving '] || goal[' Saving'] || goal['Investment'] || goal[' Investment '] || goal['Investment '] || goal[' Investment'] || index}`;
                              return (
                                <Goal
                                  key={goalId}
                                  goal={goal}
                                  isHidden={hiddenGoals[goalId] || false}
                                  onToggleVisibility={() => toggleGoalVisibility(goalId)}
                                />
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-6xl mb-4">🎯</div>
                <p className="text-gray-600 font-semibold">No goals found</p>
                <p className="text-gray-500 text-sm mt-2">You haven&apos;t set any financial goals yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
