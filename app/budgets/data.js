import { googleSheetsService } from "@/utils/google";

export const fetchBudgets = async (month) => {
  try {
    const [spendingData, earningData, transferData, spendingTFData] = await Promise.all([
      googleSheetsService.fetchSheet("Spending"),
      googleSheetsService.fetchSheet("Earning"),
      googleSheetsService.fetchSheet("Transfer"),
      googleSheetsService.fetchSheet("SpendingTF")
    ]);

    // Parse semua data dengan parser khusus budget
    const parsedSpending = parseBudgetCSV(spendingData, 'Spending');
    const parsedEarning = parseBudgetCSV(earningData, 'Earning');
    const parsedTransfer = parseBudgetCSV(transferData, 'Transfer');
    const parsedSpendingTF = parseBudgetCSV(spendingTFData, 'SpendingTF');

    // Extract data untuk bulan yang dipilih
    const spendingMonthly = extractMonthlyData(parsedSpending, month, 'Spending');
    const earningMonthly = extractMonthlyData(parsedEarning, month, 'Earning');
    const transferMonthly = extractMonthlyData(parsedTransfer, month, 'Transfer');
    const spendingTFMonthly = extractMonthlyData(parsedSpendingTF, month, 'SpendingTF');

    const budgetOverview = {
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

    return budgetOverview;

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

// Parser khusus untuk data budget
const parseBudgetCSV = (data, sheetType = '') => {
  // Normalize newlines
  data = data.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const rows = data.split('\n').filter(row => row.trim() !== '');
  
  // Cari header row yang berisi "BUDGET AUG" dan "BALANCE"
  let headerRowIndex = 0;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].includes('BUDGET AUG') && rows[i].includes('BALANCE')) {
      headerRowIndex = i;
      break;
    }
  }
  
  if (headerRowIndex === 0 && !rows[0].includes('BUDGET AUG')) {
    // Coba cari dengan pattern lain
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].includes('BUDGET') && rows[i].includes('BALANCE')) {
        headerRowIndex = i;
        break;
      }
    }
  }
  
  const headerRow = rows[headerRowIndex];
  const headers = parseBudgetHeaders(headerRow);
  
  // Deteksi nama kolom pertama berdasarkan sheet type dengan pattern matching
  let firstColumnName = '';
  if (sheetType === 'Spending') {
    firstColumnName = 'SPENDING';
  } else if (sheetType === 'Earning') {
    firstColumnName = 'EARNING';
  } else if (sheetType === 'Transfer') {
    firstColumnName = 'TRANSFER';
  } else if (sheetType === 'SpendingTF') {
    // Cari kolom yang mengandung "SPENDINGTF" (bisa ada spasi atau kata tambahan)
    firstColumnName = headers.find(header => 
      header.includes('SPENDINGTF') || header.startsWith('SPENDINGTF')
    ) || headers[0];
  } else {
    // Fallback: ambil dari header pertama
    firstColumnName = headers[0];
  }
  
  // Parse data rows
  const dataRows = rows.slice(headerRowIndex + 1);
  
  const parsedData = dataRows.map((row, index) => {
    const values = parseBudgetRow(row);
    const rowData = {};
    
    headers.forEach((header, headerIndex) => {
      if (header && values[headerIndex] !== undefined) {
        let cleanValue = values[headerIndex].replace(/"/g, '').trim();
        if (cleanValue === '  - ' || cleanValue === ' - ' || cleanValue === '') {
          cleanValue = '0';
        }
        rowData[header] = cleanValue;
      }
    });
    
    return rowData;
  }).filter((row, index) => {
    // Filter baris yang memiliki kategori (bukan total)
    const hasCategory = row[firstColumnName] && row[firstColumnName].trim() !== '';
    const isNotTotal = !row[firstColumnName]?.includes('TOTAL');
    
    return hasCategory && isNotTotal;
  });
  
  return parsedData;
};

// Parse header budget yang kompleks
const parseBudgetHeaders = (headerRow) => {
  const headers = [];
  let currentHeader = '';
  let inQuotes = false;
  
  for (let i = 0; i < headerRow.length; i++) {
    const char = headerRow[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      headers.push(currentHeader.trim());
      currentHeader = '';
    } else {
      currentHeader += char;
    }
  }
  
  if (currentHeader.trim()) {
    headers.push(currentHeader.trim());
  }
  
  // Clean headers
  const cleanHeaders = headers.map(header => {
    const clean = header.replace(/"/g, '').trim();
    return clean;
  });
  
  return cleanHeaders;
};

// Parse row budget
const parseBudgetRow = (row) => {
  const values = [];
  let currentValue = '';
  let inQuotes = false;
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(currentValue.trim());
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  
  if (currentValue.trim()) {
    values.push(currentValue.trim());
  }
  
  return values;
};

// Fungsi untuk extract data per bulan
const extractMonthlyData = (parsedData, month, sheetType) => {
  const monthData = {};
  
  // Deteksi nama kolom pertama berdasarkan sheet type dengan pattern matching
  let firstColumnName = '';
  if (sheetType === 'Spending') {
    firstColumnName = 'SPENDING';
  } else if (sheetType === 'Earning') {
    firstColumnName = 'EARNING';
  } else if (sheetType === 'Transfer') {
    firstColumnName = 'TRANSFER';
  } else if (sheetType === 'SpendingTF') {
    // Cari kolom yang mengandung "SPENDINGTF" (bisa ada spasi atau kata tambahan)
    firstColumnName = Object.keys(parsedData[0] || {}).find(header => 
      header.includes('SPENDINGTF') || header.startsWith('SPENDINGTF')
    ) || Object.keys(parsedData[0] || {})[0];
  } else {
    // Fallback: ambil dari header pertama
    firstColumnName = Object.keys(parsedData[0] || {})[0];
  }
  
  parsedData.forEach((row, index) => {
    const category = row[firstColumnName];
    if (category) {
      // Parse nilai dengan direct access (bukan string interpolation)
      let budgetValue, actualValue;
      
      // Gunakan switch case untuk mapping month ke kolom yang benar
      switch(month) {
        case 'Aug':
          budgetValue = row['BUDGET AUG'];
          actualValue = row['AUG'];
          break;
        case 'Jul':
          budgetValue = row['BUDGET JUL'];
          actualValue = row['JUL'];
          break;
        case 'Jun':
          budgetValue = row['BUDGET JUN'];
          actualValue = row['JUN'];
          break;
        case 'May':
          budgetValue = row['BUDGET MAY'];
          actualValue = row['MAY'];
          break;
        case 'Apr':
          budgetValue = row['BUDGET APR'];
          actualValue = row['APR'];
          break;
        case 'Mar':
          budgetValue = row['BUDGET MAR'];
          actualValue = row['MAR'];
          break;
        case 'Feb':
          budgetValue = row['BUDGET FEB'];
          actualValue = row['FEB'];
          break;
        case 'Jan':
          budgetValue = row['BUDGET JAN'];
          actualValue = row['JAN'];
          break;
        default:
          budgetValue = undefined;
          actualValue = undefined;
      }
      
      const balanceValue = row['BALANCE'];
      
      // Clean dan parse nilai
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

// Helper function untuk clean dan parse nilai
const cleanAndParseValue = (value) => {
  if (!value || value === '0' || value === '') {
    return 0;
  }
  
  // Remove quotes dan clean
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