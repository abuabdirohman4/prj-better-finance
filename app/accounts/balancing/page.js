"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAccounts } from "@/utils/hooks";
import { formatCurrency } from "@/utils/helper";
import Button from "@/components/Button";

export default function AccountBalancing() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-md mx-auto px-4 py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-md mx-auto px-4 py-6 pb-24 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          </div>
        </div>
      </main>
    }>
      <AccountBalancingContent />
    </Suspense>
  );
}

function AccountBalancingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accountName = searchParams.get('account') || 'Wallet';
  
  const { data: accountData, isLoading, mutate } = useAccounts();
  const [realBalance, setRealBalance] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  // Find the specified account
  const account = accountData?.find(acc => acc.name === accountName);
  const currentBalance = account?.balance || 0;
  const currentBalancing = account?.balancing || 0;
  
  // Calculate difference - use realBalance input if available, otherwise use last reality check
  const systemDifference = realBalance 
    ? parseFloat(realBalance) - currentBalance 
    : (currentBalancing > 0 ? currentBalancing - currentBalance : 0);

  // Initialize display value with existing reality balance
  useEffect(() => {
    if (currentBalancing > 0 && !realBalance) {
      const isBankAccount = accountName === 'Mandiri' || accountName === 'BCA';
      
      if (isBankAccount) {
        // For bank accounts, format with decimal places
        const displayVal = currentBalancing.toLocaleString('id-ID', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        setDisplayValue(displayVal);
        setRealBalance(currentBalancing.toString());
      } else {
        // For non-bank accounts, integer only
        const displayVal = Math.round(currentBalancing).toLocaleString('id-ID');
        setDisplayValue(displayVal);
        setRealBalance(Math.round(currentBalancing).toString());
      }
    }
  }, [currentBalancing, accountName, realBalance]);

  // Set cursor position after display value changes
  useEffect(() => {
    const input = document.querySelector('input[type="tel"]');
    if (input && cursorPosition !== null) {
      // Use setTimeout to ensure the DOM has updated
      setTimeout(() => {
        input.setSelectionRange(cursorPosition, cursorPosition);
      }, 0);
    }
  }, [displayValue, cursorPosition]);

  // Handle input formatting
  const handleInputChange = (e) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    const isBankAccount = accountName === 'Mandiri' || accountName === 'BCA';
    
    if (isBankAccount) {
      // For bank accounts, allow decimal input
      // Remove all non-numeric characters except dots and commas
      const cleanValue = value.replace(/[^\d.,]/g, '');
      
      if (cleanValue === '') {
        setRealBalance('');
        setDisplayValue('');
        setCursorPosition(0);
      } else {
        // Smart logic: handle both thousand separators and decimal separators
        let normalizedValue = cleanValue;
        let isDecimal = false;
        
        if (cleanValue.includes('.') || cleanValue.includes(',')) {
          // Check if there's a comma (decimal separator) - it takes priority
          const commaIndex = cleanValue.lastIndexOf(',');
          const dotIndex = cleanValue.lastIndexOf('.');
          
          if (commaIndex !== -1) {
            // If there's a comma, treat everything after the last comma as decimal
            const afterComma = cleanValue.substring(commaIndex + 1);
            
            if (afterComma.length <= 2) {
              isDecimal = true;
              // Remove all dots (thousand separators) and convert comma to dot
              normalizedValue = cleanValue.replace(/\./g, '').replace(',', '.');
            } else {
              // More than 2 digits after comma - invalid
              return; // Don't update state
            }
          } else if (dotIndex !== -1) {
            // Only dots, no comma - check if it's thousand separator or decimal
            const afterDot = cleanValue.substring(dotIndex + 1);
            
            if (afterDot.length <= 2) {
              isDecimal = true;
              normalizedValue = cleanValue;
            } else {
              // 3 or more digits after dot = thousand separator
              normalizedValue = cleanValue.replace(/\./g, '');
            }
          }
        }
        
        // Validate the final value
        const isValid = /^\d+$/.test(normalizedValue) || (isDecimal && /^\d+\.\d{0,2}$/.test(normalizedValue));
        
        if (isValid) {
          setRealBalance(normalizedValue);
          
          // Format display
          let displayVal;
          if (isDecimal) {
            const [integerPart, decimalPart] = normalizedValue.split('.');
            const formattedInteger = Number(integerPart).toLocaleString('id-ID');
            displayVal = decimalPart ? `${formattedInteger},${decimalPart}` : `${formattedInteger},`;
          } else {
            const number = Number(normalizedValue);
            displayVal = number.toLocaleString('id-ID');
          }
          
          setDisplayValue(displayVal);
          
          // Calculate new cursor position
          const newCursorPos = Math.min(cursorPos, displayVal.length);
          setCursorPosition(newCursorPos);
        }
      }
    } else {
      // For non-bank accounts, integer only
      const numericValue = value.replace(/[^\d]/g, '');
      
      if (numericValue === '') {
        setRealBalance('');
        setDisplayValue('');
        setCursorPosition(0);
      } else {
        const number = Number(numericValue);
        const displayVal = number.toLocaleString('id-ID');
        setRealBalance(number.toString());
        setDisplayValue(displayVal);
        
        // Calculate new cursor position
        const newCursorPos = Math.min(cursorPos, displayVal.length);
        setCursorPosition(newCursorPos);
      }
    }
  };

  const handleUpdate = async () => {
    if (!realBalance) {
      alert("Please enter the real balance");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/accounts/balancing', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountName,
          realBalance: parseFloat(realBalance)
        }),
      });

      // Check if response is ok and has content
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        setResult({ success: false, error: errorData.error || 'Request failed' });
        return;
      }

      // Check if response has content before parsing JSON
      const responseText = await response.text();
      if (!responseText.trim()) {
        setResult({ success: false, error: 'Empty response from server' });
        return;
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Response Text:', responseText);
        setResult({ success: false, error: 'Invalid response format from server' });
        return;
      }
      
      setResult({ 
        success: true, 
        data,
        difference: parseFloat(realBalance) - currentBalance
      });
      
      // Simple refresh account data
      mutate();
      
    } catch (error) {
      console.error('Fetch Error:', error);
      setResult({ success: false, error: error.message || 'Network error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{accountName} Balancing</h1>
              <p className="text-sm text-gray-600">Reality check for your {accountName.toLowerCase()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 pb-24 space-y-6">
        {/* Calculation Balance Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Calculation Balance</h2>
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Current Balance:</span>
                <span className="font-bold text-lg text-gray-900">
                  {accountName === 'Mandiri' || accountName === 'BCA' 
                    ? formatCurrency(currentBalance, 'superscript') 
                    : formatCurrency(currentBalance)}
                </span>
              </div>

              {/* Last Reality Check */}
              {currentBalancing > 0 ? (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Reality Balance:</span>
                  <span className="font-bold text-lg text-blue-600">
                    {accountName === 'Mandiri' || accountName === 'BCA' 
                      ? formatCurrency(currentBalancing, 'superscript') 
                      : formatCurrency(currentBalancing)}
                  </span>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Reality Balance:</span>
                  <span className="text-sm text-gray-400 italic">
                    Not yet recorded
                  </span>
                </div>
              )}
              
              {/* Dynamic Difference Display - Only show if there's reality balance data */}
              {currentBalancing > 0 && (
                <div className="border-t pt-4">
                  <div className={`p-4 rounded-xl border ${
                    systemDifference === 0 
                      ? 'bg-green-50 border-green-200' 
                      : systemDifference > 0 
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Difference:</span>
                      <span className={`text-lg font-bold ${
                        systemDifference === 0 
                          ? 'text-green-600' 
                          : systemDifference > 0 
                            ? 'text-blue-600'
                            : 'text-red-600'
                      }`}>
                        {systemDifference === 0 ? 'Perfect Match!' : 
                         systemDifference > 0 ? `+${formatCurrency(systemDifference)}` : 
                         formatCurrency(systemDifference)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {systemDifference === 0 ? 'Your records are accurate!' :
                       systemDifference > 0 ? 'You have more money than recorded' :
                       'You have less money than recorded'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reality Check Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Actual {accountName}</h2>
          
          <div className="space-y-4">
            <div>
              <input
                type="tel"
                inputMode="numeric"
                value={displayValue}
                onChange={handleInputChange}
                placeholder={`Enter your actual ${accountName.toLowerCase()} balance`}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>

            <Button
              onClick={handleUpdate}
              disabled={!realBalance}
              loading={loading}
              variant="primary"
              size="md"
            >
              {`Update ${accountName}`}
            </Button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className={`rounded-2xl shadow-lg border p-6 ${
            result.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-2 ${
              result.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {result.success ? '✅ Updated Successfully!' : '❌ Error'}
            </h3>
            {result.success && (
              <div className="space-y-2">
                <p className="text-sm text-green-700">
                  Actual {accountName} updated to {formatCurrency(parseFloat(realBalance))}
                </p>
                <p className="text-sm text-green-700">
                  Difference: {result.difference > 0 ? '+' : ''}{formatCurrency(result.difference)}
                </p>
              </div>
            )}
            {!result.success && (
              <p className="text-sm text-red-700">{result.error}</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}