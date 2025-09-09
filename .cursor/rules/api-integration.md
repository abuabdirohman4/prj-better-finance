# API Integration & Data Management

## Google Sheets Integration

### Setup and Configuration
```javascript
// utils/google.js
import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
```

### Data Fetching Patterns
```javascript
// API Route Pattern
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const sheetName = searchParams.get('sheet');
        
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
            range: `${sheetName}!A:Z`,
        });

        const rows = response.data.values || [];
        const headers = rows[0];
        const data = rows.slice(1).map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index] || '';
            });
            return obj;
        });

        return NextResponse.json({ data });
    } catch (error) {
        console.error('Google Sheets API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch data' },
            { status: 500 }
        );
    }
}
```

### Error Handling
```javascript
// Consistent error handling for API calls
const handleApiError = (error, context) => {
    console.error(`❌ Error in ${context}:`, error);
    
    if (error.code === 403) {
        return { error: 'Access denied. Check API credentials.' };
    } else if (error.code === 404) {
        return { error: 'Data not found.' };
    } else if (error.code === 429) {
        return { error: 'Rate limit exceeded. Please try again later.' };
    }
    
    return { error: 'An unexpected error occurred.' };
};
```

## Data Processing Patterns

### Transaction Data Processing
```javascript
// utils/helper.js
export function processTransactionData(rawData) {
    return rawData.map(transaction => ({
        id: generateId(),
        date: transaction.Date,
        type: transaction.Transaction,
        account: transaction.Account,
        category: transaction['Category or Account'],
        note: transaction.Note,
        amount: getCashValue(transaction),
        // Add computed fields
        formattedAmount: formatCurrency(getCashValue(transaction)),
        isExpense: transaction.Transaction === 'Spending',
    }));
}
```

### Data Validation
```javascript
// Validate data before processing
export function validateTransactionData(data) {
    const requiredFields = ['Date', 'Transaction', 'Account'];
    const errors = [];

    data.forEach((item, index) => {
        requiredFields.forEach(field => {
            if (!item[field] || item[field].trim() === '') {
                errors.push(`Row ${index + 1}: Missing required field '${field}'`);
            }
        });
    });

    return {
        isValid: errors.length === 0,
        errors
    };
}
```

## Caching Strategies

### SWR Configuration
```javascript
// configs/index.js
export const swrConfig = {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
    errorRetryCount: 2,
    refreshInterval: 15000,
    onError: (error) => {
        console.error('SWR Error:', error);
    },
};
```

### Cache Busting
```javascript
// Add cache busting to API calls
const cacheBuster = `?t=${Date.now()}&force=true`;
const response = await fetch(`/api/endpoint${cacheBuster}`, {
    headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
    },
});
```

## Data Transformation

### Currency Formatting
```javascript
export function formatCurrency(amount, format = "rupiah") {
    const absAmount = Math.abs(amount);
    
    switch (format) {
        case "rupiah":
            return new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
            }).format(amount);
        case "short":
            if (absAmount >= 1000000000) {
                return `Rp${(absAmount / 1000000000).toFixed(1)}M`;
            } else if (absAmount >= 1000000) {
                return `Rp${(absAmount / 1000000).toFixed(1)}jt`;
            } else if (absAmount >= 1000) {
                return `Rp${(absAmount / 1000).toFixed(0)}rb`;
            }
            return `Rp${absAmount.toFixed(0)}`;
        default:
            return formatCurrency(amount);
    }
}
```

### Date Processing
```javascript
export function formatDate(dateString) {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const date = new Date(dateString.split("/").reverse().join("-"));
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
        return "Today";
    }
    
    if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
    }
    
    return date.toLocaleDateString("en-GB", options).replace(/ /g, " ");
}
```

## Performance Optimization

### Data Pagination
```javascript
// Implement pagination for large datasets
export function paginateData(data, page = 1, limit = 20) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
        data: data.slice(startIndex, endIndex),
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(data.length / limit),
            totalItems: data.length,
            hasNext: endIndex < data.length,
            hasPrev: page > 1,
        }
    };
}
```

### Memoization
```javascript
// Use useMemo for expensive calculations
const processedData = useMemo(() => {
    if (!rawData) return [];
    return processTransactionData(rawData);
}, [rawData]);

// Use useCallback for event handlers
const handleFilterChange = useCallback((filters) => {
    setActiveFilters(filters);
}, []);
```

## Error Recovery

### Retry Logic
```javascript
// Implement retry logic for failed requests
const retryRequest = async (fn, retries = 3, delay = 1000) => {
    try {
        return await fn();
    } catch (error) {
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
            return retryRequest(fn, retries - 1, delay * 2);
        }
        throw error;
    }
};
```

### Fallback Data
```javascript
// Provide fallback data when API fails
const { data, error } = useSWR('key', fetcher, {
    fallbackData: [], // Provide empty array as fallback
    onError: (error) => {
        // Log error and show user notification
        console.error('Data fetch failed:', error);
    }
});
```

## Security Considerations

### Input Sanitization
```javascript
// Sanitize user inputs
export function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .substring(0, 1000); // Limit length
}
```

### API Key Management
```javascript
// Environment variables validation
const requiredEnvVars = [
    'GOOGLE_SHEETS_API_KEY',
    'GOOGLE_SHEETS_CLIENT_EMAIL',
    'GOOGLE_SHEETS_PRIVATE_KEY',
    'GOOGLE_SHEETS_SPREADSHEET_ID'
];

export function validateEnvironment() {
    const missing = requiredEnvVars.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
}
```

## Testing API Integration

### Mock Data for Development
```javascript
// utils/mockData.js
export const mockTransactions = [
    {
        Date: "01/12/2024",
        Transaction: "Spending",
        Account: "Wallet",
        "Category or Account": "Food",
        Note: "Lunch",
        Wallet: "50000"
    }
    // ... more mock data
];
```

### API Testing Patterns
```javascript
// Test API endpoints
describe('API Integration', () => {
    it('should fetch transactions successfully', async () => {
        const response = await fetch('/api/transactions?sheet=December');
        const data = await response.json();
        
        expect(response.status).toBe(200);
        expect(data.data).toBeDefined();
        expect(Array.isArray(data.data)).toBe(true);
    });
});
```
