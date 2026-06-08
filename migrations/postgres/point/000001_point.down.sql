-- Consolidated down for point: drop every object created by 000001_point.up.sql.
-- Does NOT touch schema_migrations (golang-migrate owns it).

DROP VIEW IF EXISTS public."member_points_view" CASCADE;
DROP TABLE IF EXISTS public."access" CASCADE;
DROP TABLE IF EXISTS public."contract" CASCADE;
DROP TABLE IF EXISTS public."custom_product_events" CASCADE;
DROP TABLE IF EXISTS public."custom_product_members" CASCADE;
DROP TABLE IF EXISTS public."custom_products" CASCADE;
DROP TABLE IF EXISTS public."discord" CASCADE;
DROP TABLE IF EXISTS public."member_points" CASCADE;
DROP TABLE IF EXISTS public."member_roles" CASCADE;
DROP TABLE IF EXISTS public."members" CASCADE;
DROP TABLE IF EXISTS public."point" CASCADE;
DROP TABLE IF EXISTS public."referral_members" CASCADE;
DROP TABLE IF EXISTS public."roles" CASCADE;
DROP TABLE IF EXISTS public."telegram" CASCADE;
DROP TABLE IF EXISTS public."telegram_points" CASCADE;
DROP TABLE IF EXISTS public."twitter" CASCADE;
DROP TABLE IF EXISTS public."twitter_members" CASCADE;
DROP TABLE IF EXISTS public."twitter_points" CASCADE;
DROP TABLE IF EXISTS public."webhooks" CASCADE;
DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;
