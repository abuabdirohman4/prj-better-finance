import { getData } from "@/utils/fetch";

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
  const sheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID;
  const encodedSheetName = encodeURIComponent(sheetName);
  const sheetURL = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodedSheetName}`;

  try {
    const res = await getData({
      url: sheetURL,
    });
    
    if (res.status === 200 && res.data) {
      const parsedData = parseCSV(res.data);
      
      if (parsedData.length === 0) {
        console.warn('No valid data found after parsing');
        return [];
      }
      
      const sortedData = parsedData.sort().reverse();
      const groupedData = groupTransactionsByDate(sortedData);
      return groupedData;

    } else {
      console.error('Failed to fetch data:', res.status);
      return [];
    }
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return [];
  }
}
