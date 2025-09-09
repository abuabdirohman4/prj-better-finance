"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import FilterDropdown from "../FilterDropdown";

const TransactionFilter = ({
    transactions,
    onFilteredTransactions,
    onFilterChange,
    initialFilters = {},
}) => {
    // Normalize incoming initial category
    const normalizedInitialCategory = Array.isArray(initialFilters.category)
        ? initialFilters.category
        : initialFilters.category
          ? [initialFilters.category]
          : [];

    // Filter states
    const [filters, setFilters] = useState({
        transactionType: [],
        account: [],
        category: normalizedInitialCategory,
        note: "",
        dateRange: {
            start: "",
            end: "",
        },
    });

    // Track last applied initial category to avoid loops
    const lastAppliedInitialCategoryKey = useRef(null);

    // Extract unique values for filter options
    const filterOptions = useMemo(() => {
        if (!transactions || !Array.isArray(transactions)) {
            return {
                transactionTypes: [],
                accounts: [],
                categories: [],
            };
        }

        const transactionTypes = [
            ...new Set(transactions.map((t) => t.Transaction)),
        ].map((type) => ({
            value: type,
            label: type,
        }));

        const accounts = [...new Set(transactions.map((t) => t.Account))]
            .sort((a, b) => a.localeCompare(b))
            .map((account) => ({
                value: account,
                label: account,
            }));

        const categories = [
            ...new Set(transactions.map((t) => t["Category or Account"])),
        ]
            .sort((a, b) => a.localeCompare(b))
            .map((category) => ({
                value: category,
                label: category,
            }));

        return {
            transactionTypes,
            accounts,
            categories,
        };
    }, [transactions]);

    // Apply filters to transactions
    const filteredTransactions = useMemo(() => {
        if (!transactions || !Array.isArray(transactions)) return [];

        return transactions.filter((transaction) => {
            // Filter by transaction type
            if (
                filters.transactionType.length > 0 &&
                !filters.transactionType.includes(transaction.Transaction)
            ) {
                return false;
            }

            // Filter by account
            if (
                filters.account.length > 0 &&
                !filters.account.includes(transaction.Account)
            ) {
                return false;
            }

            // Filter by category
            if (
                filters.category.length > 0 &&
                !filters.category.includes(transaction["Category or Account"])
            ) {
                return false;
            }

            // Filter by note
            if (
                filters.note &&
                !transaction.Note?.toLowerCase().includes(
                    filters.note.toLowerCase()
                )
            ) {
                return false;
            }

            // Filter by date range
            if (filters.dateRange.start || filters.dateRange.end) {
                const transactionDate = new Date(
                    transaction.Date.split("/").reverse().join("-")
                );

                if (filters.dateRange.start) {
                    const startDate = new Date(filters.dateRange.start);
                    if (transactionDate < startDate) return false;
                }

                if (filters.dateRange.end) {
                    const endDate = new Date(filters.dateRange.end);
                    if (transactionDate > endDate) return false;
                }
            }

            return true;
        });
    }, [transactions, filters]);

    // Check if search by note returns no results
    const isNoteSearchEmpty = useMemo(() => {
        if (!filters.note || filters.note.trim() === "") return false;

        const hasMatchingNotes = transactions?.some((transaction) =>
            transaction.Note?.toLowerCase().includes(filters.note.toLowerCase())
        );

        return !hasMatchingNotes;
    }, [filters.note, transactions]);

    // Apply initial filters when options are ready (run only when incoming changes)
    useEffect(() => {
        if (!initialFilters.category) return;

        const incomingArray = Array.isArray(initialFilters.category)
            ? initialFilters.category
            : [initialFilters.category];

        const key = incomingArray
            .map((v) => v?.toString().toLowerCase())
            .join("|");
        if (lastAppliedInitialCategoryKey.current === key) return; // already applied

        // Map incoming values to the exact option values (case-insensitive)
        const mapped = incomingArray.map((val) => {
            const lower = val?.toString().toLowerCase();
            const match = filterOptions.categories.find(
                (opt) => opt.value?.toString().toLowerCase() === lower
            );
            return match ? match.value : val;
        });

        setFilters((prev) => ({
            ...prev,
            category: mapped,
        }));
        lastAppliedInitialCategoryKey.current = key;
    }, [initialFilters.category, filterOptions.categories]);

    // Update parent component when filtered transactions change
    useEffect(() => {
        onFilteredTransactions(filteredTransactions);
    }, [filteredTransactions, onFilteredTransactions]);

    // Update parent component when filters change
    useEffect(() => {
        onFilterChange(filters);
    }, [filters, onFilterChange]);

    const handleFilterChange = (filterType, value) => {
        setFilters((prev) => ({
            ...prev,
            [filterType]: value,
        }));
    };

    const clearAllFilters = () => {
        setFilters({
            transactionType: [],
            account: [],
            category: [],
            note: "",
            dateRange: {
                start: "",
                end: "",
            },
        });
    };

    const hasActiveFilters = () => {
        return (
            filters.transactionType.length > 0 ||
            filters.account.length > 0 ||
            filters.category.length > 0 ||
            filters.note !== "" ||
            filters.dateRange.start !== "" ||
            filters.dateRange.end !== ""
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 max-w-md">
            {/* Filter Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <svg
                        className="w-5 h-5 text-gray-600"
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
                    <h3 className="text-lg font-semibold text-gray-900">
                        Filters
                    </h3>
                    {hasActiveFilters() && (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {filteredTransactions.length} of{" "}
                            {transactions?.length || 0}
                        </span>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    {hasActiveFilters() && (
                        <button
                            onClick={clearAllFilters}
                            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            Clear All
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Transaction Type Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Transaction Type
                    </label>
                    <FilterDropdown
                        label="Transaction Type"
                        options={filterOptions.transactionTypes}
                        value={filters.transactionType}
                        onChange={(value) =>
                            handleFilterChange("transactionType", value)
                        }
                        placeholder="All Types"
                        multiple={true}
                        icon="💰"
                    />
                </div>

                {/* Account Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account
                    </label>
                    <FilterDropdown
                        label="Account"
                        options={filterOptions.accounts}
                        value={filters.account}
                        onChange={(value) =>
                            handleFilterChange("account", value)
                        }
                        placeholder="All Accounts"
                        multiple={true}
                        searchable={true}
                        icon="🏦"
                    />
                </div>

                {/* Category Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                    </label>
                    <FilterDropdown
                        label="Category"
                        options={filterOptions.categories}
                        value={filters.category}
                        onChange={(value) =>
                            handleFilterChange("category", value)
                        }
                        placeholder="All Categories"
                        multiple={true}
                        searchable={true}
                        icon="📂"
                    />
                </div>

                {/* Note Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Note
                    </label>
                    <input
                        type="text"
                        placeholder="Search in notes..."
                        value={filters.note}
                        onChange={(e) =>
                            handleFilterChange("note", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>
        </div>
    );
};

export default TransactionFilter;
