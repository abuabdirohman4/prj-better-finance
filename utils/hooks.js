import useSWR from "swr";
import { useState, useEffect } from "react";

// Custom hook for fetching transaction data
export const useTransactions = (sheetName) => {
    const { data, error, isLoading, mutate } = useSWR(
        sheetName ? `transactions-${sheetName}` : null,
        async () => {
            if (!sheetName) return null;

            const maxRetries = 3;
            let lastError;

            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    const cacheBuster = `?sheet=${encodeURIComponent(sheetName)}&t=${Date.now()}&force=true`;
                    const response = await fetch(
                        `/api/transactions${cacheBuster}`,
                        {
                            headers: {
                                "Cache-Control":
                                    "no-cache, no-store, must-revalidate",
                                Pragma: "no-cache",
                                Expires: "0",
                            },
                            // Increase timeout for cold start
                            signal: AbortSignal.timeout(30000), // 30 seconds timeout
                        }
                    );
                    const result = await response.json();

                    if (!response.ok) {
                        throw new Error(
                            result.error || "Failed to fetch transactions"
                        );
                    }

                    return result.data;
                } catch (error) {
                    lastError = error;
                    console.error(`❌ Error fetching transaction data (attempt ${attempt}/${maxRetries}):`, error);
                    
                    // If it's the last attempt, return empty array
                    if (attempt === maxRetries) {
                        return [];
                    }
                    
                    // Wait before retry with exponential backoff
                    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
            
            return [];
        },
        {
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            dedupingInterval: 5000, // 5 seconds
            errorRetryCount: 0, // Disable SWR retry since we handle it manually
            refreshInterval: 15000, // Auto-refresh every 15 seconds
            fetcher: undefined, // Use inline fetcher instead
        }
    );

    return {
        data,
        error,
        isLoading,
        mutate,
        isError: !!error,
    };
};

// Custom hook for staggered loading
export const useStaggeredLoading = (delay = 0) => {
    const [shouldLoad, setShouldLoad] = useState(delay === 0);
    
    useEffect(() => {
        if (delay > 0) {
            const timer = setTimeout(() => {
                setShouldLoad(true);
            }, delay);
            return () => clearTimeout(timer);
        }
    }, [delay]);
    
    return shouldLoad;
};

// Custom hook for fetching account data
export const useAccounts = (delay = 0) => {
    const shouldLoad = useStaggeredLoading(delay);
    const { data, error, isLoading, mutate } = useSWR(
        shouldLoad ? "accounts" : null,
        async () => {
            if (!shouldLoad) return null;
            const maxRetries = 3;
            let lastError;

            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    // Add cache busting parameter to prevent caching
                    const cacheBuster = `?t=${Date.now()}&force=true`;
                    const response = await fetch(`/api/accounts${cacheBuster}`, {
                        headers: {
                            "Cache-Control": "no-cache, no-store, must-revalidate",
                            Pragma: "no-cache",
                            Expires: "0",
                        },
                        // Increase timeout for cold start
                        signal: AbortSignal.timeout(30000), // 30 seconds timeout
                    });
                    
                    const result = await response.json();

                    if (!response.ok) {
                        throw new Error(result.error || "Failed to fetch accounts");
                    }

                    return result.data;
                } catch (error) {
                    lastError = error;
                    console.error(`❌ Error fetching account data (attempt ${attempt}/${maxRetries}):`, error);
                    
                    // If it's the last attempt, return empty array
                    if (attempt === maxRetries) {
                        return [];
                    }
                    
                    // Wait before retry with exponential backoff
                    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
            
            return [];
        },
        {
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            dedupingInterval: 5000, // Reduced to 5 seconds for faster updates
            errorRetryCount: 0, // Disable SWR retry since we handle it manually
            refreshInterval: 10000, // Auto-refresh every 10 seconds
            fetcher: undefined, // Use inline fetcher instead
        }
    );

    return {
        data,
        error,
        isLoading,
        mutate,
        isError: !!error,
    };
};

// Custom hook for fetching budget data
export const useBudgets = (month) => {
    const { data, error, isLoading, mutate } = useSWR(
        month ? `budgets-${month}` : null,
        async () => {
            if (!month) return null;

            try {
                const cacheBuster = `?month=${encodeURIComponent(month)}&t=${Date.now()}&force=true`;
                const response = await fetch(`/api/budgets${cacheBuster}`, {
                    headers: {
                        "Cache-Control": "no-cache, no-store, must-revalidate",
                        Pragma: "no-cache",
                        Expires: "0",
                    },
                });
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || "Failed to fetch budgets");
                }

                return result.data;
            } catch (error) {
                console.error("❌ Error fetching budget data:", error);
                return null;
            }
        },
        {
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            dedupingInterval: 5000, // 5 seconds
            errorRetryCount: 2,
            refreshInterval: 15000, // Auto-refresh every 15 seconds
            fetcher: undefined, // Use inline fetcher instead
        }
    );

    return {
        data,
        error,
        isLoading,
        mutate,
        isError: !!error,
    };
};

// Custom hook for fetching goals data
export const useGoals = () => {
    const { data, error, isLoading, mutate } = useSWR(
        "goals",
        async () => {
            try {
                const cacheBuster = `?t=${Date.now()}&force=true`;
                const response = await fetch(`/api/goals${cacheBuster}`, {
                    headers: {
                        "Cache-Control": "no-cache, no-store, must-revalidate",
                        Pragma: "no-cache",
                        Expires: "0",
                    },
                });
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || "Failed to fetch goals");
                }

                return result.data;
            } catch (error) {
                console.error("❌ Error fetching goals data:", error);
                return [];
            }
        },
        {
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            dedupingInterval: 5000, // 5 seconds
            errorRetryCount: 2,
            refreshInterval: 15000, // Auto-refresh every 15 seconds
            fetcher: undefined, // Use inline fetcher instead
        }
    );

    return {
        data,
        error,
        isLoading,
        mutate,
        isError: !!error,
    };
};

// Custom hook for fetching assets data
export const useAssets = (delay = 0) => {
    const shouldLoad = useStaggeredLoading(delay);
    const { data, error, isLoading, mutate } = useSWR(
        shouldLoad ? "assets" : null,
        async () => {
            if (!shouldLoad) return null;
            const maxRetries = 3;
            let lastError;

            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    const cacheBuster = `?t=${Date.now()}&force=true`;
                    const response = await fetch(`/api/assets${cacheBuster}`, {
                        headers: {
                            "Cache-Control": "no-cache, no-store, must-revalidate",
                            Pragma: "no-cache",
                            Expires: "0",
                        },
                        // Increase timeout for cold start
                        signal: AbortSignal.timeout(30000), // 30 seconds timeout
                    });
                    const result = await response.json();

                    if (!response.ok) {
                        throw new Error(result.error || "Failed to fetch assets");
                    }

                    return result.data;
                } catch (error) {
                    lastError = error;
                    console.error(`❌ Error fetching assets data (attempt ${attempt}/${maxRetries}):`, error);
                    
                    // If it's the last attempt, return empty array
                    if (attempt === maxRetries) {
                        return [];
                    }
                    
                    // Wait before retry with exponential backoff
                    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
            
            return [];
        },
        {
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            dedupingInterval: 5000, // 5 seconds
            errorRetryCount: 0, // Disable SWR retry since we handle it manually
            refreshInterval: 10000, // Auto-refresh every 10 seconds
            fetcher: undefined, // Use inline fetcher instead
        }
    );

    return {
        data,
        error,
        isLoading,
        mutate,
        isError: !!error,
    };
};
