-- Add columns that the Go code expects but were absent from the initial migration
ALTER TABLE members
  ADD COLUMN IF NOT EXISTS present_role text,
  ADD COLUMN IF NOT EXISTS domain_tags_for_work text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS currency text,
  ADD COLUMN IF NOT EXISTS hourly_rate text,
  ADD COLUMN IF NOT EXISTS overdue_tasks int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ongoing_tasks int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_tasks_taken int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS pending_admin_reviews int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS closed_task int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Table for per-member featured project lists
CREATE TABLE IF NOT EXISTS featured_projects (
  id bigserial PRIMARY KEY,
  member_id uuid UNIQUE REFERENCES members(member_id) ON UPDATE CASCADE ON DELETE CASCADE,
  featured_projects jsonb,
  updated_at timestamp
);

-- Comprehensive view used by the member service for all member lookups
CREATE OR REPLACE VIEW member_view AS
SELECT
  m.member_id,
  m.name,
  m.username,
  m.phone,
  COALESCE(m.email, d.email, '')                        AS email,
  m.about,
  m.open_for_opportunity,
  fp.featured_projects                                  AS featured_projects,
  m.skills,
  to_json(ARRAY(
    SELECT json_build_object(
      'wallet_id',      mw2.id,
      'wallet_address', mw2.wallet_address,
      'chain_id',       mw2.chain_id,
      'default',        mw2."default"
    )
    FROM member_wallet mw2
    WHERE mw2.member_id = m.member_id
  ))                                                    AS wallets,
  json_build_object(
    'discord_user_id', d.discord_user_id,
    'username',        d.username,
    'avatar',          d.avatar,
    'discriminator',   d.discriminator,
    'flags',           d.flags,
    'locale',          d.locale,
    'verified',        d.verified,
    'email',           d.email
  )                                                     AS discord,
  m.present_role,
  COALESCE(m.domain_tags_for_work, '{}'::text[])        AS domain_tags_for_work,
  m.currency,
  m.hourly_rate,
  m.captain,
  m.did,
  m.created_at,
  m.updated_at,
  m.profile_picture,
  m.ceramic_stream,
  m.subdomain,
  json_build_object(
    'wallet_id',      mw.id,
    'member_id',      mw.member_id,
    'wallet_address', mw.wallet_address,
    'chain_id',       mw.chain_id,
    'default',        mw."default"
  )                                                     AS default_wallet,
  mw.wallet_address                                     AS default_wallet_address,
  m.invite_code,
  COALESCE((
    SELECT sum(CASE WHEN o2.admin OR o2.contributor THEN 1 ELSE 0 END)
    FROM onboarding o2
    WHERE o2.invite_code = m.invite_code
  ), 0)                                                 AS invite_count,
  COALESCE(m.tags, '{}'::text[])                        AS tags,
  -- TODO: populate from cross-DB join once DAO service is co-located
  NULL::json                                            AS dao_worked_with,
  COALESCE(m.overdue_tasks, 0)                          AS overdue_tasks,
  COALESCE(m.ongoing_tasks, 0)                          AS ongoing_tasks,
  COALESCE(m.total_tasks_taken, 0)                      AS total_tasks_taken,
  COALESCE(m.pending_admin_reviews, 0)                  AS pending_admin_reviews,
  COALESCE(m.closed_task, 0)                            AS closed_task
FROM members m
LEFT JOIN discord d          ON d.member_id  = m.member_id
LEFT JOIN member_wallet mw   ON mw.member_id = m.member_id AND mw."default" = true
LEFT JOIN onboarding o       ON o.member_id  = m.member_id
LEFT JOIN featured_projects fp ON fp.member_id = m.member_id;
