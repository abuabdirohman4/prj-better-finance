import { googleSheetsService } from '@/utils/google';

// GET /api/budgets - Get budget data for a specific month
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const month = url.searchParams.get('month');
    const forceRefresh = url.searchParams.get('force') === 'true';
    
    if (!month) {
      return Response.json(
        { error: 'Month parameter is required' },
        { status: 400 }
      );
    }
    
    const [spendingData, earningData, transferData, spendingTFData] = await Promise.all([
      googleSheetsService.read("Spending", 'csv', forceRefresh),
      googleSheetsService.read("Earning", 'csv', forceRefresh),
      googleSheetsService.read("Transfer", 'csv', forceRefresh),
      googleSheetsService.read("SpendingTF", 'csv', forceRefresh)
    ]);

    const headers = {
      'Cache-Control': forceRefresh ? 'no-cache, no-store, must-revalidate' : 'public, max-age=10, stale-while-revalidate=20',
      'Last-Modified': new Date().toUTCString(),
      'ETag': `"${Date.now()}"`
    };

    return Response.json({
      success: true,
      data: {
        spendingData,
        earningData,
        transferData,
        spendingTFData,
        month
      }
    }, { headers });
    
  } catch (error) {
    console.error('❌ Error fetching budgets:', error);
    return Response.json(
      { 
        error: 'Failed to fetch budgets data',
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
