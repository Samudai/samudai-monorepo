-- 000002_point_service_fixes.down.sql
-- Best-effort reverse of 000002. Drops views before dependent tables/columns.

-- Drop the view first (depends on point, member_points, members).
DROP VIEW IF EXISTS member_points_view;

-- Drop indexes added in the UP.
DROP INDEX IF EXISTS idx_point_guild;
DROP INDEX IF EXISTS idx_telegram_username;
DROP INDEX IF EXISTS idx_telegram_chat_id;
DROP INDEX IF EXISTS idx_twitter_members_member;

-- Drop tables introduced in the UP.
DROP TABLE IF EXISTS referral_members;
DROP TABLE IF EXISTS custom_product_members;
DROP TABLE IF EXISTS custom_product_events;
DROP TABLE IF EXISTS custom_products;
DROP TABLE IF EXISTS webhooks;
DROP TABLE IF EXISTS contract;
DROP TABLE IF EXISTS twitter_points;
DROP TABLE IF EXISTS twitter_members;
DROP TABLE IF EXISTS twitter;
DROP TABLE IF EXISTS telegram_points;
DROP TABLE IF EXISTS telegram;
DROP TABLE IF EXISTS access;
DROP TABLE IF EXISTS member_roles;
DROP TABLE IF EXISTS roles;

-- Drop columns added to discord.
ALTER TABLE discord DROP COLUMN IF EXISTS email;
ALTER TABLE discord DROP COLUMN IF EXISTS verified;
ALTER TABLE discord DROP COLUMN IF EXISTS mfa_enabled;
ALTER TABLE discord DROP COLUMN IF EXISTS locale;
ALTER TABLE discord DROP COLUMN IF EXISTS accent_color;
ALTER TABLE discord DROP COLUMN IF EXISTS banner_color;
ALTER TABLE discord DROP COLUMN IF EXISTS banner;
ALTER TABLE discord DROP COLUMN IF EXISTS flags;
ALTER TABLE discord DROP COLUMN IF EXISTS public_flags;
ALTER TABLE discord DROP COLUMN IF EXISTS discriminator;
ALTER TABLE discord DROP COLUMN IF EXISTS avatar;
ALTER TABLE discord DROP COLUMN IF EXISTS username;

-- Drop column added to member_points.
ALTER TABLE member_points DROP COLUMN IF EXISTS points;

-- Drop columns added to point.
ALTER TABLE point DROP COLUMN IF EXISTS server_name;
ALTER TABLE point DROP COLUMN IF EXISTS email;
ALTER TABLE point DROP COLUMN IF EXISTS guild_id;
ALTER TABLE point DROP COLUMN IF EXISTS id;

-- Reverse the points -> point rename (guarded).
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'point')
       AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'points') THEN
        ALTER TABLE point RENAME TO points;
    END IF;
END $$;

-- Restore the 000001 member_points_view shape so a re-down leaves the DB
-- consistent with migration 000001.
CREATE OR REPLACE VIEW member_points_view AS
SELECT
    mp.point_id,
    mp.member_id,
    mp.access,
    mp.roles,
    mp.member_joined_at,
    jsonb_build_object(
        'member_id', m.member_id,
        'name', m.name,
        'email', m.email,
        'wallet_address', m.wallet_address,
        'chain_id', m.chain_id,
        'email_verified', m.email_verified,
        'is_onboarded', m.is_onboarded,
        'created_at', m.created_at
    ) as member
FROM member_points mp
JOIN members m ON m.member_id = mp.member_id;
