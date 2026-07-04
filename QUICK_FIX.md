# ⚡ QUICK FIX - ERROR ADDING ACTIVITY

## 🔴 MASALAH
Console Error: `Error adding activity: {}`

## ✅ PENYEBAB
Tabel database belum dibuat di Supabase

## 🚀 SOLUSI CEPAT (5 Menit)

### 1️⃣ Buka Supabase
https://supabase.com → Login → Pilih Project

### 2️⃣ SQL Editor
Di sidebar kiri → klik **"SQL Editor"**

### 3️⃣ New Query
Klik **"+ New Query"** atau **"New"** → **"SQL"**

### 4️⃣ COPY INI
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

### 5️⃣ PASTE & RUN
- Paste di SQL Editor
- Klik **"Run"** atau **"Execute"** 
- Tunggu sampai selesai ✅

### 6️⃣ VERIFY
- Sidebar → **"Table Editor"**
- Cek: users & activities tabel ada?

### 7️⃣ TEST APLIKASI
- http://localhost:3000
- Klik "Catat Aktivitas"
- Tambah aktivitas
- **DONE!** ✅

---

## 🆘 MASIH ERROR?

**Di Browser Console (F12):**
- Lihat pesan error baru
- Share error message lengkapnya

**Kemungkinan masalah:**
- ❌ Credentials .env.local salah → cek di Supabase Settings
- ❌ SQL belum dijalankan → cek tabel di Table Editor
- ❌ Browser cache → `Ctrl+Shift+Del` clear cache

---

**Mohon follow langkah di atas, akan fix! 🔧**
