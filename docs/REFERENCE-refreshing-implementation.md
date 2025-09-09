# 🔄 Refreshing Implementation Reference

## 📋 Overview

Dokumen ini berisi implementasi refreshing yang digunakan di Account Balancing untuk mengatasi masalah Google Sheets cache dan data consistency.

## 🎯 Kapan Menggunakan Refreshing

### ✅ **Gunakan Refreshing Ketika:**

- Data yang di-update **mempengaruhi perhitungan lain**
- Google Sheets **cache agresif** menyebabkan data tidak ter-update
- User perlu melihat **data terbaru** setelah update
- Ada **data dependency** yang perlu di-refresh

### ❌ **Tidak Perlu Refreshing Ketika:**

- Data **terisolasi** dan tidak mempengaruhi perhitungan lain
- **Auto refresh** sudah cukup
- **User experience** sudah optimal tanpa refreshing

## 🔧 Implementasi Refreshing

### **1. State Management**

```javascript
const [refreshing, setRefreshing] = useState(false);
```

### **2. Button Loading State**

```javascript
<button
    disabled={loading || refreshing || !realBalance}
    className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
>
    {(loading || refreshing) && (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    )}
    <span>
        {loading
            ? "Updating..."
            : refreshing
              ? "Refreshing..."
              : `Update ${accountName}`}
    </span>
</button>
```

### **3. Refreshing Logic**

```javascript
// Force refresh account data with cache busting
setRefreshing(true);
await mutate();

// Additional delay to ensure Google Sheets cache is cleared
setTimeout(async () => {
    // Force refresh with cache busting
    await mutate();
    setRefreshing(false);

    // Show success message after refresh is complete
    setResult({
        success: true,
        data,
        difference: parseFloat(realBalance) - currentBalance,
    });
}, 3000);
```

### **4. Visual Feedback**

```javascript
{
    refreshing && (
        <p className="text-xs text-blue-600 mt-2">
            🔄 Refreshing data to show updated reality balance...
        </p>
    );
}
```

## 🎨 UI Components

### **Loading Spinner**

```javascript
<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
```

### **Refreshing Message**

```javascript
<p className="text-xs text-blue-600 mt-2">
    🔄 Refreshing data to show updated reality balance...
</p>
```

## ⚙️ Configuration

### **Timing**

- **Immediate refresh**: `await mutate()`
- **Delayed refresh**: `setTimeout(..., 3000)`
- **Total duration**: ~3 detik

### **Cache Busting**

- **SWR mutate()**: Force refresh data
- **Multiple calls**: Ensure cache is cleared
- **Delay**: Allow Google Sheets to process

## 🚀 Implementation Steps

1. **Add state**: `const [refreshing, setRefreshing] = useState(false);`
2. **Update button**: Add loading states and spinner
3. **Add logic**: Implement refreshing after successful update
4. **Add feedback**: Show refreshing message to user
5. **Test**: Verify data consistency after update

## 📝 Notes

- **Google Sheets cache** bisa sangat agresif
- **Multiple refresh** kadang diperlukan
- **User feedback** penting untuk UX
- **Timing** bisa disesuaikan berdasarkan kebutuhan

## 🔄 Rollback

Jika refreshing tidak diperlukan, cukup hapus:

- `refreshing` state
- Loading states di button
- Refreshing logic
- Visual feedback

Gunakan simple refresh: `await mutate();`
