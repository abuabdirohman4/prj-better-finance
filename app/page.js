"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTransactions, useAccounts, useAssets } from "@/utils/hooks";
import { months } from "@/utils/constants";
import { formatCurrency, getCashValue } from "@/utils/helper";
import { getTotalAssets } from "@/app/assets/utils";
import { getDefaultSheetName } from "@/utils/google";
import { AccountWithComparison } from "@/components/Card";
import Cookies from "js-cookie";

export default function Home() {
    const selectedMonth = getDefaultSheetName(months);
    
    // Staggered loading to reduce concurrent load on cold start
    const {
        data: transactionData,
        isLoading,
        error,
    } = useTransactions(selectedMonth);
    
    // Delay accounts loading by 500ms
    const { data: accountData, isLoading: accountsLoading } = useAccounts(500);
    
    // Delay assets loading by 1000ms
    const { data: assetData, isLoading: assetsLoading } = useAssets(1000);
    const totalAssets = getTotalAssets(assetData || []);

    // State for hiding/showing total assets
    const [isAssetsHidden, setIsAssetsHidden] = useState(true);

    // Load hide state from cookies when component mounts
    useEffect(() => {
        const savedHideState = Cookies.get("home-assets-hidden");
        if (savedHideState) {
            try {
                setIsAssetsHidden(JSON.parse(savedHideState));
            } catch (error) {
                console.error(
                    "Error parsing assets hide state from cookies:",
                    error
                );
            }
        }
    }, []);

    // Function to toggle hide/show and save to cookies
    const toggleAssetsVisibility = () => {
        const newState = !isAssetsHidden;
        setIsAssetsHidden(newState);

        // Save to cookies
        Cookies.set("home-assets-hidden", JSON.stringify(newState), {
            expires: 365,
            sameSite: "strict",
        });
    };

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
                    {/* Top Row - User Profile and Settings */}
                    <div className="flex items-center justify-between mb-4">
                        {/* User Profile */}
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                                <span className="text-white font-bold text-white">
                                    AA
                                </span>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">
                                    ABU ABDIROHMAN
                                </h2>
                                <div className="flex items-center space-x-2 text-blue-200 text-sm">
                                    <span>Software Engineer</span>
                                </div>
                            </div>
                        </div>

                        {/* Settings Button */}
                        <Link
                            href="/settings"
                            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all duration-200"
                            title="Settings"
                        >
                            <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Financial Summary Cards */}
            <div className="px-3 mt-6 mb-8 pt-24">
                <div className="grid grid-cols-1 gap-4">
                    {/* Total Assets Card */}
                    <Link href="/assets" className="block">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200 cursor-pointer">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Total Assets
                                </h2>
                                <div className="flex items-center space-x-2">
                                    {/* Hide/Show Toggle Button */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            toggleAssetsVisibility();
                                        }}
                                        className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                        title={
                                            isAssetsHidden
                                                ? "Show amount"
                                                : "Hide amount"
                                        }
                                    >
                                        {isAssetsHidden ? (
                                            <svg
                                                className="w-5 h-5 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                className="w-5 h-5 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                                />
                                            </svg>
                                        )}
                                    </button>

                                    {/* Asset Icon */}
                                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                                        <svg
                                            className="w-8 h-8 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-2">
                                {assetsLoading ? (
                                    <div className="animate-pulse bg-gray-200 h-10 w-32 rounded"></div>
                                ) : isAssetsHidden ? (
                                    <span className="text-3xl">
                                        {formatCurrency(totalAssets).replace(
                                            /[0-9.,]/g,
                                            "*"
                                        )}
                                    </span>
                                ) : (
                                    formatCurrency(totalAssets)
                                )}
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Top Accounts */}
            <div className="px-3 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Top Used Accounts
                    </h3>
                    <Link
                        href="/accounts"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium mr-2"
                    >
                        View All
                    </Link>
                </div>
                {accountsLoading ? (
                    <div className="grid grid-cols-3 gap-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-3"
                            >
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
                        {accountData &&
                            accountData
                                .filter((account) =>
                                    ["Wallet", "Mandiri", "BCA"].includes(
                                        account.name
                                    )
                                )
                                .map((account) => (
                                    <AccountWithComparison
                                        key={account.name}
                                        account={account}
                                    />
                                ))}
                    </div>
                )}
            </div>

            {/* Recent Activity Preview */}
            <div className="px-3 pb-24">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Recent Transactions
                        </h3>
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
                            {transactionData
                                .slice(0, 3)
                                .map((transaction, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                transaction.Transaction ===
                                                "Spending"
                                                    ? "bg-red-100 text-red-600"
                                                    : "bg-green-100 text-green-600"
                                            }`}
                                        >
                                            {transaction.Transaction ===
                                            "Spending" ? (
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17 13l-5 5m0 0l-5-5m5 5V6"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M7 11l5-5m0 0l5 5m-5-5v12"
                                                    />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {transaction.Note ||
                                                    transaction[
                                                        "Category or Account"
                                                    ]}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {transaction.Date} •{" "}
                                                {
                                                    transaction[
                                                        "Category or Account"
                                                    ]
                                                }
                                            </p>
                                        </div>
                                        <div
                                            className={`text-sm font-semibold ${
                                                transaction.Transaction ===
                                                "Spending"
                                                    ? "text-red-600"
                                                    : "text-green-600"
                                            }`}
                                        >
                                            {transaction.Transaction ===
                                            "Spending"
                                                ? "-"
                                                : "+"}
                                            {formatCurrency(
                                                Math.abs(
                                                    getCashValue(transaction)
                                                ),
                                                "brackets"
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-sm">
                                No transactions yet
                            </p>
                            <p className="text-gray-400 text-xs">
                                Start by adding your first transaction
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
