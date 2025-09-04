import { googleSheetsService } from '@/utils/google';

// Debug endpoint to check Wallet sheet structure
export async function GET() {
  try {
    console.log('🔍 Debug: Checking Wallet sheet structure');
    
    // Get raw data from Wallet sheet
    const walletData = await googleSheetsService.getAll("Wallet");
    console.log('📊 Raw Wallet sheet data:', walletData);
    
    // Get CSV data to see how it's parsed
    const csvData = await googleSheetsService.read("Wallet");
    console.log('📄 CSV data length:', csvData.length);
    
    // Parse CSV data like the main endpoint does
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
    
    console.log('📋 Parsed CSV result:', result);
    console.log('📋 Headers:', result.meta.fields);
    console.log('📋 First few rows:', result.data.slice(0, 5));
    
    // Filter and format data like the main endpoint
    const fractions = result.data
      .filter(row => row['Fraction'] && row['Fraction'].trim() !== '')
      .map(row => ({
        fraction: parseInt(row['Fraction']) || 0,
        count: parseInt(row['Count']) || 0
      }))
      .sort((a, b) => b.fraction - a.fraction);
    
    console.log('💰 Processed fractions:', fractions);
    
    return Response.json({
      success: true,
      data: {
        rawData: walletData,
        csvLength: csvData.length,
        headers: result.meta.fields,
        sampleRows: result.data.slice(0, 5),
        processedFractions: fractions
      }
    });
    
  } catch (error) {
    console.error('❌ Debug error:', error);
    return Response.json(
      { 
        error: 'Debug failed',
        details: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}
