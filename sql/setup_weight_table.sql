-- COPY SEMUA INI KE SUPABASE SQL EDITOR DAN RUN --

-- 1. BUAT TABEL BERAT BADAN (WEIGHT LOGS)
CREATE TABLE IF NOT EXISTS weight_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  weight NUMERIC NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign key constraint
  CONSTRAINT fk_weight_user 
    FOREIGN KEY (user_id) 
    REFERENCES users(id) 
    ON DELETE CASCADE
);

-- 2. CREATE INDEX UNTUK PERFORMA
CREATE INDEX IF NOT EXISTS idx_weight_logs_user_id ON weight_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_weight_logs_date ON weight_logs(date);

-- 3. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;

-- Hapus policy lama jika ada untuk menghindari konflik
DROP POLICY IF EXISTS "Anyone can read weight_logs" ON weight_logs;
DROP POLICY IF EXISTS "Anyone can insert weight_logs" ON weight_logs;
DROP POLICY IF EXISTS "Anyone can delete weight_logs" ON weight_logs;

-- 4. CREATE RLS POLICIES UNTUK WEIGHT_LOGS
CREATE POLICY "Anyone can read weight_logs" ON weight_logs FOR SELECT USING (true);
CREATE POLICY "Anyone can insert weight_logs" ON weight_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete weight_logs" ON weight_logs FOR DELETE USING (true);
