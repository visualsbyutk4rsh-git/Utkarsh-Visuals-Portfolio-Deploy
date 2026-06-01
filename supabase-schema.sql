-- ═══════════════════════════════════════════════════════
-- Supabase Database Schema for Utkarsh Visuals
-- Run this in your Supabase SQL Editor to create all tables.
-- ═══════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────
-- 1. LEADS TABLE (contact forms + project requests)
-- ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
  email TEXT NOT NULL,
  budget TEXT DEFAULT 'Not specified',
  description TEXT DEFAULT '',
  source TEXT DEFAULT 'Modal Lead Form',
  page TEXT DEFAULT '',
  ip INET,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ───────────────────────────────────────────────────────
-- 2. ANALYTICS EVENTS TABLE
-- ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  page TEXT,
  ip INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ───────────────────────────────────────────────────────
-- 3. SITE SETTINGS TABLE (future CMS support)
-- ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ───────────────────────────────────────────────────────
-- 4. INDEXES FOR PERFORMANCE
-- ───────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at DESC);

-- ───────────────────────────────────────────────────────
-- 5. ROW-LEVEL SECURITY (RLS)
-- ───────────────────────────────────────────────────────
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (from frontend via anon key)
CREATE POLICY "Allow anonymous lead inserts"
  ON leads FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous analytics inserts"
  ON analytics_events FOR INSERT TO anon
  WITH CHECK (true);

-- Allow reading settings (for future CMS)
CREATE POLICY "Allow read settings for anon"
  ON site_settings FOR SELECT TO anon
  USING (true);

-- ───────────────────────────────────────────────────────
-- 6. AUTO-UPDATE TIMESTAMP TRIGGER
-- ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ───────────────────────────────────────────────────────
-- 7. SEED DEFAULT SETTINGS
-- ───────────────────────────────────────────────────────
INSERT INTO site_settings (key, value) VALUES
  ('site_name', '"Utkarsh Visuals"'),
  ('admin_email', '"visualsbyutk4rsh@gmail.com"'),
  ('maintenance_mode', 'false')
ON CONFLICT (key) DO NOTHING;
