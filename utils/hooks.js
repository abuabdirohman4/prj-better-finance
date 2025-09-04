import useSWR from 'swr';
import { googleSheetsService } from './google';
import Papa from 'papaparse';

// Custom hook for fetching transaction data
export const useTransactions = (sheetName) => {
  const { data, error, isLoading, mutate } = useSWR(
    sheetName ? `transactions-${sheetName}` : null,
    async () => {
      if (!sheetName) return null;
      
      try {
        const csvData = await googleSheetsService.read(sheetName);
        
        // Parse CSV data
        const result = Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header) => {
            const cleanHeader = header.replace(/"/g, '');
            const words = cleanHeader.split(' ');
            if (words.length >= 2 && words[0] === words[1]) {
              return words[0];
            }
            if (cleanHeader.includes('Category or Account')) {
              return 'Category or Account';
            }
            return cleanHeader;
          },
          transform: (value) => {
            let cleanValue = value.replace(/"/g, '');
            if (cleanValue === '  - ' || cleanValue === ' - ') {
              cleanValue = '0';
            }
            return cleanValue;
          }
        });

        // Filter and sort data
        const parsedData = result.data.filter(row => {
          return row['Date'] && row['Date'].trim() !== '' && 
                 row['Transaction'] && row['Transaction'].trim() !== '';
        });

        const sortedData = parsedData.sort().reverse();
        
        return sortedData;
      } catch (error) {
        console.error('❌ Error fetching transaction data:', error);
        return [];
      }
    },
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 10000, // 10 seconds
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
      
      const [spendingData, earningData, transferData, spendingTFData] = await Promise.all([
        googleSheetsService.read("Spending"),
        googleSheetsService.read("Earning"),
        googleSheetsService.read("Transfer"),
        googleSheetsService.read("SpendingTF")
      ]);

      return {
        spendingData,
        earningData,
        transferData,
        spendingTFData,
        month
      };
    },
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 10000, // 10 seconds
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

// Custom hook for fetching goals data
export const useGoals = () => {
  const { data, error, isLoading, mutate } = useSWR(
    'goals',
    async () => {
      try {
        const csvData = await googleSheetsService.read("Goals");
        
        // Parse CSV data
        const result = Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header) => {
            const cleanHeader = header.replace(/"/g, '');
            return cleanHeader;
          },
          transform: (value) => {
            let cleanValue = value.replace(/"/g, '');
            if (cleanValue === '  - ' || cleanValue === ' - ') {
              cleanValue = '0';
            }
            return cleanValue;
          }
        });

        // Filter data - handle column names with spaces
        const parsedData = result.data.filter(row => {
          // Check for Type field (with possible spaces)
          const typeValue = row['Type'] || row[' Type '] || row['Type '] || row[' Type'];
          const hasType = typeValue && typeValue.trim() !== '';
          
          return hasType;
        });
        
        return parsedData;
      } catch (error) {
        console.error('❌ Error fetching goals data:', error);
        return [];
      }
    },
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 10000, // 10 seconds
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