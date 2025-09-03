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
    return row['Sinking'] && row['Sinking'].trim() !== '' && 
           row['Type'] && row['Type'].trim() !== '';
  });

  return parsedData;
}

export const groupGoalsByType = (goals) => {
  return goals.reduce((groups, goal) => {
    // Handle column names with spaces
    const type = goal.Type || goal[' Type '] || goal['Type '] || goal[' Type'];
    if (type && type.trim() !== '') {
      if (!groups[type.trim()]) {
        groups[type.trim()] = [];
      }
      groups[type.trim()].push(goal);
    }
    return groups;
  }, {});
};

export const fetchGoals = async () => {
  try {
    const csvData = await googleSheetsService.read("Goals");
    
    const parsedData = parseCSV(csvData);
    return parsedData;
  } catch (error) {
    console.error('Error fetching goals data:', error);
    return [];
  }
}
