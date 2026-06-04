-- Patch existing DB: rename "member" table to "members" if it hasn't been renamed yet
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'member'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'members'
  ) THEN
    ALTER TABLE "member" RENAME TO "members";
  END IF;
END $$;

-- Fix "memeber_id" typo → "member_id" in members table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'members' AND column_name = 'memeber_id'
  ) THEN
    ALTER TABLE "members" RENAME COLUMN "memeber_id" TO "member_id";
  END IF;
END $$;

-- Fix "memeber_id" typo → "member_id" in member_roles table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'member_roles' AND column_name = 'memeber_id'
  ) THEN
    ALTER TABLE "member_roles" RENAME COLUMN "memeber_id" TO "member_id";
  END IF;
END $$;

-- Fix "memeber_id" typo → "member_id" in favourite table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'favourite' AND column_name = 'memeber_id'
  ) THEN
    ALTER TABLE "favourite" RENAME COLUMN "memeber_id" TO "member_id";
  END IF;
END $$;

-- Fix "ur" typo → "url" in social table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'social' AND column_name = 'ur'
  ) THEN
    ALTER TABLE "social" RENAME COLUMN "ur" TO "url";
  END IF;
END $$;

-- Add missing columns to members
ALTER TABLE "members" ADD COLUMN IF NOT EXISTS "licensed_member" boolean DEFAULT false;

-- Add UNIQUE constraint on (dao_id, member_id) in members if not already present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
    WHERE tc.table_schema = 'public' AND tc.table_name = 'members'
      AND tc.constraint_type = 'UNIQUE'
      AND ccu.column_name = 'member_id'
  ) THEN
    ALTER TABLE "members" ADD CONSTRAINT members_dao_id_member_id_key UNIQUE (dao_id, member_id);
  END IF;
END $$;

-- Add UNIQUE constraint on (dao_id, member_id) in favourite if not already present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
    WHERE tc.table_schema = 'public' AND tc.table_name = 'favourite'
      AND tc.constraint_type = 'UNIQUE'
      AND ccu.column_name = 'member_id'
  ) THEN
    ALTER TABLE "favourite" ADD CONSTRAINT favourite_dao_id_member_id_key UNIQUE (dao_id, member_id);
  END IF;
END $$;

-- Add missing columns to dao
ALTER TABLE "dao" ADD COLUMN IF NOT EXISTS "tags" text[] DEFAULT '{}'::text[];
ALTER TABLE "dao" ADD COLUMN IF NOT EXISTS "open_to_collaboration" boolean DEFAULT false;
ALTER TABLE "dao" ADD COLUMN IF NOT EXISTS "poc_member_id" uuid;
ALTER TABLE "dao" ADD COLUMN IF NOT EXISTS "join_dao_link" text;

-- Create collaboration_pass table
CREATE TABLE IF NOT EXISTS "collaboration_pass" (
  "collaboration_pass_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "dao_id" uuid REFERENCES "dao" ("dao_id") ON DELETE CASCADE,
  "claimed" boolean DEFAULT false,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp
);

-- Create stripe_subscription table
CREATE TABLE IF NOT EXISTS "stripe_subscription" (
  "subscription_id" text PRIMARY KEY,
  "dao_id" uuid,
  "member_id" uuid,
  "customer_id" text,
  "invoice_ids" text[],
  "subscription_status" text,
  "quantity" integer,
  "current_period_end" timestamp,
  "current_period_start" timestamp,
  "plan" json,
  "created_at" timestamp NOT NULL DEFAULT now()
);

-- Create stripe_customer table
CREATE TABLE IF NOT EXISTS "stripe_customer" (
  "customer_id" text PRIMARY KEY,
  "name" text,
  "email" text,
  "address" json,
  "phone" text
);

-- Create subdomain table
CREATE TABLE IF NOT EXISTS "subdomain" (
  "subdomain_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "dao_id" uuid,
  "subdomain" text,
  "redirection_link" text,
  "wallet_address" text,
  "access" boolean DEFAULT false,
  "transaction_hash" text,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp
);

-- Cross-DB member stub: member profile data lives in the member DB, so views in this DB expose
-- only the member_id and the gateway enriches username/name/profile_picture. Centralized here
-- so every view builds the identical shape from one place.
CREATE OR REPLACE FUNCTION public.member_stub(mid text) RETURNS json
  LANGUAGE sql IMMUTABLE AS $$
  SELECT json_build_object(
    'member_id',       COALESCE(mid, ''),
    'username',        '',
    'name',            '',
    'profile_picture', ''
  )
$$;

-- Create members_view
-- Exposes per-member DAO membership with aggregated roles and access levels.
-- access is accesstype[] so callers can use ANY(mv.access) or pq.Array scanning.
CREATE OR REPLACE VIEW public.members_view AS
SELECT
    m.member_id,
    d.dao_id,
    d.name,
    d.about,
    d.guild_id,
    d.profile_picture,
    d.owner_id,
    to_json(ARRAY(
        SELECT json_build_object(
            'dao_id',          dr.dao_id,
            'role_id',         dr.role_id,
            'name',            dr.name,
            'discord_role_id', dr.discord_role_id
        )
        FROM roles dr
        JOIN member_roles mr ON dr.role_id = mr.role_id
        WHERE mr.member_id = m.member_id AND mr.dao_id = d.dao_id
    )) AS roles,
    ARRAY(
        SELECT DISTINCT a.access
        FROM access a
        WHERE a.dao_id = d.dao_id
          AND (
            m.member_id = ANY(a.members)
            OR EXISTS (
                SELECT 1 FROM member_roles mr
                WHERE mr.member_id = m.member_id
                  AND mr.dao_id    = d.dao_id
                  AND mr.role_id   = ANY(a.roles)
            )
          )
    ) AS access,
    d.created_at                                 AS dao_created,
    d.updated_at                                 AS dao_updated,
    d.onboarding,
    d.snapshot,
    d.dao_type,
    m.created_at                                 AS member_joined,
    d.token_gating,
    COALESCE(d.tags, '{}'::text[])               AS tags,
    COALESCE(d.open_to_collaboration, false)      AS open_to_collaboration
FROM members m
JOIN dao d ON d.dao_id = m.dao_id;

-- Create dao_view
-- Wide denormalized view of a DAO with aggregated sub-entities.
-- Cross-DB joins (member profile info) are not available; username/name/profile_picture
-- in poc_member and members arrays are left empty for the gateway to enrich.
CREATE OR REPLACE VIEW public.dao_view AS
SELECT
    d.dao_id,
    d.name,
    d.about,
    d.guild_id,
    d.profile_picture,
    d.contract_address,
    d.snapshot,
    d.owner_id,
    d.created_at,
    d.updated_at,
    d.onboarding,
    d.token_gating,
    d.dao_type,
    COALESCE(d.tags, '{}'::text[])              AS tags,
    COALESCE(d.open_to_collaboration, false)     AS open_to_collaboration,
    d.join_dao_link,
    -- roles
    to_json(ARRAY(
        SELECT json_build_object('role_id', r.role_id, 'name', r.name)
        FROM roles r WHERE r.dao_id = d.dao_id
    )) AS roles,
    -- departments
    to_json(ARRAY(
        SELECT json_build_object('department_id', dep.department_id, 'name', dep.name)
        FROM department dep WHERE dep.dao_id = d.dao_id
    )) AS departments,
    -- socials
    to_json(ARRAY(
        SELECT json_build_object('id', s.id, 'type', s.type, 'url', s.url)
        FROM social s WHERE s.dao_id = d.dao_id
    )) AS socials,
    -- tokens
    to_json(ARRAY(
        SELECT json_build_object('id', t.id, 'ticker', t.ticker,
                                 'contract_address', t.contract_address,
                                 'average_time_held', t.average_time_held,
                                 'holders', t.holders)
        FROM token t WHERE t.dao_id = d.dao_id
    )) AS tokens,
    -- members (member_id only; gateway enriches username/name/profile_picture)
    COALESCE(
        to_json(ARRAY(
            SELECT member_stub(m.member_id::text)
            FROM members m WHERE m.dao_id = d.dao_id
        )),
        '[]'::json
    ) AS members,
    -- members_count
    (SELECT COUNT(*) FROM members m WHERE m.dao_id = d.dao_id)::int AS members_count,
    -- members_profile_pictures (not stored in DAO DB; gateway enriches)
    '{}'::text[] AS members_profile_pictures,
    -- poc_member (only member_id available in DAO DB)
    member_stub(d.poc_member_id::text) AS poc_member,
    -- collaboration_pass
    (
        SELECT json_build_object(
            'collaboration_pass_id', cp.collaboration_pass_id::text,
            'claimed',               cp.claimed
        )
        FROM collaboration_pass cp WHERE cp.dao_id = d.dao_id
        LIMIT 1
    ) AS collaboration_pass,
    -- collaborations (accepted only; shows the partner DAO's info)
    COALESCE(
        to_json(ARRAY(
            SELECT json_build_object(
                'collaboration_id', c.collaboration_id::text,
                'dao_id',           CASE
                                      WHEN c.from_dao_id = d.dao_id THEN c.to_dao_id
                                      ELSE c.from_dao_id
                                    END,
                'name',             partner.name,
                'profile_picture',  partner.profile_picture
            )
            FROM collaboration c
            JOIN dao partner ON partner.dao_id = CASE
                                                   WHEN c.from_dao_id = d.dao_id THEN c.to_dao_id
                                                   ELSE c.from_dao_id
                                                 END
            WHERE (c.from_dao_id = d.dao_id OR c.to_dao_id = d.dao_id)
              AND c.status = 'accepted'
        )),
        '[]'::json
    ) AS collaborations,
    -- subscription (latest active stripe subscription, nullable)
    (
        SELECT json_build_object(
            'subscription_status', ss.subscription_status,
            'quantity',            ss.quantity,
            'current_plan',        ss.plan,
            'interval',            json_build_object(
                                       'currency',       null,
                                       'interval',       null,
                                       'interval_count', 0
                                   )
        )
        FROM stripe_subscription ss WHERE ss.dao_id = d.dao_id
        LIMIT 1
    ) AS subscription,
    -- subscription_count
    (SELECT COUNT(*) FROM stripe_subscription ss WHERE ss.dao_id = d.dao_id)::int AS subscription_count
FROM dao d;
