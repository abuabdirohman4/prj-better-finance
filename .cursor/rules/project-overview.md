# Better Finance App - Project Overview

## Project Description
Better Finance is a Next.js application with Progressive Web App (PWA) capabilities for personal finance management. The app focuses on budgeting, transaction tracking, and financial planning with a user-friendly interface.

## Tech Stack
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **PWA**: Service Worker, Manifest, Offline capabilities
- **State Management**: React Hooks (useState, useEffect)
- **Build Tool**: Next.js built-in bundler

## Project Structure
```
app/                    # Next.js App Router pages
├── budgets/           # Budget management pages
├── transactions/      # Transaction tracking pages
└── layout.js         # Root layout
components/            # Reusable UI components
├── BottomNav/        # Bottom navigation
├── Card/             # Card components (Budget, Transaction)
├── PWA/              # PWA-related components
└── SplashScreen/     # App splash screen
configs/               # Configuration files
public/                # Static assets & PWA files
utils/                 # Utility functions & helpers
```

## Key Features
- Budget planning and tracking
- Transaction management
- PWA capabilities (offline, installable)
- Responsive design (mobile-first)
- Dark theme support
