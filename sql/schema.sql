-- ============================================
-- Habit Tracker Database Schema (Supabase)
-- ============================================

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
  type TEXT NOT NULL CHECK (type IN ('gym', 'lari', 'apresiasi', 'tidur_cukup', 'minum_air', 'olahraga_lain', 'kegiatan_lain')),
  custom_name TEXT,
  notes TEXT,
  mood TEXT,
  difficulty TEXT,
  date DATE NOT NULL,
  points INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign key constraint
  CONSTRAINT fk_activities_user 
    FOREIGN KEY (user_id) 
    REFERENCES users(id) 
    ON DELETE CASCADE
);

-- 3. CREATE INDEXES UNTUK PERFORMA
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(date);
CREATE INDEX IF NOT EXISTS idx_activities_user_date ON activities(user_id, date);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);

-- 4. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- 5. CREATE RLS POLICIES UNTUK USERS
CREATE POLICY "Anyone can read users" 
ON users FOR SELECT 
TO anon 
USING (true);

CREATE POLICY "Anyone can insert users" 
ON users FOR INSERT 
TO anon 
WITH CHECK (true);

CREATE POLICY "Anyone can update own user" 
ON users FOR UPDATE 
TO anon 
USING (true)
WITH CHECK (true);

-- 6. CREATE RLS POLICIES UNTUK ACTIVITIES
CREATE POLICY "Anyone can read activities" 
ON activities FOR SELECT 
TO anon 
USING (true);

CREATE POLICY "Anyone can insert activities" 
ON activities FOR INSERT 
TO anon 
WITH CHECK (true);

CREATE POLICY "Anyone can update activities" 
ON activities FOR UPDATE 
TO anon 
USING (true)
WITH CHECK (true);

CREATE POLICY "Anyone can delete activities" 
ON activities FOR DELETE 
TO anon 
USING (true);

-- 7. INSERT SAMPLE DATA (OPSIONAL)
-- Menggunakan 'dias' agar sesuai dengan constants.js
INSERT INTO users (id, name, email) VALUES
  ('tsalysa', 'Tsalysa', 'tsalysa@example.com'),
  ('dias', 'Dias', 'dias@example.com')
ON CONFLICT (id) DO NOTHING;

/*
INSERT INTO activities (user_id, type, date, points, notes, mood, difficulty) VALUES
  ('tsalysa', 'gym', CURRENT_DATE, 10, 'Latihan pagi mantap!', '🔥 Semangat pol!', '⚡ Lumayan'),
  ('tsalysa', 'lari', CURRENT_DATE - INTERVAL '1 day', 10, 'Sore-sore lari tipis', '🥰 Hepi banget', '🌟 Enteng'),
  ('dias', 'gym', CURRENT_DATE, 10, 'Latihan dada', '🥵 Capek tapi hepi', '🏆 Perjuangan'),
  ('dias', 'lari', CURRENT_DATE - INTERVAL '2 days', 10, 'Jogging pagi santai', '😴 Ngantuk / Males', '🌟 Enteng')
ON CONFLICT DO NOTHING;
*/
