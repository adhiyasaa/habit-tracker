# 🔧 SETUP DATABASE SUPABASE - STEP BY STEP

## ❌ MASALAH SAAT INI
Error: `Error adding activity: {}`

**Penyebab**: Tabel `activities` dan `users` belum dibuat di Supabase

---

## ✅ SOLUSI - IKUTI LANGKAH INI:

### STEP 1: Buka Supabase Dashboard
1. Pergi ke https://supabase.com
2. Login dengan akun Anda
3. Klik project: **aucjicqpcojsganykjks** (atau nama project Anda)

### STEP 2: Buka SQL Editor
- Di sidebar kiri, klik **SQL Editor**
- Atau pergi ke: **Authentication → SQL Editor**

### STEP 3: Create New Query
- Klik **+ New Query**
- Atau klik **New** dan pilih **SQL**

### STEP 4: Copy & Paste SQL Berikut

Copy semua ini ke SQL Editor:

```sql
-- 1. CREATE USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CREATE ACTIVITIES TABLE
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

-- 3. CREATE INDEXES
CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_date ON activities(date);
CREATE INDEX idx_activities_user_date ON activities(user_id, date);

-- 4. ENABLE ROW LEVEL SECURITY
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- 5. DROP EXISTING POLICIES (jika ada)
DROP POLICY IF EXISTS "Anyone can read users" ON users;
DROP POLICY IF EXISTS "Anyone can insert users" ON users;
DROP POLICY IF EXISTS "Anyone can update users" ON users;
DROP POLICY IF EXISTS "Anyone can read activities" ON activities;
DROP POLICY IF EXISTS "Anyone can insert activities" ON activities;
DROP POLICY IF EXISTS "Anyone can update activities" ON activities;
DROP POLICY IF EXISTS "Anyone can delete activities" ON activities;

-- 6. CREATE RLS POLICIES UNTUK USERS
CREATE POLICY "Anyone can read users" ON users FOR SELECT USING (true);
CREATE POLICY "Anyone can insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update users" ON users FOR UPDATE USING (true) WITH CHECK (true);

-- 7. CREATE RLS POLICIES UNTUK ACTIVITIES
CREATE POLICY "Anyone can read activities" ON activities FOR SELECT USING (true);
CREATE POLICY "Anyone can insert activities" ON activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update activities" ON activities FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete activities" ON activities FOR DELETE USING (true);

-- 8. INSERT SAMPLE USERS
INSERT INTO users (id, name, email) VALUES
  ('tsalysa', 'Tsalysa', 'tsalysa@example.com'),
  ('adhiya', 'Adhiya', 'adhiya@example.com')
ON CONFLICT (id) DO NOTHING;
```

### STEP 5: Run Query
- Klik tombol **Run** atau **Execute** (biasanya warna biru di bawah)
- Atau tekan `Ctrl + Enter`

### STEP 6: Verifikasi Berhasil
Anda seharusnya melihat:
- ✅ Pesan sukses di console
- ✅ Tidak ada error merah

### STEP 7: Lihat Tabel
- Klik **Table Editor** di sidebar
- Anda seharusnya bisa lihat:
  - ✅ `users` table dengan 2 data (tsalysa, adhiya)
  - ✅ `activities` table (masih kosong, nanti ada)

---

## 🧪 TEST APLIKASI SETELAH SETUP

1. Buka http://localhost:3000
2. Klik tombol **"Catat Aktivitas Tsalysa"**
3. Pilih aktivitas (misal: Gym)
4. Klik **"Catat Aktivitas"**
5. Seharusnya muncul: **"Aktivitas Tercatat! +10 poin"** ✅

### Jika Masih Error:
- Buka Browser DevTools: **F12**
- Pergi ke tab **Console**
- Lihat error message lengkapnya
- Screenshot dan share error message

---

## ❓ TROUBLESHOOTING

### Error: "Permission denied" atau "row-level security policy"
→ RLS policies tidak benar. Re-run SQL dengan DROP POLICY dulu

### Error: "Relation 'activities' does not exist"
→ Tabel belum dibuat. Re-run SQL dari step 4

### Error: "UNIQUE constraint failed"
→ User sudah ada. Itu normal, data duplicate akan di-skip dengan `ON CONFLICT DO NOTHING`

### Aplikasi blank / tidak load
→ Lihat tab **Network** di DevTools, cek apakah Supabase URL correct di `.env.local`

---

## 📊 VERIFY DI SUPABASE DASHBOARD

### Cek Users:
- Supabase → **Table Editor** → **users**
- Seharusnya ada 2 rows:
  - id: `tsalysa`, name: `Tsalysa`
  - id: `adhiya`, name: `Adhiya`

### Cek Activities:
- Supabase → **Table Editor** → **activities**
- Setelah test aplikasi, seharusnya ada data masuk

---

## 🚨 JIKA MASIH TIDAK BEKERJA

Kemungkinan:
1. ❌ SQL belum di-run (cek step 5)
2. ❌ Credentials .env.local salah (cek di Supabase Settings → API)
3. ❌ Browser cache issue → Clear cache (`Ctrl+Shift+Del`)
4. ❌ Dev server belum restart → Stop dan jalankan `npm run dev` lagi

---

**Mari kita fix! Follow langkah-langkah di atas ya!** 🚀
