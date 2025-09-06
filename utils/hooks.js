import useSWR from 'swr';

// Custom hook for fetching transaction data
export const useTransactions = (sheetName) => {
  const { data, error, isLoading, mutate } = useSWR(
    sheetName ? `transactions-${sheetName}` : null,
    async () => {
      if (!sheetName) return null;
      
      try {
        const cacheBuster = `?sheet=${encodeURIComponent(sheetName)}&t=${Date.now()}&force=true`;
        const response = await fetch(`/api/transactions${cacheBuster}`, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch transactions');
        }
        
        return result.data;
      } catch (error) {
        console.error('❌ Error fetching transaction data:', error);
        return [];
      }
    },
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 5000, // 5 seconds
      errorRetryCount: 2,
      refreshInterval: 15000, // Auto-refresh every 15 seconds
      fetcher: undefined // Use inline fetcher instead
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

// Custom hook for fetching account data
export const useAccounts = () => {
  const { data, error, isLoading, mutate } = useSWR(
    'accounts',
    async () => {
      try {
        // Add cache busting parameter to prevent caching
        const cacheBuster = `?t=${Date.now()}&force=true`;
        const response = await fetch(`/api/accounts${cacheBuster}`, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch accounts');
        }
        
        return result.data;
      } catch (error) {
        console.error('❌ Error fetching account data:', error);
        return [];
      }
    },
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 5000, // Reduced to 5 seconds for faster updates
      errorRetryCount: 2,
      refreshInterval: 10000, // Auto-refresh every 10 seconds
      fetcher: undefined // Use inline fetcher instead
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
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch budgets');
        }
        
        return result.data;
      } catch (error) {
        console.error('❌ Error fetching budget data:', error);
        return null;
      }
    },
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 5000, // 5 seconds
      errorRetryCount: 2,
      refreshInterval: 15000, // Auto-refresh every 15 seconds
      fetcher: undefined // Use inline fetcher instead
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
    'goals',
    async () => {
      try {
        const cacheBuster = `?t=${Date.now()}&force=true`;
        const response = await fetch(`/api/goals${cacheBuster}`, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch goals');
        }
        
        return result.data;
      } catch (error) {
        console.error('❌ Error fetching goals data:', error);
        return [];
      }
    },
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 5000, // 5 seconds
      errorRetryCount: 2,
      refreshInterval: 15000, // Auto-refresh every 15 seconds
      fetcher: undefined // Use inline fetcher instead
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
export const useAssets = () => {
  const { data, error, isLoading, mutate } = useSWR(
    'assets',
    async () => {
      try {
        const cacheBuster = `?t=${Date.now()}&force=true`;
        const response = await fetch(`/api/assets${cacheBuster}`, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch assets');
        }
        
        return result.data;
      } catch (error) {
        console.error('❌ Error fetching assets data:', error);
        return [];
      }
    },
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 5000, // 5 seconds
      errorRetryCount: 2,
      refreshInterval: 10000, // Auto-refresh every 10 seconds
      fetcher: undefined // Use inline fetcher instead
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