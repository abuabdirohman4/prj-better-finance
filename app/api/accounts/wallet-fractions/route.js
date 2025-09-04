import { googleSheetsService } from '@/utils/google';

// GET /api/accounts/wallet-fractions - Get wallet fractions data
export async function GET() {
  try {
    
    const csvData = await googleSheetsService.read("Wallet");
    
    // Parse CSV data
    const Papa = (await import('papaparse')).default;
    const result = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        const cleanHeader = header.replace(/"/g, '').trim();
        return cleanHeader;
      },
      transform: (value) => {
        let cleanValue = value.replace(/"/g, '').trim();
        if (cleanValue === '  - ' || cleanValue === ' - ' || cleanValue === '') {
          cleanValue = '0';
        }
        return cleanValue;
      }
    });

    // Filter and format data - only get rows with Fraction values
    const fractions = result.data
      .filter(row => row['Fraction'] && row['Fraction'].trim() !== '')
      .map(row => ({
        fraction: parseInt(row['Fraction']) || 0,
        count: parseInt(row['Count']) || 0
      }))
      .sort((a, b) => b.fraction - a.fraction); // Sort by fraction value descending
    
    
    return Response.json({
      success: true,
      data: fractions
    });
    
  } catch (error) {
    console.error('❌ Error fetching wallet fractions:', error);
    return Response.json(
      { 
        error: 'Failed to fetch wallet fractions data',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// PUT /api/accounts/wallet-fractions - Update wallet fractions count
export async function PUT(request) {
  try {
    // Check if request body exists
    if (!request.body) {
      return Response.json(
        { error: 'Request body is required' },
        { status: 400 }
      );
    }

    const { fractions } = await request.json();
    
    if (!fractions || !Array.isArray(fractions)) {
      return Response.json(
        { error: 'Fractions data is required and must be an array' },
        { status: 400 }
      );
    }

    // Validate each fraction
    for (const fraction of fractions) {
      if (typeof fraction.fraction === 'undefined' || typeof fraction.count === 'undefined') {
        return Response.json(
          { error: 'Each fraction must have fraction and count properties' },
          { status: 400 }
        );
      }
    }

    // Check if googleSheetsService is available
    if (!googleSheetsService || !googleSheetsService.updateByValue) {
      return Response.json(
        { error: 'Google Sheets service is not available' },
        { status: 500 }
      );
    }

    // Update each fraction count in the Wallet sheet
    const updatePromises = fractions.map(async (fraction) => {
      try {
        // Find the row with this fraction value and update the Count column
        await googleSheetsService.updateByValue(
          "Wallet", 
          "A", // Column A contains Fraction values
          fraction.fraction.toString(), 
          "B", // Column B contains Count values
          fraction.count,
          {
            caseSensitive: false,
            exactMatch: false
          }
        );
        
        return { success: true, fraction: fraction.fraction };
      } catch (error) {
        console.error(`Error updating fraction ${fraction.fraction}:`, error);
        return { 
          success: false, 
          fraction: fraction.fraction, 
          error: error.message
        };
      }
    });

    const results = await Promise.all(updatePromises);
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.set('Last-Modified', new Date().toUTCString());
    headers.set('ETag', `"${Date.now()}"`);

    return Response.json({
      success: true,
      message: `Successfully updated ${successful.length} fractions`,
      data: {
        updated: successful.length,
        failed: failed.length,
        results: results
      }
    }, { headers });
    
  } catch (error) {
    console.error('Error updating wallet fractions:', error);
    
    return Response.json(
      { 
        error: 'Failed to update wallet fractions',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// POST /api/accounts/wallet-fractions - Fallback for PUT method
export async function POST(request) {
  return PUT(request);
}

// OPTIONS /api/accounts/wallet-fractions - Handle CORS preflight
export async function OPTIONS() {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
  headers.set('Access-Control-Max-Age', '86400');
  
  return new Response(null, { 
    status: 200, 
    headers 
  });
}
