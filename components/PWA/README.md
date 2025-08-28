# PWA Components

Folder ini berisi semua komponen yang terkait dengan Progressive Web App (PWA) functionality.

## 📁 Struktur Folder

```
components/PWA/
├── index.js          # Komponen utama yang menggabungkan semua fitur PWA
└── README.md         # Dokumentasi ini
```

## 🚀 Fitur yang Tersedia

### 1. **Offline Indicator** 
- Muncul di bagian atas layar saat user offline
- Warna merah dengan icon warning
- Otomatis hilang saat koneksi internet kembali

### 2. **Update Available**
- Muncul di bagian atas layar saat ada update baru
- Warna biru dengan tombol update
- User bisa update atau dismiss notifikasi

### 3. **PWA Install Prompt**
- Muncul di bagian bawah layar untuk mengajak install app
- Menampilkan icon app dan deskripsi
- Tombol Install dan Not now

## 🔧 Cara Penggunaan

```jsx
import PWAComponents from "@/components/PWA";

export default function Layout({ children }) {
  return (
    <div>
      <PWAComponents />
      {children}
    </div>
  );
}
```

## 📱 Event Handlers

- `beforeinstallprompt` - Untuk PWA install prompt
- `online/offline` - Untuk status koneksi internet
- `controllerchange` - Untuk service worker updates

## 🎨 Styling

- Menggunakan Tailwind CSS
- Responsive design
- Dark mode support
- Z-index tinggi untuk overlay

## 🔄 State Management

- `deferredPrompt` - Menyimpan install prompt
- `showInstallPrompt` - Toggle install prompt
- `isOnline` - Status koneksi internet
- `showUpdatePrompt` - Toggle update notification

## 🧹 Cleanup

Semua event listeners dibersihkan saat komponen unmount untuk mencegah memory leak.

