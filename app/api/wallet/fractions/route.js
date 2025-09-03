import { googleSheetsService } from '@/utils/google';

// GET /api/wallet/fractions - Get wallet fractions data
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

// PUT /api/wallet/fractions - Update wallet fractions count
export async function PUT(request) {
  try {
    const { fractions } = await request.json();
    
    if (!fractions || !Array.isArray(fractions)) {
      return Response.json(
        { error: 'Fractions data is required' },
        { status: 400 }
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
            exactMatch: true
          }
        );
        return { success: true, fraction: fraction.fraction };
      } catch (error) {
        console.error(`Error updating fraction ${fraction.fraction}:`, error);
        return { success: false, fraction: fraction.fraction, error: error.message };
      }
    });

    const results = await Promise.all(updatePromises);
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    return Response.json({
      success: true,
      message: `Successfully updated ${successful.length} fractions`,
      data: {
        updated: successful.length,
        failed: failed.length,
        results: results
      }
    });
    
  } catch (error) {
    console.error('❌ Error updating wallet fractions:', error);
    return Response.json(
      { 
        error: 'Failed to update wallet fractions',
        details: error.message
      },
      { status: 500 }
    );
  }
}
