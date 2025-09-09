# Cursor Rules Templates

## 📋 Overview
Template rules yang bisa digunakan untuk proyek apapun dengan kualitas yang sama seperti Better Finance.

## 🚀 Cara Penggunaan

### **1. Copy Template Rules**
```bash
# Copy template rules ke proyek baru
cp -r .cursor/rules/templates/ ../new-project/.cursor/rules/
```

### **2. Customize untuk Proyek**
- Edit `project-overview.md` dengan detail proyek baru
- Sesuaikan `coding-standards.md` dengan tech stack
- Update `ui-ux-patterns.md` dengan design system
- Modifikasi `api-integration.md` dengan data source

### **3. Pilih Rules yang Diperlukan**
- **Proyek Kecil**: 4 file dasar
- **Proyek Menengah**: + api-integration.md
- **Proyek Besar**: Semua 7 file

## 📁 File Structure
```
templates/
├── README.md                    # Panduan penggunaan
├── project-overview.md          # Template overview proyek
├── coding-standards.md          # Standar coding universal
├── ui-ux-patterns.md            # Pola UI/UX generik
├── api-integration.md           # Template API integration
├── component-patterns.md        # Pola komponen universal
├── deployment-guidelines.md     # Panduan deployment
└── customization-guide.md       # Panduan kustomisasi
```

## 🎨 Customization Levels

### **Level 1: Basic (5 menit)**
- Ganti nama proyek
- Update tech stack
- Sesuaikan warna utama

### **Level 2: Intermediate (15 menit)**
- Customize component patterns
- Update API integration
- Sesuaikan deployment strategy

### **Level 3: Advanced (30 menit)**
- Full customization
- Add project-specific patterns
- Create custom rules

## 🔧 Quick Start Commands

```bash
# 1. Copy templates
cp -r .cursor/rules/templates/ ../new-project/.cursor/rules/

# 2. Rename project
find ../new-project/.cursor/rules/ -name "*.md" -exec sed -i 's/Better Finance/Your Project Name/g' {} \;

# 3. Update tech stack
find ../new-project/.cursor/rules/ -name "*.md" -exec sed -i 's/Next.js 14/Your Framework/g' {} \;

# 4. Customize colors
find ../new-project/.cursor/rules/ -name "*.md" -exec sed -i 's/blue-600/your-primary-color/g' {} \;
```

## 📚 Best Practices

1. **Always customize** untuk proyek spesifik
2. **Keep templates updated** dengan best practices terbaru
3. **Document changes** yang dibuat
4. **Share templates** dengan tim untuk konsistensi
5. **Version control** template rules

## 🆕 Template Updates

Template ini akan diupdate secara berkala dengan:
- Best practices terbaru
- New patterns yang ditemukan
- Bug fixes dan improvements
- New technology support

## 🤝 Contributing

Jika menemukan pattern baru atau improvement:
1. Update template yang sesuai
2. Test di proyek baru
3. Document perubahan
4. Share dengan tim

