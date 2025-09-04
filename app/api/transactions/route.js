import { googleSheetsService } from '@/utils/google';

// GET /api/transactions - Get transactions data for a specific sheet
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const sheetName = url.searchParams.get('sheet');
    const forceRefresh = url.searchParams.get('force') === 'true';
    
    if (!sheetName) {
      return Response.json(
        { error: 'Sheet name is required' },
        { status: 400 }
      );
    }
    
    const csvData = await googleSheetsService.read(sheetName, 'csv', forceRefresh);
    
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
    
    const headers = {
      'Cache-Control': forceRefresh ? 'no-cache, no-store, must-revalidate' : 'public, max-age=30, stale-while-revalidate=60',
      'Last-Modified': new Date().toUTCString(),
      'ETag': `"${Date.now()}"`
    };

    return Response.json({
      success: true,
      data: sortedData
    }, { headers });
    
  } catch (error) {
    console.error('❌ Error fetching transactions:', error);
    return Response.json(
      { 
        error: 'Failed to fetch transactions data',
        details: error.message 
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      }
    );
  }
}
