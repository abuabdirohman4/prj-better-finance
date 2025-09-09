# Coding Standards & Best Practices

## Code Style

- **Components**: Use functional components with React hooks
- **Functions**: Prefer arrow functions for components and event handlers
- **Naming**:
    - Components: PascalCase (e.g., `BudgetCard`, `TransactionList`)
    - Files: kebab-case (e.g., `budget-card.js`, `transaction-list.js`)
    - Variables: camelCase (e.g., `totalBudget`, `isLoading`)

## React Patterns

- Use `useState` for local state management
- Implement `useEffect` for side effects and data fetching
- Prefer custom hooks for reusable logic
- Use `useCallback` and `useMemo` for performance optimization when needed

## File Organization

- Each component should have its own folder with `index.js`
- Mock data should be stored in separate `data/` folders
- Utility functions should be grouped by domain in `utils/`
- Constants and configuration in `configs/`

## Import/Export

- Use named exports for components
- Import components with destructuring: `import { BudgetCard } from '@/components/Card/Budget'`
- Use absolute imports with `@/` prefix (configured in jsconfig.json)

## Code Quality

- Add JSDoc comments for complex functions
- Use meaningful variable names
- Implement proper error handling
- Test components manually before commit
