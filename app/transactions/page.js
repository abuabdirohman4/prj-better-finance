"use client";
import { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { months } from "@/utils/constants";
import { useTransactions } from "@/utils/hooks";
import Transaction from "@/components/Card/Transaction";
import TransactionFilter from "@/components/TransactionFilter";
import {
    formatDate,
    formatCurrency,
    getCashValue,
    getTotalCashGroupedByDate,
    getTotalExpensesWithTransfers,
} from "@/utils/helper";
import { getDefaultSheetName } from "@/utils/google";
import { groupTransactionsByDate } from "./utils";

function TransactionsContent() {
    const searchParams = useSearchParams();
    const [selectedMonth, setSelectedMonth] = useState(
        getDefaultSheetName(months)
    );
    const [allMonthsData, setAllMonthsData] = useState({});
    const [isLoadingAllMonths, setIsLoadingAllMonths] = useState(false);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [activeFilters, setActiveFilters] = useState({});
    const [showFilters, setShowFilters] = useState(false);

    // Handle URL parameters for category and week filtering
    useEffect(() => {
        const categoryParam = searchParams.get("category");
        const weekParam = searchParams.get("week");

        const filters = {};
        if (categoryParam) {
            filters.category = decodeURIComponent(categoryParam);
        }
        if (weekParam) {
            filters.week = decodeURIComponent(weekParam);
        }

        if (Object.keys(filters).length > 0) {
            setActiveFilters(filters);
            setShowFilters(true);
        }
    }, [searchParams]);

    // Use SWR hook for data fetching (consistent with budgets page)
    const {
        data: transactionData,
        isLoading,
        error,
    } = useTransactions(selectedMonth === "All Months" ? null : selectedMonth);

    // Fetch all months data when "All Months" is selected
    useEffect(() => {
        if (selectedMonth === "All Months") {
            setIsLoadingAllMonths(true);
            const fetchAllMonthsData = async () => {
                const data = {};

                for (const month of months) {
                    try {
                        const response = await fetch(
                            `/api/transactions?sheet=${encodeURIComponent(month)}&t=${Date.now()}&force=true`,
                            {
                                headers: {
                                    "Cache-Control":
                                        "no-cache, no-store, must-revalidate",
                                    Pragma: "no-cache",
                                    Expires: "0",
                                },
                            }
                        );
                        if (response.ok) {
                            const result = await response.json();
                            data[month] = result.data || [];
                        } else {
                            data[month] = [];
                        }
                    } catch (error) {
                        console.error(
                            `Error fetching data for ${month}:`,
                            error
                        );
                        data[month] = [];
                    }
                }

                setAllMonthsData(data);
                setIsLoadingAllMonths(false);
            };

            fetchAllMonthsData();
        } else {
            // Clear all months data when switching to single month
            setAllMonthsData({});
        }
    }, [selectedMonth]);

    // Get current data source (single month or all months)
    const currentDataSource = useMemo(() => {
        if (selectedMonth === "All Months") {
            // Combine all months data into single array
            const allTransactions = [];
            Object.values(allMonthsData).forEach((monthTransactions) => {
                if (Array.isArray(monthTransactions)) {
                    allTransactions.push(...monthTransactions);
                }
            });
            return allTransactions;
        }
        return transactionData || [];
    }, [selectedMonth, allMonthsData, transactionData]);

    // Filter transactions by week if week filter is active
    const weekFilteredTransactions = useMemo(() => {
        if (!currentDataSource || !activeFilters.week) {
            return currentDataSource || [];
        }

        const weekRange = activeFilters.week.split("|");
        if (weekRange.length !== 2) {
            return currentDataSource;
        }

        const [startDateStr, endDateStr] = weekRange;

        // Parse dates (format: YYYY-MM-DD from weekly budget)
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);

        const filtered = currentDataSource.filter((transaction) => {
            // Parse transaction date (DD/MM/YYYY format)
            const [day, month, year] = transaction.Date.split("/");
            const transactionDate = new Date(year, month - 1, day);

            // Check if transaction date is within week range
            return transactionDate >= startDate && transactionDate <= endDate;
        });

        return filtered;
    }, [currentDataSource, activeFilters.week]);

    // Group filtered transactions by date
    const groupedTransactions = useMemo(() => {
        if (filteredTransactions.length > 0) {
            return groupTransactionsByDate(filteredTransactions);
        }
        // If we have week filtering but no category filtering, use week-filtered data
        if (activeFilters.week && !showFilters) {
            return groupTransactionsByDate(weekFilteredTransactions);
        }
        return currentDataSource
            ? groupTransactionsByDate(currentDataSource)
            : {};
    }, [
        filteredTransactions,
        currentDataSource,
        weekFilteredTransactions,
        activeFilters.week,
        showFilters,
    ]);

    // Calculate financial data with proper type checking (use filtered data for calculations)
    const displayTransactions = useMemo(() => {
        if (filteredTransactions.length > 0) {
            return filteredTransactions;
        }
        // If we have week filtering but no category filtering, use week-filtered data
        if (activeFilters.week && !showFilters) {
            return weekFilteredTransactions;
        }
        return currentDataSource || [];
    }, [
        filteredTransactions,
        currentDataSource,
        weekFilteredTransactions,
        activeFilters.week,
        showFilters,
    ]);

    const spending = getTotalExpensesWithTransfers(displayTransactions);
    const earning = getTotalCashGroupedByDate(displayTransactions, "Earning");
    const balance = earning + spending;

    const handleFilteredTransactions = useCallback((transactions) => {
        setFilteredTransactions(transactions);
    }, []);

    const handleFilterChange = useCallback(
        (filters) => {
            // Preserve week filter if it exists in activeFilters but not in new filters
            const updatedFilters = { ...filters };
            if (activeFilters.week && !filters.week) {
                updatedFilters.week = activeFilters.week;
            }
            setActiveFilters(updatedFilters);
        },
        [activeFilters.week]
    );

    const toggleFilters = () => {
        if (showFilters) {
            // When hiding filters, preserve week filter but clear others
            setFilteredTransactions([]);
            const preservedFilters = {};
            if (activeFilters.week) {
                preservedFilters.week = activeFilters.week;
            }
            setActiveFilters(preservedFilters);
        }
        setShowFilters(!showFilters);
    };

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
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
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
                                    Transactions
                                </h1>
                                <p className="text-blue-100 text-sm">
                                    Track your financial activities
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <select
                                id="month"
                                className="appearance-none bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 pr-10 cursor-pointer hover:bg-white/30 transition-all duration-200"
                                value={selectedMonth}
                                onChange={(e) =>
                                    setSelectedMonth(e.target.value)
                                }
                            >
                                <option
                                    value="All Months"
                                    className="text-gray-800 bg-white"
                                >
                                    All Months
                                </option>
                                {months.map((month) => (
                                    <option
                                        key={month}
                                        value={month}
                                        className="text-gray-800 bg-white"
                                    >
                                        {month}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <svg
                                    className="w-4 h-4 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="px-3 mt-6 mb-4">
                <div className="grid grid-cols-1 gap-4">
                    {/* Net Balance Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Net Balance
                            </h2>
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
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
                                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                            {formatCurrency(balance, "signs")}
                        </div>
                    </div>

                    {/* Income & Expense Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Income Card */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl border border-green-200 p-4">
                            <div className="flex items-center mb-3">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                    <svg
                                        className="w-4 h-4 text-white"
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
                                </div>
                                <span className="text-sm font-medium text-green-800">
                                    Earning
                                </span>
                            </div>
                            <div className="text-xl font-bold text-green-900">
                                {formatCurrency(earning, "brackets")}
                            </div>
                        </div>

                        {/* Expense Card */}
                        <div className="bg-gradient-to-br from-red-50 to-rose-100 rounded-2xl border border-red-200 p-4">
                            <div className="flex items-center mb-3">
                                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                                    <svg
                                        className="w-4 h-4 text-white"
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
                                </div>
                                <span className="text-sm font-medium text-red-800">
                                    Spending
                                </span>
                            </div>
                            <div className="text-xl font-bold text-red-900">
                                {formatCurrency(-spending, "brackets")}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction Filter */}
            {currentDataSource &&
                currentDataSource.length > 0 &&
                showFilters && (
                    <div className="px-3 mb-6">
                        <TransactionFilter
                            transactions={
                                activeFilters.week
                                    ? weekFilteredTransactions
                                    : currentDataSource
                            }
                            onFilteredTransactions={handleFilteredTransactions}
                            onFilterChange={handleFilterChange}
                            initialFilters={activeFilters}
                        />
                    </div>
                )}

            {/* Transactions List */}
            <div className="px-3 pb-24">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6 pb-3 px-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900">
                                Transaction
                            </h3>
                            {currentDataSource &&
                                currentDataSource.length > 0 && (
                                    <button
                                        onClick={toggleFilters}
                                        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                                            />
                                        </svg>
                                        <span>
                                            {showFilters
                                                ? "Hide Filters"
                                                : "Show Filters"}
                                        </span>
                                    </button>
                                )}
                        </div>
                    </div>

                    <div className="p-3">
                        {isLoading ||
                        (selectedMonth === "All Months" &&
                            isLoadingAllMonths) ? (
                            <div className="space-y-4">
                                {/* Skeleton for transactions */}
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
                                    Error loading transactions
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    Failed to fetch transactions for{" "}
                                    {selectedMonth}. Please try again later.
                                </p>
                            </div>
                        ) : filteredTransactions.length > 0 ? (
                            <div className="space-y-6">
                                {Object.keys(groupedTransactions).length > 0 ? (
                                    Object.keys(groupedTransactions)
                                        .sort(
                                            (a, b) =>
                                                new Date(
                                                    b
                                                        .split("/")
                                                        .reverse()
                                                        .join("-")
                                                ) -
                                                new Date(
                                                    a
                                                        .split("/")
                                                        .reverse()
                                                        .join("-")
                                                )
                                        )
                                        .map((date) => (
                                            <div
                                                key={date}
                                                className="space-y-4"
                                            >
                                                {/* Date Header */}
                                                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                                    <h4 className="text-sm font-semibold text-gray-700">
                                                        {formatDate(date)}
                                                    </h4>
                                                    <div className="text-xs text-gray-500">
                                                        {
                                                            groupedTransactions[
                                                                date
                                                            ].length
                                                        }{" "}
                                                        transaction
                                                        {groupedTransactions[
                                                            date
                                                        ].length !== 1
                                                            ? "s"
                                                            : ""}
                                                    </div>
                                                </div>

                                                {/* Transactions for this date */}
                                                <div className="space-y-3">
                                                    {groupedTransactions[
                                                        date
                                                    ].map(
                                                        (
                                                            transaction,
                                                            index
                                                        ) => (
                                                            <Transaction
                                                                key={`${date}-${index}`}
                                                                type={
                                                                    transaction.Transaction
                                                                }
                                                                account={
                                                                    transaction.Account
                                                                }
                                                                category={
                                                                    transaction[
                                                                        "Category or Account"
                                                                    ]
                                                                }
                                                                note={
                                                                    transaction.Note
                                                                }
                                                                cash={getCashValue(
                                                                    transaction
                                                                )}
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        ))
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
                                                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            Tidak ada transaksi yang cocok
                                        </h3>
                                        <p className="text-gray-500 text-sm">
                                            Coba ubah kriteria filter Anda untuk
                                            melihat hasil lainnya.
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : filteredTransactions.length === 0 &&
                          Object.keys(activeFilters).length > 0 ? (
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
                                            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No transactions found
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    Try adjusting your filter criteria to see
                                    more results.
                                </p>
                            </div>
                        ) : currentDataSource &&
                          Array.isArray(currentDataSource) &&
                          currentDataSource.length > 0 ? (
                            <div className="space-y-6">
                                {Object.keys(groupedTransactions).length > 0 ? (
                                    Object.keys(groupedTransactions)
                                        .sort(
                                            (a, b) =>
                                                new Date(
                                                    b
                                                        .split("/")
                                                        .reverse()
                                                        .join("-")
                                                ) -
                                                new Date(
                                                    a
                                                        .split("/")
                                                        .reverse()
                                                        .join("-")
                                                )
                                        )
                                        .map((date) => (
                                            <div
                                                key={date}
                                                className="space-y-4"
                                            >
                                                {/* Date Header */}
                                                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                                    <h4 className="text-sm font-semibold text-gray-700">
                                                        {formatDate(date)}
                                                    </h4>
                                                    <div className="text-xs text-gray-500">
                                                        {
                                                            groupedTransactions[
                                                                date
                                                            ].length
                                                        }{" "}
                                                        transaction
                                                        {groupedTransactions[
                                                            date
                                                        ].length !== 1
                                                            ? "s"
                                                            : ""}
                                                    </div>
                                                </div>

                                                {/* Transactions for this date */}
                                                <div className="space-y-3">
                                                    {groupedTransactions[
                                                        date
                                                    ].map(
                                                        (
                                                            transaction,
                                                            index
                                                        ) => (
                                                            <Transaction
                                                                key={`${date}-${index}`}
                                                                type={
                                                                    transaction.Transaction
                                                                }
                                                                account={
                                                                    transaction.Account
                                                                }
                                                                category={
                                                                    transaction[
                                                                        "Category or Account"
                                                                    ]
                                                                }
                                                                note={
                                                                    transaction.Note
                                                                }
                                                                cash={getCashValue(
                                                                    transaction
                                                                )}
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        ))
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
                                                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            No transactions found
                                        </h3>
                                        <p className="text-gray-500 text-sm">
                                            Try adjusting your filter criteria
                                            to see more results.
                                        </p>
                                    </div>
                                )}
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
                                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No transactions found
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    {selectedMonth === "All Months"
                                        ? "There are no transactions across all months yet."
                                        : `There are no transactions for ${selectedMonth} yet.`}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function Transactions() {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen bg-gray-50">
                    <div className="p-4">Loading...</div>
                </main>
            }
        >
            <TransactionsContent />
        </Suspense>
    );
}
