import { googleSheetsService } from "@/utils/google";

const parseCSV = (data) => {
  // Normalize newlines for consistent parsing
  data = data.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  // Split into rows and drop empty lines
  const rows = data.split('\n').filter(row => row.trim() !== '');
  // Find the header row that contains both "Transaction" and "Account"
  let headerRowIndex = 0;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].includes('Transaction') && rows[i].includes('Account')) {
      headerRowIndex = i;
      break;
    }
  }
  
  const headerRow = rows[headerRowIndex];
  const rawHeaders = [];
  let currentHeader = '';
  let inQuotes = false;
  
  for (let i = 0; i < headerRow.length; i++) {
    const char = headerRow[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      rawHeaders.push(currentHeader.trim());
      currentHeader = '';
    } else {
      currentHeader += char;
    }
  }
  
  // Push the last header token
  if (currentHeader.trim()) {
    rawHeaders.push(currentHeader.trim());
  }
  
  // Normalize duplicated header tokens and known aliases
  const headers = rawHeaders.map(header => {
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
    
    // If header is like "Note Note", normalize to "Note"
    if (cleanHeader.includes('Note Note')) {
      return 'Note';
    }
    
    return cleanHeader;
  });
  
  // Parse data from the row after the header
  const dataRows = rows.slice(headerRowIndex + 1);
  const parsedData = dataRows.map((row) => {
    // Split row respecting quotes
    const values = [];
    let currentValue = '';
    let inRowQuotes = false;
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === '"') {
        inRowQuotes = !inRowQuotes;
      } else if (char === ',' && !inRowQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    // Push the last cell value
    if (currentValue.trim()) {
      values.push(currentValue.trim());
    }
    
    const rowData = {};
    
    headers.forEach((header, index) => {
      if (header && values[index] !== undefined) {
        let cleanValue = values[index].replace(/"/g, '');
        if (cleanValue === '  - ' || cleanValue === ' - ') {
          cleanValue = '0';
        }
        rowData[header] = cleanValue;
      }
    });
    
    return rowData;
  }).filter(row => {
    // Keep only rows with the required fields
    return row['Date'] && row['Date'].trim() !== '' && 
           row['Transaction'] && row['Transaction'].trim() !== '';
  });
  
  return parsedData;
}

const groupTransactionsByDate = (transactions) => {
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
    const groupedData = groupTransactionsByDate(sortedData);
    return groupedData;
  } catch (error) {
    console.error('Error fetching transaction data:', error);
    return [];
  }
}