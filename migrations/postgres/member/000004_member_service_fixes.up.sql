-- Reconcile committed migrations with the SQL the member service actually executes.
-- Idempotent + guarded so it is correct on both fresh and already-applied databases.

-- 1. mobile (internal/member/mobile.go)
CREATE TABLE IF NOT EXISTS mobile (
  mobile_id     uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id     uuid REFERENCES members(member_id) ON DELETE CASCADE,
  mobile_otp    text,
  linked_status boolean DEFAULT false
);
CREATE INDEX IF NOT EXISTS mobile_member_id_idx ON mobile (member_id);
CREATE INDEX IF NOT EXISTS mobile_mobile_otp_idx ON mobile (mobile_otp);

-- 2. telegram (internal/member/telegram.go) -- the MEMBER telegram table
CREATE TABLE IF NOT EXISTS telegram (
  telegram_id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id             uuid REFERENCES members(member_id) ON DELETE CASCADE,
  generated_telegram_id text,
  chat_id               text,
  username              text,
  first_name            text,
  last_name             text
);
CREATE INDEX IF NOT EXISTS telegram_member_id_idx ON telegram (member_id);

-- 3. privy_member (internal/member/privy.go)
CREATE TABLE IF NOT EXISTS privy_member (
  member_id    uuid REFERENCES members(member_id) ON DELETE CASCADE,
  privy_did    text,
  privy_email  text,
  privy_google jsonb,
  privy_github jsonb
);
CREATE INDEX IF NOT EXISTS privy_member_member_id_idx ON privy_member (member_id);

-- 4. coposter_users (internal/member/coposter.go) -- member_id UNIQUE for ON CONFLICT
CREATE TABLE IF NOT EXISTS coposter_users (
  coposter_user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id        uuid UNIQUE REFERENCES members(member_id) ON DELETE CASCADE,
  signer_uuid      text,
  fid              text,
  is_authenticated boolean DEFAULT false
);

-- 5. xcaster_users / xcaster_tweet / xcaster_casts (internal/member/coposter.go)
CREATE TABLE IF NOT EXISTS xcaster_users (
  id                bigserial PRIMARY KEY,
  member_id         uuid REFERENCES members(member_id) ON DELETE CASCADE,
  connected_acc     boolean DEFAULT false,
  x_username        text,
  warpcast_username text
);
CREATE INDEX IF NOT EXISTS xcaster_users_member_id_idx ON xcaster_users (member_id);

CREATE TABLE IF NOT EXISTS xcaster_tweet (
  id        bigserial PRIMARY KEY,
  member_id uuid REFERENCES members(member_id) ON DELETE CASCADE,
  tweets    jsonb
);
CREATE INDEX IF NOT EXISTS xcaster_tweet_member_id_idx ON xcaster_tweet (member_id);

CREATE TABLE IF NOT EXISTS xcaster_casts (
  id        bigserial PRIMARY KEY,
  member_id uuid REFERENCES members(member_id) ON DELETE CASCADE,
  casts     jsonb
);
CREATE INDEX IF NOT EXISTS xcaster_casts_member_id_idx ON xcaster_casts (member_id);

-- 6. waitlist (internal/member/waitlist.go)
CREATE TABLE IF NOT EXISTS waitlist (
  id         bigserial PRIMARY KEY,
  email      text,
  created_at timestamp NOT NULL DEFAULT (now())
);

-- 7. Read-only lookup tables (created empty; seeding is out of scope)
--    domainTags.go: SELECT domain_tags_for_work FROM domain_tags_for_work
CREATE TABLE IF NOT EXISTS domain_tags_for_work (
  domain_tags_for_work text
);
--    skill.go: SELECT skill FROM skills
CREATE TABLE IF NOT EXISTS skills (
  skill text
);
--    tag.go: SELECT tag FROM member_tags
CREATE TABLE IF NOT EXISTS member_tags (
  tag text
);

-- 8. connection_request.message (internal/member/connection.go)
ALTER TABLE connection_request
  ADD COLUMN IF NOT EXISTS message text;

-- 9. clan_members typo fix: notificatiton -> notification (code uses notification)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clan_members' AND column_name = 'notificatiton'
  ) THEN
    ALTER TABLE clan_members RENAME COLUMN notificatiton TO notification;
  END IF;
END $$;

-- 10. clan_view (internal/member/clan.go) -- SELECT order must match the Scan exactly:
--     clan_id, name, visibility, avatar, created_by, created_at, updated_at, members
CREATE OR REPLACE VIEW clan_view AS
SELECT
  c.clan_id,
  c.name,
  c.visibility,
  c.avatar,
  c.created_by,
  c.created_at,
  c.updated_at,
  COALESCE((
    SELECT json_agg(json_build_object(
      'clan_id',         cm.clan_id,
      'member_id',       cm.member_id,
      'role',            cm.role,
      'username',        m.username,
      'profile_picture', m.profile_picture,
      'notification',    cm.notification,
      'created_at',      cm.created_at
    ))
    FROM clan_members cm
    LEFT JOIN members m ON m.member_id = cm.member_id
    WHERE cm.clan_id = c.clan_id
  ), '[]'::json) AS members
FROM clans c;
