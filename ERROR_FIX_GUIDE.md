# 🔴 ERROR FIX GUIDE - Habit Tracker Supabase Integration

## ❌ ERROR YANG TERJADI
```
Console Error: Error adding activity: {}
```

Ini berarti aplikasi tidak bisa connect/insert ke Supabase activities table.

---

## 🔍 ROOT CAUSE
Tabel `activities` dan `users` **BELUM DIBUAT** di Supabase database Anda.

---

## ✅ SOLUSI - IKUTI 3 LANGKAH MUDAH

### LANGKAH 1: Setup Database di Supabase (5 menit)

**Buka:** https://supabase.com/dashboard/project/aucjicqpcojsganykjks

**Atau jika di redirect:**
1. Login ke Supabase
2. Klik project Anda
3. Di sidebar kiri → **SQL Editor**

**Klik "New Query" atau "+ New"**

**Copy & Paste script ini:**
```sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('gym', 'lari', 'olahraga_lain', 'kegiatan_lain')),
  custom_name TEXT,
  notes TEXT,
  date DATE NOT NULL,
  points INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_activities_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_date ON activities(date);
CREATE INDEX idx_activities_user_date ON activities(user_id, date);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read users" ON users;
DROP POLICY IF EXISTS "Anyone can insert users" ON users;
DROP POLICY IF EXISTS "Anyone can update users" ON users;
DROP POLICY IF EXISTS "Anyone can read activities" ON activities;
DROP POLICY IF EXISTS "Anyone can insert activities" ON activities;
DROP POLICY IF EXISTS "Anyone can update activities" ON activities;
DROP POLICY IF EXISTS "Anyone can delete activities" ON activities;

CREATE POLICY "Anyone can read users" ON users FOR SELECT USING (true);
CREATE POLICY "Anyone can insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update users" ON users FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can read activities" ON activities FOR SELECT USING (true);
CREATE POLICY "Anyone can insert activities" ON activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update activities" ON activities FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete activities" ON activities FOR DELETE USING (true);

INSERT INTO users (id, name, email) VALUES ('tsalysa', 'Tsalysa', 'tsalysa@example.com'), ('adhiya', 'Adhiya', 'adhiya@example.com') ON CONFLICT (id) DO NOTHING;
```

**Klik "Run" atau tekan Ctrl+Enter**

Tunggu sampai berhasil ✅

---

### LANGKAH 2: Verifikasi Tabel

Di Supabase Dashboard:
- Klik **"Table Editor"** di sidebar
- Anda seharusnya lihat:
  - ✅ **users** table (dengan 2 rows: tsalysa, adhiya)
  - ✅ **activities** table (kosong, nanti ada)

Jika tidak ada, **ulangi LANGKAH 1**

---

### LANGKAH 3: Test Aplikasi

1. Buka http://localhost:3000 di browser
2. Klik tombol **"Catat Aktivitas Tsalysa"**
3. Pilih aktivitas (misal: **Gym**)
4. Klik **"Catat Aktivitas"**
5. Seharusnya muncul: **"🎉 Aktivitas Tercatat! +10 poin"** ✅

Jika berhasil, go to LANGKAH 4

Jika masih error, lihat section **TROUBLESHOOTING** di bawah

---

### LANGKAH 4 (Optional): Verify Data di Supabase

Setelah submit aktivitas:
1. Buka Supabase → **Table Editor**
2. Klik **activities** table
3. Anda seharusnya lihat data aktivitas yang baru ditambahkan

---

## 🛠️ FILES YANG SUDAH DIUPDATE

| File | Perubahan |
|------|-----------|
| `lib/store.js` | ✅ Migrated ke Supabase (async functions) |
| `lib/supabase.js` | ✅ Created (Supabase client) |
| `app/page.js` | ✅ Updated (async/await handling) |
| `.env.local` | ✅ Created (dengan credentials Anda) |

**Dev server:** http://localhost:3000 ✅ Running

---

## 🆘 TROUBLESHOOTING

### Error: "Permission denied" / "policy"
**Solusi:** RLS policy belum benar
- Re-run SQL dengan `DROP POLICY` dulu (lihat script di LANGKAH 1)

### Error: "relation 'activities' does not exist"
**Solusi:** Tabel belum dibuat
- Cek di Table Editor apakah tabel ada
- Jika tidak ada, re-run LANGKAH 1

### Still showing "Error adding activity: {}"
**Solusi:** Cek browser console (F12)
1. Buka DevTools: **F12**
2. Pergi ke tab **"Console"**
3. Lihat error message lengkapnya
4. Share error message

**Kemungkinan:**
- ❌ `.env.local` credentials salah
  - Cek di Supabase: Settings → API
  - Pastikan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` benar
  - Restart dev server: `npm run dev`
- ❌ Browser cache
  - Press: `Ctrl + Shift + Del`
  - Clear "Cached images and files"
  - Refresh page

### Blank page / nothing loads
**Solusi:**
1. Buka DevTools: **F12** → **Network** tab
2. Refresh page
3. Lihat apakah ada request error ke Supabase
4. Cek console untuk error message

---

## 📊 CHECKLIST UNTUK VERIFY SETUP

- [ ] SQL script sudah di-run di Supabase
- [ ] `users` table ada dengan 2 data (tsalysa, adhiya)
- [ ] `activities` table ada (kosong)
- [ ] RLS policies ada di kedua tabel
- [ ] `.env.local` sudah dibuat dengan credentials
- [ ] `npm install @supabase/supabase-js` sudah dijalankan
- [ ] Dev server running: `npm run dev`
- [ ] Bisa open http://localhost:3000
- [ ] Bisa klik "Catat Aktivitas" button
- [ ] Bisa submit aktivitas
- [ ] Tidak ada error di console
- [ ] Data muncul di Supabase Table Editor

---

## 📞 JIKA MASIH STUCK

1. **Screenshot error di console** (F12 → Console tab)
2. **Check Table Editor** di Supabase
   - users table ada?
   - activities table ada?
3. **Restart dev server**
   ```bash
   Ctrl + C (stop server)
   npm run dev (start lagi)
   ```

---

**Follow langkah di atas dengan teliti! Pasti bisa! 🚀**
