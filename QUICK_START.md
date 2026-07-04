# ⚡ QUICK START GUIDE - 5 MENIT

## 🎯 LANGKAH CEPAT

### 1️⃣ SETUP DATABASE (Supabase)
```
Buka: https://supabase.com/dashboard
Project: aucjicqpcojsganykjks
SQL Editor → New Query
Paste: SETUP_SUPABASE.sql (COPY SEMUA)
Klik: RUN
```

✅ Done: Seharusnya table users & activities ada

---

### 2️⃣ INSTALL DEPENDENCIES
```bash
cd d:\Belajar\habit tracker\habit-tracker
npm install
```

⏱️ Tunggu: ~30 detik

---

### 3️⃣ RUN DEV SERVER
```bash
npm run dev
```

✅ Output:
```
▲ Next.js 16.2.10 (Turbopack)
- Local: http://localhost:3000
✓ Ready in 1045ms
```

---

### 4️⃣ BUKA BROWSER
```
http://localhost:3000
```

✅ Seharusnya muncul Habit Tracker UI

---

### 5️⃣ TEST APLIKASI
- Klik tombol pink **"Catat Aktivitas Tsalysa"**
- Pilih: **"Gym"**
- Klik: **"Catat Aktivitas"**
- Seharusnya: **"🎉 Aktivitas Tercatat!"** ✅

---

## 🛑 STOP SERVER
```bash
Ctrl + C
```

---

## ❌ ERROR? 

### Error: "Error adding activity"
```sql
-- Jalankan di Supabase SQL Editor:
INSERT INTO users (id, name, email) VALUES 
  ('tsalysa', 'Tsalysa', 'tsalysa@example.com'),
  ('adhiya', 'Adhiya', 'adhiya@example.com')
ON CONFLICT (id) DO NOTHING;
```

### Error: "Port 3000 already in use"
```bash
npm run dev -- --port 3001
```

### Error: "Aplikasi blank"
- F12 → Ctrl + Shift + R (Hard Refresh)

---

## 📊 VERIFIKASI SETUP

- [ ] Node.js installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] .env.local ada & benar
- [ ] SQL sudah di-run di Supabase
- [ ] npm install selesai
- [ ] Dev server running (npm run dev)
- [ ] http://localhost:3000 bisa dibuka
- [ ] Test submit activity bisa
- [ ] Data muncul di Supabase ✅

---

**DONE! Happy coding!** 🚀
