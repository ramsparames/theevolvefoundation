-- Compass V1, slice 1
-- Run this once against the Neon/Postgres database connected to the Vercel project.

CREATE TABLE IF NOT EXISTS compass_sessions (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'in_progress',
  magic_token_hash TEXT,
  magic_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS compass_sessions_email_idx ON compass_sessions (email);
CREATE INDEX IF NOT EXISTS compass_sessions_magic_token_idx ON compass_sessions (magic_token_hash);
