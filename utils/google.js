import axios from "axios";

// Google Sheets service - single sheet approach
export const googleSheetsService = {
	fetchSheet: async (sheetName, format = 'csv') => {
		const sheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID;
		const encodedSheetName = encodeURIComponent(sheetName);
		const sheetURL = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:${format}&sheet=${encodedSheetName}`;
		
		try {
			const response = await axios.get(sheetURL);
			return response.data;
		} catch (error) {
			console.error('Error fetching Google Sheet:', error);
			throw error;
		}
	}
};

export const getDefaultSheetName = (months) => {
  const currentMonth = new Date().getMonth();
  return months[currentMonth];
};