"use client";
import Link from "next/link";
import { useAssets } from "@/utils/hooks";
import { formatCurrency } from "@/utils/helper";
import { getTotalAssets } from "./utils";
import AssetCard from "@/components/Card/Asset";

export default function Assets() {
    const { data: assetData, isLoading, error } = useAssets();

    // Calculate total assets
    const totalAssets = getTotalAssets(assetData || []);

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-3 pt-5 pb-4">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
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
                        ></path>
                    </svg>
                </div>
                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-4">
                        <Link
                            href="/"
                            className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
                        >
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-1">
                                Assets
                            </h1>
                            <p className="text-blue-100 text-sm">
                                Track your financial assets
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Total Assets Card */}
            <div className="px-3 mt-6 mb-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Total Assets
                        </h2>
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
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                        {formatCurrency(totalAssets)}
                    </div>
                    <div className="text-sm text-gray-500">
                        Across {assetData?.length || 0} assets
                    </div>
                </div>
            </div>

            {/* Assets Grid */}
            <div className="px-3 pb-24">
                {isLoading ? (
                    <div className="grid grid-cols-3 gap-3">
                        {/* Skeleton for asset cards */}
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                    <div className="p-3">
                                        <div className="flex flex-col items-center mb-1">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full mb-1"></div>
                                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-200 px-3 py-1.5">
                                        <div className="h-3 bg-gray-300 rounded w-12 mx-auto"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="w-10 h-10 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Error loading assets
                        </h3>
                        <p className="text-gray-500 text-sm">
                            Failed to fetch asset data. Please try again later.
                        </p>
                    </div>
                ) : assetData && assetData.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3">
                        {assetData.map((asset, index) => (
                            <AssetCard key={index} asset={asset} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="w-10 h-10 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No assets found
                        </h3>
                        <p className="text-gray-500 text-sm">
                            No assets available to display.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
