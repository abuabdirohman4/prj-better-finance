# Advanced Transaction Filtering

## Overview
Implementasi fitur filtering transaksi yang mirip dengan Google Sheets, memungkinkan pengguna untuk memfilter transaksi berdasarkan berbagai kriteria.

## Features

### 1. Multi-Criteria Filtering
- **Transaction Type**: Filter berdasarkan Spending/Earning
- **Account**: Filter berdasarkan akun (Wallet, ATM, Platform, dll)
- **Category**: Filter berdasarkan kategori atau akun
- **Note**: Pencarian teks dalam catatan transaksi
- **Date Range**: Filter berdasarkan rentang tanggal

### 2. Filter Components

#### FilterDropdown
- Dropdown yang dapat dikustomisasi
- Support multiple selection
- Searchable options
- Clear individual filters
- Custom icons

#### TransactionFilter
- Komponen utama yang mengintegrasikan semua filter
- Real-time filtering
- Filter presets dan saved filters
- Clear all filters functionality

### 3. Filter Presets
- **Save Current Filter**: Simpan kombinasi filter saat ini
- **Apply Preset**: Terapkan filter yang sudah disimpan
- **Delete Preset**: Hapus filter yang tidak diperlukan
- **Visual Indicators**: Indikator filter aktif

### 4. Real-time Updates
- Summary cards update berdasarkan data yang difilter
- Transaction count indicator
- "Filtered" label pada summary cards
- Empty state untuk hasil filter kosong

## Usage

### Basic Filtering
```jsx
<TransactionFilter
  transactions={transactionData}
  onFilteredTransactions={handleFilteredTransactions}
  onFilterChange={handleFilterChange}
/>
```

### Filter States
```javascript
const filters = {
  transactionType: ['Spending', 'Earning'],
  account: ['Wallet', 'ATM'],
  category: ['Food', 'Transportation'],
  note: 'grab',
  dateRange: {
    start: '2024-01-01',
    end: '2024-01-31'
  }
};
```

## Technical Implementation

### Filter Logic
- Menggunakan `useMemo` untuk optimasi performa
- Real-time filtering tanpa delay
- Support untuk multiple values per filter
- Case-insensitive text search

### State Management
- Local state untuk filter values
- Parent component callback untuk filtered data
- Preset management dengan localStorage (future enhancement)

### UI/UX Features
- Responsive design
- Loading states
- Empty states
- Visual feedback untuk filter aktif
- Intuitive filter controls

## Future Enhancements
- [ ] Persist saved filters to localStorage
- [ ] Export filtered data
- [ ] Advanced date filters (last 7 days, this month, etc.)
- [ ] Amount range filtering
- [ ] Sort by filter criteria
- [ ] Filter templates for common use cases

