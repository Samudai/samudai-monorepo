-- Consolidated down for discussion: drop every object created by 000001_discussion.up.sql.
-- Does NOT touch schema_migrations (golang-migrate owns it).

DROP VIEW IF EXISTS public."discussion_view" CASCADE;
DROP VIEW IF EXISTS public."message_view" CASCADE;
DROP TABLE IF EXISTS public."discussion" CASCADE;
DROP TABLE IF EXISTS public."message" CASCADE;
DROP TABLE IF EXISTS public."participant" CASCADE;
DROP SEQUENCE IF EXISTS public."discussion_seq" CASCADE;
DROP SEQUENCE IF EXISTS public."message_seq" CASCADE;
DROP SEQUENCE IF EXISTS public."participant_seq" CASCADE;
DROP FUNCTION IF EXISTS public."member_stub"(mid text) CASCADE;
DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;
