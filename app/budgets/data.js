import { googleSheetsService } from "@/utils/google";
import Papa from "papaparse";

export const fetchBudgets = async (month) => {
  try {
    const [spendingData, earningData, transferData, spendingTFData] = await Promise.all([
      googleSheetsService.read("Spending"),
      googleSheetsService.read("Earning"),
      googleSheetsService.read("Transfer"),
      googleSheetsService.read("SpendingTF")
    ]);

    const rawData = {
      spendingData,
      earningData,
      transferData,
      spendingTFData
    };

    return processBudgetData(rawData, month);

  } catch (error) {
    console.error('Error fetching budget data:', error);
    return {
      spending: {},
      earning: {},
      transfer: {},
      spendingTF: {},
      summary: {
        totalEarning: 0,
        totalSpending: 0,
        totalTransfer: 0,
        totalSpendingTF: 0
      }
    };
  }
};

// Helper function to process budget data (reusable)
export const processBudgetData = (rawData, month) => {
  if (!rawData) return null;

  const { spendingData, earningData, transferData, spendingTFData } = rawData;
  
  // Parse all data with budget-specific parser
  const parsedSpending = parseCSV(spendingData, 'Spending');
  const parsedEarning = parseCSV(earningData, 'Earning');
  const parsedTransfer = parseCSV(transferData, 'Transfer');
  const parsedSpendingTF = parseCSV(spendingTFData, 'SpendingTF');

  // Extract data for the selected month
  const spendingMonthly = extractMonthlyData(parsedSpending, month, 'Spending');
  const earningMonthly = extractMonthlyData(parsedEarning, month, 'Earning');
  const transferMonthly = extractMonthlyData(parsedTransfer, month, 'Transfer');
  const spendingTFMonthly = extractMonthlyData(parsedSpendingTF, month, 'SpendingTF');

  return {
    spending: spendingMonthly,
    earning: earningMonthly,
    transfer: transferMonthly,
    spendingTF: spendingTFMonthly,
    summary: {
      totalEarning: Object.values(earningMonthly).reduce((sum, item) => sum + item.actual, 0),
      totalSpending: Object.values(spendingMonthly).reduce((sum, item) => sum + item.actual, 0),
      totalTransfer: Object.values(transferMonthly).reduce((sum, item) => sum + item.budget, 0),
      totalSpendingTF: Object.values(spendingTFMonthly).reduce((sum, item) => sum + item.actual, 0)
    }
  };
};

// CSV parser for budget data using PapaParse
const parseCSV = (data, sheetType = '') => {
  // Parse CSV using PapaParse
  const result = Papa.parse(data, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => {
      // Clean headers
      return header.replace(/"/g, '').trim();
    },
    transform: (value) => {
      // Clean cell values
      let cleanValue = value.replace(/"/g, '').trim();
      if (cleanValue === '  - ' || cleanValue === ' - ' || cleanValue === '') {
        cleanValue = '0';
      }
      return cleanValue;
    }
  });

  // Detect first column name using helper function
  const firstColumnName = getFirstColumnName(sheetType, result.meta.fields);
  
  // Filter rows that have categories (not totals)
  const parsedData = result.data.filter((row) => {
    const hasCategory = row[firstColumnName] && row[firstColumnName].trim() !== '';
    const isNotTotal = !row[firstColumnName]?.includes('TOTAL');
    
    return hasCategory && isNotTotal;
  });
  
  return parsedData;
};

// Function to extract monthly data
const extractMonthlyData = (parsedData, month, sheetType) => {
  const monthData = {};
  
  // Detect first column name using helper function
  const firstColumnName = getFirstColumnName(sheetType, Object.keys(parsedData[0] || {}));
  
  // Generate column names dynamically using toUpperCase()
  const monthUpper = month.toUpperCase();
  const budgetColumn = `BUDGET ${monthUpper}`;
  const actualColumn = monthUpper;
  
  parsedData.forEach((row) => {
    const category = row[firstColumnName];
    if (category) {
      const budgetValue = row[budgetColumn];
      const actualValue = row[actualColumn];
      const balanceValue = row['BALANCE'];
      
      // Clean and parse values
      const cleanBudget = cleanAndParseValue(budgetValue);
      const cleanBalance = cleanAndParseValue(balanceValue);
      const cleanActual = cleanAndParseValue(actualValue);
      
      monthData[category] = {
        budget: cleanBudget,
        balance: cleanBalance,
        actual: cleanActual
      };
    }
  });
  
  return monthData;
};

// Helper function to determine first column name based on sheet type
const getFirstColumnName = (sheetType, fields) => {
  const columnMapping = {
    'Spending': 'SPENDING',
    'Earning': 'EARNING', 
    'Transfer': 'TRANSFER'
  };
  
  if (columnMapping[sheetType]) {
    return columnMapping[sheetType];
  }
  
  if (sheetType === 'SpendingTF') {
    return fields.find(header => 
      header.includes('SPENDINGTF') || header.startsWith('SPENDINGTF')
    ) || fields[0];
  }
  
  return fields[0];
};

// Helper function to clean and parse values
const cleanAndParseValue = (value) => {
  if (!value || value === '0' || value === '') {
    return 0;
  }
  
  // Remove quotes and clean
  let cleanValue = value.toString().replace(/"/g, '').trim();
  
  // Handle special cases
  if (cleanValue === '  - ' || cleanValue === ' - ' || cleanValue === '-') {
    return 0;
  }
  
  // Handle percentage values (skip these)
  if (cleanValue.includes('%')) {
    return 0;
  }
  
  // Handle currency format like "(1,020,000)" or "314,679"
  if (cleanValue.startsWith('(') && cleanValue.endsWith(')')) {
    // Negative value in parentheses
    cleanValue = cleanValue.slice(1, -1); // Remove parentheses
    cleanValue = cleanValue.replace(/,/g, ''); // Remove commas
    return -parseFloat(cleanValue) || 0;
  } else {
    // Positive value
    cleanValue = cleanValue.replace(/,/g, ''); // Remove commas
    return parseFloat(cleanValue) || 0;
  }
};