# Coding Standards & Best Practices

## Code Style

- **Components**: Use functional components with React hooks
- **Functions**: Prefer arrow functions for components and event handlers
- **Naming**:
    - Components: PascalCase (e.g., `BudgetCard`, `TransactionList`)
    - Files: kebab-case for pages (e.g., `page.js`), PascalCase for components
    - Variables: camelCase (e.g., `totalBudget`, `isLoading`)
    - Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

## React Patterns

### State Management
- Use `useState` for local component state
- Use `useEffect` for side effects and data fetching
- Use `useMemo` for expensive calculations
- Use `useCallback` for event handlers passed to child components
- Use `useRef` for DOM references and mutable values

### Custom Hooks
- Create custom hooks for reusable data fetching logic (e.g., `useTransactions`, `useAccounts`)
- Use SWR for server state management with built-in caching and revalidation
- Implement proper error handling and loading states in custom hooks
- Return consistent hook interface: `{ data, error, isLoading, mutate, isError }`

### Data Fetching
- Use SWR for all API calls with proper configuration
- Implement cache busting for real-time data updates
- Add proper error boundaries and fallback states
- Use consistent API response structure

## File Organization

### Component Structure
```
components/
├── ComponentName/
│   ├── index.js          # Main component export
│   └── ComponentName.js  # Component implementation
```

### Utility Organization
```
utils/
├── hooks.js              # Custom SWR hooks
├── helper.js             # Pure utility functions
├── constants.js          # Application constants
├── fetch.js              # API utilities
└── google.js             # Google Sheets integration
```

### Page Structure
```
app/
├── feature-name/
│   ├── page.js           # Main page component
│   ├── utils.js          # Page-specific utilities
│   └── sub-feature/
│       └── page.js       # Nested page
```

## Import/Export Patterns

### Component Exports
```javascript
// components/Card/index.js
export { default as Account } from "./Account";
export { default as Budget } from "./Budget";
export { default as Transaction } from "./Transaction";
```

### Utility Exports
```javascript
// utils/helper.js
export function formatCurrency(amount, format = "rupiah") {
    // Implementation
}

export function getTotalBalance(accounts) {
    // Implementation
}
```

### Import Patterns
```javascript
// Use absolute imports with @/ prefix
import { useTransactions, useAccounts } from "@/utils/hooks";
import { formatCurrency, getTotalBalance } from "@/utils/helper";
import { Account, Budget } from "@/components/Card";
```

## SWR Integration

### Custom Hook Pattern
```javascript
export const useTransactions = (sheetName) => {
    const { data, error, isLoading, mutate } = useSWR(
        sheetName ? `transactions-${sheetName}` : null,
        async () => {
            // Fetch logic with error handling
        },
        {
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            dedupingInterval: 5000,
            errorRetryCount: 2,
            refreshInterval: 15000,
        }
    );

    return { data, error, isLoading, mutate, isError: !!error };
};
```

### API Route Pattern
```javascript
// app/api/endpoint/route.js
export async function GET(request) {
    try {
        // API logic
        return NextResponse.json({ data: result });
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
```

## Error Handling

### Component Error States
```javascript
if (error) {
    return (
        <div className="text-center py-8">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <p className="text-red-600 font-semibold">Error loading data</p>
            <p className="text-gray-600 text-sm mt-2">Please try again later</p>
        </div>
    );
}
```

### Loading States
```javascript
if (isLoading) {
    return (
        <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
    );
}
```

## Code Quality

### Function Documentation
```javascript
/**
 * Formats currency amount with specified format
 * @param {number} amount - The amount to format
 * @param {string} format - Format type: 'rupiah', 'brackets', 'signs', 'short'
 * @returns {string|JSX.Element} Formatted currency string or JSX
 */
export function formatCurrency(amount, format = "rupiah") {
    // Implementation
}
```

### Consistent Error Messages
- Use descriptive error messages
- Include context about what failed
- Provide actionable next steps
- Use consistent error styling and icons

### Performance Considerations
- Use `useMemo` for expensive calculations
- Use `useCallback` for event handlers in lists
- Implement proper loading states
- Use SWR's built-in caching and deduplication
- Lazy load non-critical components

## Testing Guidelines

### Manual Testing Checklist
- [ ] Test all user interactions
- [ ] Verify error states and recovery
- [ ] Check loading states
- [ ] Test responsive design
- [ ] Validate data flow and state updates
- [ ] Test PWA functionality offline/online
