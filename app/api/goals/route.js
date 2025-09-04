import { googleSheetsService } from '@/utils/google';

// GET /api/goals - Get goals data
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const forceRefresh = url.searchParams.get('force') === 'true';
    
    const csvData = await googleSheetsService.read("Goals", 'csv', forceRefresh);
    
    // Parse CSV data
    const Papa = (await import('papaparse')).default;
    const result = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        const cleanHeader = header.replace(/"/g, '');
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

    // Filter data - handle column names with spaces
    const parsedData = result.data.filter(row => {
      // Check for Type field (with possible spaces)
      const typeValue = row['Type'] || row[' Type '] || row['Type '] || row[' Type'];
      const hasType = typeValue && typeValue.trim() !== '';
      
      return hasType;
    });
    
    const headers = {
      'Cache-Control': forceRefresh ? 'no-cache, no-store, must-revalidate' : 'public, max-age=60, stale-while-revalidate=120',
      'Last-Modified': new Date().toUTCString(),
      'ETag': `"${Date.now()}"`
    };

    return Response.json({
      success: true,
      data: parsedData
    }, { headers });
    
  } catch (error) {
    console.error('❌ Error fetching goals:', error);
    return Response.json(
      { 
        error: 'Failed to fetch goals data',
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
