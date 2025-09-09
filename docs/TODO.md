# 📋 Better Finance - Todo List

## 🎯 Overview
A comprehensive todo list for the development of the Better Finance application (financial management) built with Next.js, Tailwind CSS, and Google Sheets integration.

---

### 💳 BUG ISSUE
- [x] Budget value decrease when categories/budget item hide
- [x] Fix Warning: Extra attributes from the server: data-new-gr-c-s-check-loaded, data-gr-ext-installed
- [x] Fix Warning: In HTML, cannot be a descendant of . This will cause a hydration error.
- [x] Floating "Clear Cache" in web
- [x] Add back button in page transactions & accounts
- [x] Current week automatically change based date
- [x] When typing digit, keyboard be only number
- [x] (Balancing) When delete/backspace balancing in the middle number, cursor will move to the end
- [x] Update icon weekly & budget (make different)
- [ ] App view in samsung larger than xiaomi (make consistent)

### 💳 LIST IDEA
- [x] Remove Transactions & Accounts in bottom navbar, access from home
- [x] Change UI of budgets to have remaining & use long style currency like weekly budget 
- [x] Add eye hide unhide in home for Assets
- [x] Click categories to filter
- [x] Click & filter based week 
- [x] Filter for all month

### 💳 REFACTORING
- [x] Move file weekly-budget to budgets/weekly
- [x] Merge formatCurrencyShort to formatCurrency
- [ ] Remove unused fetchTransactions, fetchBudgets, fetchGoals, fetchAccounts
- [ ] Remove unused code & comment
- [ ] Undestanding flow code & each function & code goals

### 💳 Account/Wallet Management (HIGH PRIORITY)
- [x] **Account Overview**
  - [x] Integration dengan Google Sheets "Summary"
  - [x] Real-time balance display untuk semua account
  - [x] Account categorization (Wallet, ATM, Platform, etc.)
  - [x] Account balance tracking
  - [x] Show decimal for Mandiri & BCA
  - [x] Show multiple fraction money for Wallet
  - [x] Show actual balance in home, data balance in accounts

- [x] **Issue Tracker**
  - [x] Error update balancing in production
  - [x] Make button as component

### 📈 Weekly Budget Tracking - Eating Category (HIGH PRIORITY)
- [x] **Weekly Budget System**
  - [x] Weekly budget calculation untuk kategori Eating
  - [x] Subcategory weekly budget breakdown
  - [x] Weekly spending progress tracking
  - [x] Remaining weekly budget display
  - [x] Implement Dynamic Weekly Budget with Monthly Pool Strategy based Days
  - [x] Implement also for under spending

### 🏠 Assets Management (HIGH PRIORITY)
- [x] **Assets Tracking**
  - [x] Dedicated Google Sheets integration untuk assets
  - [x] Asset categorization (Liquid & Non Liquid)

- [x] **Assets Features**
  - [x] Asset allocation visualization
  - [x] Net worth calculation

### ⚙️ Settings Consolidation (HIGH PRIORITY)
- [x] **Settings Management**
  - [x] Centralized settings access (single entry point)
  - [x] Remove duplicate settings buttons dari Budgets & Goals pages
  - [x] Settings access hanya di home atau bottom navbar

### 🧭 Navigation Redesign (HIGH PRIORITY)
- [x] **Bottom Navigation Upgrade**
  - [x] Redesigned bottom navigation (max 4 items + 1 center action)
  - [x] Navigation structure planning untuk 7 halaman total
  - [x] Settings access consolidation

### 🔍 Advanced Transaction Filtering (HIGH PRIORITY)
- [x] **Google Sheets-like Filtering**
  - [x] Multi-criteria filtering (type, account, category, note, date)
  - [x] Filter by transaction type (Spending/Earning)
  - [x] Filter by account (Wallet, ATM, Platform, etc.)
  - [x] Filter by category or account
  - [x] Filter by note content
  - [x] When no items, show not found
  - [x] Make Hide & show for filter
  - [x] Sort ascending for accounts & category

### 🤖 AI Integration - Google Gemini (HIGH PRIORITY)
- [ ] **AI Financial Advisor**
  - [ ] Google Gemini API integration
  - [ ] Personalized financial advice
  - [ ] Spending behavior warnings
  - [ ] Financial health alerts
  - [ ] Smart budget suggestions
  - [ ] Goal optimization recommendations
  - [ ] Transaction behavior analysis
  - [ ] Spending habit recommendations
  - [ ] Financial Check Up
---