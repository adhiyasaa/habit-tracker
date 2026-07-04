# 🚀 CARA MENJALANKAN HABIT TRACKER DI LOCAL

## 📋 PRASYARAT
Pastikan sudah install:
- ✅ Node.js v18+ (cek: `node --version`)
- ✅ npm v9+ (cek: `npm --version`)
- ✅ Git (optional)

---

## 🎯 LANGKAH-LANGKAH SETUP (15 menit)

### STEP 1: Setup Database di Supabase (5 menit)

**1.1 Buka Supabase Dashboard**
- Pergi ke: https://supabase.com/dashboard
- Login dengan akun Anda
- Pilih project: **aucjicqpcojsganykjks**

**1.2 Buka SQL Editor**
- Di sidebar kiri → klik **"SQL Editor"**
- Atau buka: Projects → aucjicqpcojsganykjks → SQL

**1.3 Create New Query**
- Klik **"+ New Query"** atau **"New"**
- Paste file: `SETUP_SUPABASE.sql` (COPY SEMUA)

**1.4 Run Query**
- Klik tombol **"Run"** (warna biru)
- Atau tekan: **Ctrl + Enter**
- Tunggu sampai sukses ✅

**1.5 Verify Tables**
- Klik **"Table Editor"** di sidebar
- Cek:
  - ✅ `users` table ada (2 data: tsalysa, adhiya)
  - ✅ `activities` table ada (kosong)

---

### STEP 2: Setup Project Local (5 menit)

**2.1 Clone / Download Project**

Jika belum punya:
```bash
git clone <repo-url>
cd habit-tracker
```

Atau jika sudah punya, buka folder:
```bash
cd d:\Belajar\habit tracker\habit-tracker
```

**2.2 Install Dependencies**
```bash
npm install
```

Tunggu sampai semua packages terinstall (±30 detik)

**2.3 Verify .env.local**

Pastikan file `.env.local` sudah ada di root project:
```env
NEXT_PUBLIC_SUPABASE_URL=https://aucjicqpcojsganykjks.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_PBUQLDaf1-6Hq-oBDgA8pw_NDuVmFJV
```

Jika belum ada, buat baru.

---

### STEP 3: Jalankan Dev Server (2 menit)

**3.1 Start Development Server**
```bash
npm run dev
```

**Output yang benar:**
```
▲ Next.js 16.2.10 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://172.16.0.2:3000
- Environments: .env.local
✓ Ready in 1045ms
```

**3.2 Buka Browser**
- Pergi ke: **http://localhost:3000**
- Seharusnya muncul aplikasi Habit Tracker ✅

---

## 🧪 TEST APLIKASI

### Test Scenario 1: Tambah Activity
1. Di http://localhost:3000
2. Klik tombol **"Catat Aktivitas Tsalysa"** (FAB - pink button)
3. Pilih aktivitas: **"Gym"**
4. (Optional) Tambah catatan
5. Klik **"Catat Aktivitas"**
6. Seharusnya muncul: **"🎉 Aktivitas Tercatat! +10 poin"** ✅

### Test Scenario 2: Lihat Data di Supabase
1. Buka Supabase Dashboard
2. Klik **"Table Editor"**
3. Klik **"activities"** table
4. Seharusnya ada 1 row activity yang baru ditambahkan ✅

### Test Scenario 3: Switch User
1. Di aplikasi, klik tab **"Adhiya"** (tombol dengan emoji adhiya)
2. Klik **"Catat Aktivitas Adhiya"**
3. Tambah activity
4. Lihat data terupdate di Supabase ✅

---

## 🛑 STOP / RESTART SERVER

### Untuk STOP:
```bash
Ctrl + C
```

Di terminal akan muncul:
```
^C
PS D:\Belajar\habit tracker\habit-tracker>
```

### Untuk RESTART:
```bash
npm run dev
```

---

## 📁 PROJECT STRUCTURE

```
habit-tracker/
├── app/
│   ├── globals.css
│   ├── layout.js
│   └── page.js              ← Main page
├── components/
│   ├── ActivityList.jsx
│   ├── ReportModal.jsx      ← Form untuk tambah activity
│   └── WeeklyStatsPanel.jsx
├── lib/
│   ├── store.js             ← Supabase functions
│   ├── supabase.js          ← Supabase client
│   └── constants.js
├── .env.local               ← Credentials (JANGAN di-push!)
├── package.json
└── ...
```

---

## 🔧 TROUBLESHOOTING

### ❌ Error: "Error adding activity: {}"

**Penyebab:** Users table kosong

**Solusi:**
```sql
-- Jalankan di Supabase SQL Editor:
INSERT INTO users (id, name, email) VALUES 
  ('tsalysa', 'Tsalysa', 'tsalysa@example.com'),
  ('adhiya', 'Adhiya', 'adhiya@example.com')
ON CONFLICT (id) DO NOTHING;
```

### ❌ Error: "Port 3000 already in use"

**Penyebab:** Ada process lain yang pakai port 3000

**Solusi:**
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Atau cukup ganti port:
npm run dev -- --port 3001
```

### ❌ Error: "Missing Supabase credentials"

**Penyebab:** .env.local tidak ada atau credentials salah

**Solusi:**
1. Buka file `.env.local`
2. Cek credentials di Supabase → Settings → API
3. Update `.env.local`
4. Restart server: `npm run dev`

### ❌ Aplikasi blank / tidak load

**Penyebab:** Biasanya cache browser

**Solusi:**
1. Buka DevTools: **F12**
2. Hard refresh: **Ctrl + Shift + R** (Windows) atau **Cmd + Shift + R** (Mac)
3. Atau: Clear cache → **Ctrl + Shift + Del**

### ❌ Tabel tidak muncul di Table Editor

**Penyebab:** SQL belum di-run sempurna

**Solusi:**
1. Buka SQL Editor di Supabase
2. Run ini:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```
3. Cek output apakah `users` dan `activities` ada
4. Jika tidak ada, re-run `SETUP_SUPABASE.sql`

---

## 📊 COMMANDS BERGUNA

| Command | Fungsi |
|---------|--------|
| `npm run dev` | Start development server |
| `npm run build` | Build production |
| `npm start` | Run production build |
| `npm run lint` | Check linting errors |
| `npm install` | Install dependencies |
| `npm install @supabase/supabase-js` | Install Supabase client |

---

## 💡 TIPS

### Development Mode
- Dev server otomatis reload saat edit file
- Console error muncul di browser DevTools
- Server berjalan di: http://localhost:3000

### Production Build
```bash
npm run build
npm start
```

### Debugging
1. Buka **F12** di browser
2. Tab **"Console"** → lihat error messages
3. Tab **"Network"** → lihat API calls
4. Tab **"Application"** → lihat localStorage/cookies

---

## 🎯 RINGKASAN

```bash
# 1. Setup database di Supabase (LANGKAH 1 di atas)
# 2. Install dependencies
npm install

# 3. Jalankan dev server
npm run dev

# 4. Buka browser
# http://localhost:3000

# 5. Test aplikasi ✅
```

**DONE! Aplikasi siap digunakan!** 🚀

---

## 📞 BANTUAN

Jika ada error:
1. **Lihat console:** F12 → Console tab
2. **Cek server log:** Terminal dimana npm run dev
3. **Verifikasi database:** Supabase → Table Editor
4. **Restart:** Ctrl + C, terus npm run dev

**Good luck!** 💪
