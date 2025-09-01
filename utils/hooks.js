import useSWR from 'swr';
import { googleSheetsService } from './google';

// Custom hook for fetching transaction data
export const useTransactions = (sheetName) => {
  const { data, error, isLoading, mutate } = useSWR(
    sheetName ? `transactions-${sheetName}` : null,
    async () => {
      if (!sheetName) return null;
      
      try {
        const csvData = await googleSheetsService.fetchSheet(sheetName);
        
        // Parse CSV data
        const Papa = (await import('papaparse')).default;
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
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000, // 30 seconds
      errorRetryCount: 2,
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
        googleSheetsService.fetchSheet("Spending"),
        googleSheetsService.fetchSheet("Earning"),
        googleSheetsService.fetchSheet("Transfer"),
        googleSheetsService.fetchSheet("SpendingTF")
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
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
      errorRetryCount: 2,
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
