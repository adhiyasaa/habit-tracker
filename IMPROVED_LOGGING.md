# 🔍 IMPROVED ERROR LOGGING

## Apa yang Berubah?

Saya sudah improve error logging di `lib/store.js` untuk menampilkan error detail yang lebih jelas.

---

## 📝 LANGKAH SELANJUTNYA

### 1. Refresh Browser
```
F12 → Ctrl + Shift + R (hard refresh)
```

### 2. Buka Console
```
F12 → Console tab
```

### 3. Coba Tambah Aktivitas Lagi
- Klik tombol pink "Catat Aktivitas"
- Submit aktivitas
- Lihat console untuk error detail yang LEBIH JELAS

---

## 🎯 YANG AKAN KAMU LIHAT

Sebelum (error unclear):
```
❌ Error adding activity: {}
```

Setelah (error detail clear):
```
🔴 SUPABASE ERROR:
- Code: 23503
- Message: insert or update on table "activities" violates foreign key constraint
- Details: Key is not present in table "users"
- Hint: null

This usually means:
- User ID 'tsalysa' doesn't exist in users table
- Or table/RLS policies not configured correctly
```

---

## 🛠️ JIKA MASIH ERROR

Error detail yang jelas akan membantu diagnose masalah. Kemungkinan:

### 1. User tidak ada di table
**Solusi:** Insert users (lihat dokumentasi sebelumnya)
```sql
INSERT INTO users (id, name, email) VALUES 
  ('tsalysa', 'Tsalysa', 'tsalysa@example.com'),
  ('adhiya', 'Adhiya', 'adhiya@example.com')
ON CONFLICT (id) DO NOTHING;
```

### 2. Table activities tidak ada
**Solusi:** Run SETUP_SUPABASE.sql di Supabase SQL Editor

### 3. RLS policies tidak benar
**Solusi:** Run SETUP_SUPABASE.sql lagi (includes RLS setup)

---

## 📊 VERIFIKASI DI SUPABASE

Sebelum test, pastikan:

### Check users table
```sql
SELECT * FROM users;
```
Seharusnya ada 2 rows.

### Check activities table
```sql
SELECT * FROM activities;
```
Boleh kosong dulu.

---

## 🧪 TEST LAGI

1. **Refresh browser** (F12 → Ctrl + Shift + R)
2. **Buka console** (F12)
3. **Klik "Catat Aktivitas"**
4. **Submit aktivitas**
5. **Lihat console** untuk error detail
6. **Screenshot error** jika masih ada

---

**Coba sekarang, error message akan lebih jelas!** 🔍
