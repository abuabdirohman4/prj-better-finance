import { googleSheetsService } from '@/utils/google';

// PUT /api/accounts/balancing - Update account balancing
export async function PUT(request) {
  try {
    // Parse request body with error handling
    let requestData;
    try {
      requestData = await request.json();
    } catch (parseError) {
      console.error('❌ Error parsing request JSON:', parseError);
      return Response.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { accountName, realBalance } = requestData;
    
    if (!accountName || realBalance === undefined || realBalance === null) {
      return Response.json(
        { error: 'Account name and real balance are required' },
        { status: 400 }
      );
    }

    const value = parseFloat(realBalance);
    
    if (isNaN(value)) {
      return Response.json(
        { error: 'Real balance must be a valid number' },
        { status: 400 }
      );
    }

    // Update the balancing column (C) for the specified account
    await googleSheetsService.updateByValue("Summary", "A", accountName, "C", value, {
      caseSensitive: false,
      exactMatch: false
    });
    
    const successResponse = {
      success: true,
      message: `Successfully updated ${accountName} balancing to ${value}`,
      data: {
        accountName,
        realBalance: value,
        column: 'C'
      }
    };

    return Response.json(successResponse, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
  } catch (error) {
    console.error('❌ Error updating account balancing:', error);
    
    const errorResponse = {
      error: 'Failed to update account balancing',
      details: error.message,
      timestamp: new Date().toISOString()
    };

    return Response.json(errorResponse, {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }
}
