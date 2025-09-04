import axios from "axios";

// Only import Google APIs on server-side
let google, auth, sheets;

if (typeof window === 'undefined') {
  // Server-side only
  const { google: googleLib } = require('googleapis');
  google = googleLib;
  
  auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  sheets = google.sheets({ version: 'v4', auth });
}

// Google Sheets service - CRUD operations
export const googleSheetsService = {
	// READ operations
	read: async (sheetName, format = 'csv', forceRefresh = false) => {
		const sheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID;
		
		if (!sheetId) {
			throw new Error('NEXT_PUBLIC_GOOGLE_SHEET_ID is not defined');
		}
		
		const encodedSheetName = encodeURIComponent(sheetName);
		let sheetURL = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:${format}&sheet=${encodedSheetName}`;
		
		// Add cache busting parameter if force refresh is requested
		if (forceRefresh) {
			sheetURL += `&t=${Date.now()}`;
		}
		
		try {
			const response = await axios.get(sheetURL, {
				headers: {
					'Cache-Control': 'no-cache, no-store, must-revalidate',
					'Pragma': 'no-cache',
					'Expires': '0'
				}
			});
			return response.data;
		} catch (error) {
			console.error('❌ Error reading Google Sheet:', error);
			throw error;
		}
	},

	// Get all data from a sheet (using Google Sheets API)
	getAll: async (sheetName, range = 'A:Z') => {
		if (typeof window !== 'undefined') {
			throw new Error('getAll can only be used on server-side');
		}
		
		try {
			const sheetId = process.env.GOOGLE_SHEET_ID;
			
			const response = await sheets.spreadsheets.values.get({
				spreadsheetId: sheetId,
				range: `${sheetName}!${range}`,
			});
			
			return response.data.values || [];
		} catch (error) {
			console.error('❌ Error getting sheet data:', error);
			throw error;
		}
	},

	// Get specific range from a sheet
	getRange: async (sheetName, range) => {
		if (typeof window !== 'undefined') {
			throw new Error('getRange can only be used on server-side');
		}
		
		try {
			const sheetId = process.env.GOOGLE_SHEET_ID;
			
			const response = await sheets.spreadsheets.values.get({
				spreadsheetId: sheetId,
				range: `${sheetName}!${range}`,
			});
			
			return response.data.values || [];
		} catch (error) {
			console.error('❌ Error getting range:', error);
			throw error;
		}
	},

	// UPDATE operations
	update: async (sheetName, range, value) => {
		if (typeof window !== 'undefined') {
			throw new Error('update can only be used on server-side');
		}
		
		try {
			const sheetId = process.env.GOOGLE_SHEET_ID;
			
			await sheets.spreadsheets.values.update({
				spreadsheetId: sheetId,
				range: `${sheetName}!${range}`,
				valueInputOption: 'RAW',
				resource: {
					values: [[value]]
				}
			});
			

			return true;
		} catch (error) {
			console.error('❌ Error updating cell:', error);
			throw error;
		}
	},

	// Update multiple cells at once
	updateBatch: async (sheetName, updates) => {
		try {
			const sheetId = process.env.GOOGLE_SHEET_ID;
			
			const requests = updates.map(update => ({
				range: `${sheetName}!${update.range}`,
				values: [[update.value]]
			}));
			
			await sheets.spreadsheets.values.batchUpdate({
				spreadsheetId: sheetId,
				resource: {
					valueInputOption: 'RAW',
					data: requests
				}
			});
			

			return true;
		} catch (error) {
			console.error('❌ Error batch updating:', error);
			throw error;
		}
	},

	// CREATE operations
	create: async (sheetName, range, values) => {
		try {
			const sheetId = process.env.GOOGLE_SHEET_ID;
			
			await sheets.spreadsheets.values.update({
				spreadsheetId: sheetId,
				range: `${sheetName}!${range}`,
				valueInputOption: 'RAW',
				resource: {
					values: values
				}
			});
			

			return true;
		} catch (error) {
			console.error('❌ Error creating data:', error);
			throw error;
		}
	},

	// Append new row to sheet
	append: async (sheetName, values) => {
		try {
			const sheetId = process.env.GOOGLE_SHEET_ID;
			
			await sheets.spreadsheets.values.append({
				spreadsheetId: sheetId,
				range: `${sheetName}!A:Z`,
				valueInputOption: 'RAW',
				insertDataOption: 'INSERT_ROWS',
				resource: {
					values: [values]
				}
			});
			

			return true;
		} catch (error) {
			console.error('❌ Error appending data:', error);
			throw error;
		}
	},

	// DELETE operations
	clear: async (sheetName, range) => {
		try {
			const sheetId = process.env.GOOGLE_SHEET_ID;
			
			await sheets.spreadsheets.values.clear({
				spreadsheetId: sheetId,
				range: `${sheetName}!${range}`,
			});
			
			return true;
		} catch (error) {
			console.error('❌ Error clearing range:', error);
			throw error;
		}
	},

	// UTILITY functions
	// Find row by value in specific column
	findRowByValue: async (sheetName, column, searchValue, options = {}) => {
		try {
			const { caseSensitive = false, exactMatch = true } = options;
			const sheetId = process.env.GOOGLE_SHEET_ID;
			
			// Get all values in the specified column
			const response = await sheets.spreadsheets.values.get({
				spreadsheetId: sheetId,
				range: `${sheetName}!${column}:${column}`,
			});
			
			const rows = response.data.values || [];
			let rowIndex = -1;
			
			if (exactMatch) {
				if (caseSensitive) {
					rowIndex = rows.findIndex(row => row[0] === searchValue);
				} else {
					rowIndex = rows.findIndex(row => 
						row[0] && row[0].toLowerCase() === searchValue.toLowerCase()
					);
				}
			} else {
				// Partial match
				rowIndex = rows.findIndex(row => 
					row[0] && row[0].toLowerCase().includes(searchValue.toLowerCase())
				);
			}
			
			return rowIndex !== -1 ? rowIndex + 1 : null; // Return 1-based row number
		} catch (error) {
			console.error('❌ Error finding row:', error);
			throw error;
		}
	},

	// Update cell by finding row with value in specific column
	updateByValue: async (sheetName, searchColumn, searchValue, updateColumn, updateValue, options = {}) => {
		try {
			const rowNumber = await googleSheetsService.findRowByValue(sheetName, searchColumn, searchValue, options);
			
			if (!rowNumber) {
				throw new Error(`Value "${searchValue}" not found in column ${searchColumn}`);
			}
			
			return await googleSheetsService.update(sheetName, `${updateColumn}${rowNumber}`, updateValue);
		} catch (error) {
			console.error('❌ Error updating by value:', error);
			throw error;
		}
	}
};

export const getDefaultSheetName = (months) => {
  const currentMonth = new Date().getMonth();
  return months[currentMonth];
};