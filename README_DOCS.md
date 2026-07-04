# 📚 HABIT TRACKER - DOCUMENTATION INDEX

Selamat datang! Berikut adalah semua dokumentasi untuk menjalankan Habit Tracker di local.

---

## 🚀 MULAI CEPAT (REKOMENDASIAN)

### Pertama kali setup? ⭐
👉 Baca: **[QUICK_START.md](QUICK_START.md)** (5 menit)

### Panduan lengkap?
👉 Baca: **[CARA_MENJALANKAN.md](CARA_MENJALANKAN.md)** (15 menit)

---

## 🛠️ SETUP DATABASE

### Untuk setup Supabase:
- **[SETUP_SUPABASE.sql](SETUP_SUPABASE.sql)** - SQL script siap copy-paste
- **[DATABASE_SETUP.md](DATABASE_SETUP.md)** - Panduan setup database

### Error di database?
- **[ACTUAL_ERROR_FOUND.md](ACTUAL_ERROR_FOUND.md)** - Error: Foreign Key Constraint
- **[FIX_USERS_TABLE.sql](FIX_USERS_TABLE.sql)** - Fix: Insert users data
- **[ERROR_FIX_GUIDE.md](ERROR_FIX_GUIDE.md)** - Panduan troubleshoot lengkap

---

## 🔧 INTEGRASI

### Supabase Integration:
- **[SUPABASE_INTEGRATION.md](SUPABASE_INTEGRATION.md)** - Detail integrasi Supabase

### SQL Schema:
- **[sql/schema.sql](sql/schema.sql)** - Database schema penuh dengan comments

---

## 📖 REFERENCES

| File | Deskripsi |
|------|-----------|
| [QUICK_START.md](QUICK_START.md) | ⭐ Mulai di sini (5 menit) |
| [CARA_MENJALANKAN.md](CARA_MENJALANKAN.md) | Panduan lengkap (15 menit) |
| [SETUP_SUPABASE.sql](SETUP_SUPABASE.sql) | SQL script ready-to-run |
| [ERROR_FIX_GUIDE.md](ERROR_FIX_GUIDE.md) | Troubleshooting guide |
| [QUICK_FIX.md](QUICK_FIX.md) | Quick fixes |
| [DATABASE_SETUP.md](DATABASE_SETUP.md) | Database setup guide |
| [SUPABASE_INTEGRATION.md](SUPABASE_INTEGRATION.md) | Integration details |
| [lib/supabase.js](lib/supabase.js) | Supabase client |
| [lib/store.js](lib/store.js) | Database functions |

---

## 🎯 JIKA BARU PERTAMA KALI

### Langkah 1: Baca [QUICK_START.md](QUICK_START.md)
Panduan 5 menit untuk setup & run aplikasi

### Langkah 2: Follow step-by-step
- Setup database di Supabase
- Install dependencies
- Run dev server

### Langkah 3: Test aplikasi
- Buka http://localhost:3000
- Tambah activity
- Verifikasi di Supabase

### Langkah 4: Done! 🎉

---

## 🆘 ADA ERROR?

### Langkah 1: Lihat error message
- F12 di browser → Console tab
- Lihat di terminal dimana npm run dev jalan

### Langkah 2: Cari di docs
- Error "Foreign Key"? → [ACTUAL_ERROR_FOUND.md](ACTUAL_ERROR_FOUND.md)
- Error database? → [ERROR_FIX_GUIDE.md](ERROR_FIX_GUIDE.md)
- Error umum? → [QUICK_FIX.md](QUICK_FIX.md)

### Langkah 3: Follow solusi
Biasanya ada di troubleshooting section

---

## 📋 QUICK COMMANDS

```bash
# Masuk ke project folder
cd d:\Belajar\habit tracker\habit-tracker

# Install dependencies
npm install

# Run dev server
npm run dev

# Stop server
Ctrl + C

# Restart server
npm run dev
```

---

## 🌐 AKSES APLIKASI

**Dev Mode:**
- URL: http://localhost:3000
- Auto-reload saat edit file
- Console error visible di browser

**Production Build:**
```bash
npm run build
npm start
```

---

## 📊 PROJECT STRUCTURE

```
habit-tracker/
├── app/                          # Next.js app
│   ├── page.js                   # Main page
│   ├── layout.js                 # Root layout
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ActivityList.jsx
│   ├── ReportModal.jsx
│   └── WeeklyStatsPanel.jsx
├── lib/                          # Utilities
│   ├── supabase.js               # Supabase client
│   ├── store.js                  # Data functions (DB operations)
│   └── constants.js              # Constants
├── public/                       # Static files
├── .env.local                    # Environment variables (JANGAN DI-PUSH!)
├── .gitignore
├── package.json
├── next.config.mjs
├── tsconfig.json
└── [documentation files]         # Panduan setup
```

---

## ✅ SETUP CHECKLIST

- [ ] Node.js v18+ installed
- [ ] npm v9+ installed
- [ ] Project folder siap (d:\Belajar\habit tracker\habit-tracker)
- [ ] .env.local ada dengan credentials Supabase
- [ ] SQL script sudah di-run di Supabase
- [ ] Database tables ada (users, activities)
- [ ] npm install selesai
- [ ] npm run dev jalan
- [ ] http://localhost:3000 bisa dibuka
- [ ] Test submit activity berhasil
- [ ] Data muncul di Supabase

---

## 🚀 NEXT STEPS

Setelah setup berhasil:
1. Explore aplikasi
2. Test semua fitur
3. Baca code di `app/page.js` dan `lib/store.js`
4. Customize sesuai kebutuhan!

---

## 💬 FAQ

**Q: Gimana caranya clear data?**
A: Di aplikasi ada tombol RotateCcw (reset), atau hapus manual di Supabase Table Editor

**Q: Bisa akses dari mobile/device lain?**
A: Ya! Dev server jalan di: http://172.16.0.2:3000 (lihat di terminal saat npm run dev)

**Q: Gimana deploy ke production?**
A: Build dulu (`npm run build`), terus deploy ke Vercel/Netlify (tutorial terpisah)

**Q: Data tersimpan dimana?**
A: Di Supabase PostgreSQL database (lihat di Table Editor)

---

**Happy coding! 🎉**

Jika ada pertanyaan, baca docs yang relevan atau check troubleshooting section.
