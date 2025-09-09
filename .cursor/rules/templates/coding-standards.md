# Coding Standards & Best Practices

## Code Style

- **Components**: Use [COMPONENT_TYPE] with [HOOKS_TYPE]
- **Functions**: Prefer [FUNCTION_STYLE] for components and event handlers
- **Naming**:
    - Components: [COMPONENT_NAMING] (e.g., `[COMPONENT_EXAMPLE]`)
    - Files: [FILE_NAMING] for pages (e.g., `[PAGE_EXAMPLE]`), [COMPONENT_NAMING] for components
    - Variables: [VARIABLE_NAMING] (e.g., `[VARIABLE_EXAMPLE]`)
    - Constants: [CONSTANT_NAMING] (e.g., `[CONSTANT_EXAMPLE]`)

## [FRAMEWORK] Patterns

### State Management
- Use `[LOCAL_STATE_HOOK]` for local component state
- Use `[EFFECT_HOOK]` for side effects and data fetching
- Use `[MEMO_HOOK]` for expensive calculations
- Use `[CALLBACK_HOOK]` for event handlers passed to child components
- Use `[REF_HOOK]` for DOM references and mutable values

### Custom Hooks
- Create custom hooks for reusable [HOOK_PURPOSE] (e.g., `[HOOK_EXAMPLE]`)
- Use [DATA_FETCHING_LIBRARY] for server state management with built-in caching and revalidation
- Implement proper error handling and loading states in custom hooks
- Return consistent hook interface: `{ [HOOK_RETURN_INTERFACE] }`

### Data Fetching
- Use [DATA_FETCHING_LIBRARY] for all API calls with proper configuration
- Implement cache busting for real-time data updates
- Add proper error boundaries and fallback states
- Use consistent API response structure

## File Organization

### Component Structure
```
components/
├── [COMPONENT_NAME]/
│   ├── [MAIN_FILE]          # Main component export
│   └── [IMPLEMENTATION_FILE]  # Component implementation
```

### Utility Organization
```
utils/
├── [UTILS_1].js              # [UTILS_1_DESCRIPTION]
├── [UTILS_2].js              # [UTILS_2_DESCRIPTION]
├── [UTILS_3].js              # [UTILS_3_DESCRIPTION]
└── [UTILS_4].js              # [UTILS_4_DESCRIPTION]
```

### [FRAMEWORK] Structure
```
[PAGES_DIR]/
├── [FEATURE_NAME]/
│   ├── [PAGE_FILE]           # Main page component
│   ├── [UTILS_FILE]          # Page-specific utilities
│   └── [SUB_FEATURE]/
│       └── [PAGE_FILE]       # Nested page
```

## Import/Export Patterns

### Component Exports
```javascript
// components/[COMPONENT_NAME]/[MAIN_FILE]
export { default as [COMPONENT_1] } from "./[COMPONENT_1]";
export { default as [COMPONENT_2] } from "./[COMPONENT_2]";
export { default as [COMPONENT_3] } from "./[COMPONENT_3]";
```

### Utility Exports
```javascript
// utils/[UTILS_FILE]
export function [FUNCTION_NAME]([PARAMETERS]) {
    // Implementation
}

export function [ANOTHER_FUNCTION]([PARAMETERS]) {
    // Implementation
}
```

### Import Patterns
```javascript
// Use absolute imports with [IMPORT_PREFIX]
import { [HOOK_1], [HOOK_2] } from "@/utils/[HOOKS_FILE]";
import { [FUNCTION_1], [FUNCTION_2] } from "@/utils/[HELPER_FILE]";
import { [COMPONENT_1], [COMPONENT_2] } from "@/components/[COMPONENT_DIR]";
```

## [DATA_FETCHING_LIBRARY] Integration

### Custom Hook Pattern
```javascript
export const [HOOK_NAME] = ([PARAMETERS]) => {
    const { data, error, isLoading, mutate } = [DATA_FETCHING_LIBRARY](
        [KEY_CONDITION] ? `[KEY_PREFIX]-${[PARAMETER]}` : null,
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
// [API_DIR]/[ENDPOINT]/[ROUTE_FILE]
export async function [HTTP_METHOD](request) {
    try {
        // API logic
        return [RESPONSE_TYPE].json({ data: result });
    } catch (error) {
        return [RESPONSE_TYPE].json(
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
        <div className="[ERROR_CONTAINER_CLASSES]">
            <div className="[ERROR_ICON_CLASSES]">[ERROR_ICON]</div>
            <p className="[ERROR_MESSAGE_CLASSES]">[ERROR_MESSAGE]</p>
            <p className="[ERROR_DETAILS_CLASSES]">[ERROR_DETAILS]</p>
        </div>
    );
}
```

### Loading States
```javascript
if (isLoading) {
    return (
        <div className="[LOADING_CONTAINER_CLASSES]">
            <div className="[LOADING_SKELETON_CLASSES]"></div>
            <div className="[LOADING_SKELETON_CLASSES]"></div>
        </div>
    );
}
```

## Code Quality

### Function Documentation
```javascript
/**
 * [FUNCTION_DESCRIPTION]
 * @param {[PARAM_TYPE]} [PARAM_NAME] - [PARAM_DESCRIPTION]
 * @param {[PARAM_TYPE]} [PARAM_NAME] - [PARAM_DESCRIPTION]
 * @returns {[RETURN_TYPE]} [RETURN_DESCRIPTION]
 */
export function [FUNCTION_NAME]([PARAMETERS]) {
    // Implementation
}
```

### Consistent Error Messages
- Use descriptive error messages
- Include context about what failed
- Provide actionable next steps
- Use consistent error styling and icons

### Performance Considerations
- Use `[MEMO_HOOK]` for expensive calculations
- Use `[CALLBACK_HOOK]` for event handlers in lists
- Implement proper loading states
- Use [DATA_FETCHING_LIBRARY]'s built-in caching and deduplication
- Lazy load non-critical components

## Testing Guidelines

### Manual Testing Checklist
- [ ] Test all user interactions
- [ ] Verify error states and recovery
- [ ] Check loading states
- [ ] Test responsive design
- [ ] Validate data flow and state updates
- [ ] Test [SPECIFIC_FEATURES]

## Customization Guide

### Required Replacements
1. **[FRAMEWORK]** → Your framework (React, Vue, Angular, etc.)
2. **[COMPONENT_TYPE]** → functional components, class components, etc.
3. **[HOOKS_TYPE]** → React hooks, Vue composition API, etc.
4. **[FUNCTION_STYLE]** → arrow functions, function declarations, etc.
5. **[COMPONENT_NAMING]** → PascalCase, kebab-case, etc.
6. **[FILE_NAMING]** → kebab-case, camelCase, etc.
7. **[VARIABLE_NAMING]** → camelCase, snake_case, etc.
8. **[CONSTANT_NAMING]** → UPPER_SNAKE_CASE, etc.

### Framework-Specific Examples

#### React
```javascript
// Component naming: PascalCase
export default function UserProfile() {}

// File naming: PascalCase for components
// UserProfile.js, UserProfile.test.js

// Variable naming: camelCase
const userName = 'john';
const isLoggedIn = true;

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;
```

#### Vue
```javascript
// Component naming: PascalCase
export default {
  name: 'UserProfile'
}

// File naming: PascalCase for components
// UserProfile.vue, UserProfile.spec.js

// Variable naming: camelCase
const userName = 'john';
const isLoggedIn = true;

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
```

#### Angular
```typescript
// Component naming: PascalCase
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html'
})
export class UserProfileComponent {}

// File naming: kebab-case
// user-profile.component.ts, user-profile.component.spec.ts

// Variable naming: camelCase
const userName = 'john';
const isLoggedIn = true;

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
```

## Template Variables

| Variable | Description | React Example | Vue Example | Angular Example |
|----------|-------------|---------------|-------------|-----------------|
| `[FRAMEWORK]` | Main framework | "React" | "Vue" | "Angular" |
| `[COMPONENT_TYPE]` | Component type | "functional components" | "SFC components" | "class components" |
| `[HOOKS_TYPE]` | Hooks system | "React hooks" | "Vue Composition API" | "Angular services" |
| `[FUNCTION_STYLE]` | Function style | "arrow functions" | "arrow functions" | "arrow functions" |
| `[COMPONENT_NAMING]` | Component naming | "PascalCase" | "PascalCase" | "PascalCase" |
| `[FILE_NAMING]` | File naming | "PascalCase" | "PascalCase" | "kebab-case" |
| `[VARIABLE_NAMING]` | Variable naming | "camelCase" | "camelCase" | "camelCase" |
| `[CONSTANT_NAMING]` | Constant naming | "UPPER_SNAKE_CASE" | "UPPER_SNAKE_CASE" | "UPPER_SNAKE_CASE" |
| `[LOCAL_STATE_HOOK]` | Local state hook | "useState" | "ref" | "BehaviorSubject" |
| `[EFFECT_HOOK]` | Effect hook | "useEffect" | "watchEffect" | "ngOnInit" |
| `[MEMO_HOOK]` | Memo hook | "useMemo" | "computed" | "memoize" |
| `[CALLBACK_HOOK]` | Callback hook | "useCallback" | "useCallback" | "memoize" |
| `[REF_HOOK]` | Ref hook | "useRef" | "ref" | "ViewChild" |
| `[DATA_FETCHING_LIBRARY]` | Data fetching | "SWR" | "VueUse" | "HttpClient" |
| `[PAGES_DIR]` | Pages directory | "pages" | "views" | "pages" |
| `[API_DIR]` | API directory | "api" | "api" | "api" |
| `[IMPORT_PREFIX]` | Import prefix | "@/" | "@/" | "@/" |

