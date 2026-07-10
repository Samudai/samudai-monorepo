-- Consolidated down for discovery: drop every object created by 000001_discovery.up.sql.
-- Does NOT touch schema_migrations (golang-migrate owns it).

DROP TABLE IF EXISTS public."dao_events" CASCADE;
DROP TABLE IF EXISTS public."member_events" CASCADE;
DROP SEQUENCE IF EXISTS public."events_seq" CASCADE;
DROP SEQUENCE IF EXISTS public."member_events_seq" CASCADE;
DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;
