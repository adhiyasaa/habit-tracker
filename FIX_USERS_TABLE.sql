-- FIX UNTUK ERROR: "Key is not present in table users"

-- Langkah 1: Cek data di users table
SELECT * FROM users;

-- Langkah 2: Jika kosong, jalankan ini:
INSERT INTO users (id, name, email) VALUES 
  ('tsalysa', 'Tsalysa', 'tsalysa@example.com'),
  ('adhiya', 'Adhiya', 'adhiya@example.com')
ON CONFLICT (id) DO NOTHING;

-- Langkah 3: Verifikasi
SELECT * FROM users;

-- Seharusnya ada 2 rows:
-- id: tsalysa, name: Tsalysa, email: tsalysa@example.com
-- id: adhiya, name: Adhiya, email: adhiya@example.com
