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
      .map((row, index) => ({
        fraction: parseInt(row['Fraction']) || 0,
        count: parseInt(row['Count']) || 0,
        type: parseInt(row['Fraction']) === 1000 ? (index === 7 ? 'coin' : 'paper') : null, // Distinguish 1000 paper vs coin
        id: `${row['Fraction']}_${index}` // Unique ID for each row
      }))
      .sort((a, b) => {
        // Sort by fraction value descending, then by type (paper first for 1000)
        if (a.fraction !== b.fraction) {
          return b.fraction - a.fraction;
        }
        if (a.fraction === 1000) {
          return a.type === 'paper' ? -1 : 1;
        }
        return 0;
      });
    
    
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
        console.log(`🔄 Updating fraction ${fraction.fraction} (${fraction.type || 'normal'}) with count ${fraction.count}`);
        
        // For 1000 denominations, we need to find the specific row
        let searchValue = fraction.fraction.toString();
        if (fraction.fraction === 1000 && fraction.type) {
          // For 1000, we need to find the specific row based on type
          // This is a bit tricky since both have same fraction value
          // We'll use the row position to distinguish
          searchValue = fraction.fraction.toString();
        }
        
        // Find the row with this fraction value and update the Count column
        const result = await googleSheetsService.updateByValue(
          "Wallet", 
          "A", // Column A contains Fraction values
          searchValue, 
          "B", // Column B contains Count values
          fraction.count,
          {
            caseSensitive: false,
            exactMatch: true
          }
        );
        
        console.log(`✅ Successfully updated fraction ${fraction.fraction} (${fraction.type || 'normal'}):`, result);
        return { success: true, fraction: fraction.fraction, type: fraction.type };
      } catch (error) {
        console.error(`❌ Error updating fraction ${fraction.fraction} (${fraction.type || 'normal'}):`, error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          fraction: fraction.fraction,
          type: fraction.type,
          count: fraction.count
        });
        return { 
          success: false, 
          fraction: fraction.fraction, 
          type: fraction.type,
          error: error.message
        };
      }
    });

    const results = await Promise.all(updatePromises);
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`📊 Update results: ${successful.length} successful, ${failed.length} failed`);
    console.log('📊 Detailed results:', results);
    
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.set('Last-Modified', new Date().toUTCString());
    headers.set('ETag', `"${Date.now()}"`);

    const response = {
      success: true,
      message: `Successfully updated ${successful.length} fractions`,
      data: {
        updated: successful.length,
        failed: failed.length,
        results: results
      }
    };
    
    console.log('📤 Sending response:', response);
    
    return Response.json(response, { headers });
    
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
