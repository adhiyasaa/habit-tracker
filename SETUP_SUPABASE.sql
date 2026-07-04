-- COPY SEMUA INI KE SUPABASE SQL EDITOR DAN RUN --

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
  type TEXT NOT NULL CHECK (type IN ('gym', 'lari', 'apresiasi', 'tidur_cukup', 'minum_air', 'olahraga_lain', 'kegiatan_lain')),
  custom_name TEXT,
  notes TEXT,
  mood TEXT,
  difficulty TEXT,
  date DATE NOT NULL,
  points INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_activities_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(date);
CREATE INDEX IF NOT EXISTS idx_activities_user_date ON activities(user_id, date);

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

-- Gunakan 'dias' agar sinkron dengan konstanta aplikasi (constants.js)
INSERT INTO users (id, name, email) VALUES 
  ('tsalysa', 'Tsalysa', 'tsalysa@example.com'), 
  ('dias', 'Dias', 'dias@example.com') 
ON CONFLICT (id) DO NOTHING;
