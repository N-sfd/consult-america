-- ConsultAmerica Phase 2A follow-up — link platform users to Supabase Auth.
-- Additive only: users.id stays the app-generated TEXT primary key used
-- everywhere else in this schema; auth_user_id is the bridge to the
-- Supabase-managed auth.users row created at sign-in/seed time.

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);
