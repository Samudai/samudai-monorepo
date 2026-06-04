-- Reverse 000004_member_service_fixes (best-effort).

-- 10. Drop the view before its dependents.
DROP VIEW IF EXISTS clan_view;

-- 9. Reverse the typo fix: notification -> notificatiton.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clan_members' AND column_name = 'notification'
  ) THEN
    ALTER TABLE clan_members RENAME COLUMN notification TO notificatiton;
  END IF;
END $$;

-- 8. connection_request.message
ALTER TABLE connection_request
  DROP COLUMN IF EXISTS message;

-- 7. Lookup tables
DROP TABLE IF EXISTS member_tags;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS domain_tags_for_work;

-- 6. waitlist
DROP TABLE IF EXISTS waitlist;

-- 5. xcaster tables
DROP TABLE IF EXISTS xcaster_casts;
DROP TABLE IF EXISTS xcaster_tweet;
DROP TABLE IF EXISTS xcaster_users;

-- 4. coposter_users
DROP TABLE IF EXISTS coposter_users;

-- 3. privy_member
DROP TABLE IF EXISTS privy_member;

-- 2. telegram
DROP TABLE IF EXISTS telegram;

-- 1. mobile
DROP TABLE IF EXISTS mobile;
