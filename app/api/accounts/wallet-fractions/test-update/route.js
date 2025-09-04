import { googleSheetsService } from '@/utils/google';

// Test endpoint to try updating a single fraction
export async function POST() {
  try {
    console.log('🧪 Test: Trying to update a single fraction');
    
    // Test with fraction 50000 (which we know exists)
    const testFraction = {
      fraction: 50000,
      count: 99 // Test value
    };
    
    console.log('📝 Test data:', testFraction);
    
    // Try to update
    const result = await googleSheetsService.updateByValue(
      "Wallet", 
      "A", // Column A contains Fraction values
      testFraction.fraction.toString(), 
      "B", // Column B contains Count values
      testFraction.count,
      {
        caseSensitive: false,
        exactMatch: true
      }
    );
    
    console.log('✅ Update result:', result);
    
    // Verify the update by reading the data again
    const walletData = await googleSheetsService.getAll("Wallet");
    console.log('📊 Updated Wallet sheet data:', walletData);
    
    return Response.json({
      success: true,
      message: 'Test update completed',
      testData: testFraction,
      updateResult: result,
      updatedSheetData: walletData
    });
    
  } catch (error) {
    console.error('❌ Test update error:', error);
    return Response.json(
      { 
        error: 'Test update failed',
        details: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}
