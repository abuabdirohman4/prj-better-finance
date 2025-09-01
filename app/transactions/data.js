import { googleSheetsService } from "@/utils/google";
import Papa from "papaparse";

const parseCSV = (data) => {
  // Parse CSV using PapaParse
  const result = Papa.parse(data, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => {
      // Clean up header names
      const cleanHeader = header.replace(/"/g, '');
      
      // If header is like "Date Date", keep the first token
      const words = cleanHeader.split(' ');
      if (words.length >= 2 && words[0] === words[1]) {
        return words[0];
      }
      
      // If header contains "Category or Account", use it as-is
      if (cleanHeader.includes('Category or Account')) {
        return 'Category or Account';
      }
      
      return cleanHeader;
    },
    transform: (value) => {
      // Clean up cell values
      let cleanValue = value.replace(/"/g, '');
      if (cleanValue === '  - ' || cleanValue === ' - ') {
        cleanValue = '0';
      }
      return cleanValue;
    }
  });

  // Filter out rows without required fields
  const parsedData = result.data.filter(row => {
    return row['Date'] && row['Date'].trim() !== '' && 
           row['Transaction'] && row['Transaction'].trim() !== '';
  });

  return parsedData;
}

export const groupTransactionsByDate = (transactions) => {
  return transactions.reduce((groups, transaction) => {
    const date = transaction.Date;
    if (date) {
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
    } else {
      console.log(`invalid date for:`);
      console.log(transaction);
    }
    return groups;
  }, {});
};

export const fetchTransaction = async (sheetName) => {
  try {
    const csvData = await googleSheetsService.fetchSheet(sheetName);
    
    const parsedData = parseCSV(csvData);
    const sortedData = parsedData.sort().reverse();
    return sortedData;
  } catch (error) {
    console.error('Error fetching transaction data:', error);
    return [];
  }
}