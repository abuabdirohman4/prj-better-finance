import { googleSheetsService } from '@/utils/google';

// PUT /api/accounts/balancing - Update account balancing
export async function PUT(request) {
  try {
    const { accountName, realBalance } = await request.json();
    
    if (!accountName || realBalance === undefined || realBalance === null) {
      return Response.json(
        { error: 'Account name and real balance are required' },
        { status: 400 }
      );
    }

    const value = parseFloat(realBalance);

    // Update the balancing column (C) for the specified account
    await googleSheetsService.updateByValue("Summary", "A", accountName, "C", value, {
      caseSensitive: false,
      exactMatch: false
    });
    
    return Response.json({
      success: true,
      message: `Successfully updated ${accountName} balancing to ${value}`,
      data: {
        accountName,
        realBalance: value,
        column: 'C'
      }
    });
    
  } catch (error) {
    console.error('❌ Error updating account balancing:', error);
    return Response.json(
      { 
        error: 'Failed to update account balancing',
        details: error.message,
        accountName,
        realBalance
      },
      { status: 500 }
    );
  }
}
