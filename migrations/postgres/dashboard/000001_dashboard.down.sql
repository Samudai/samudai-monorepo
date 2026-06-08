-- Consolidated down for dashboard: drop every object created by 000001_dashboard.up.sql.
-- Does NOT touch schema_migrations (golang-migrate owns it).

DROP VIEW IF EXISTS public."dashboard_view" CASCADE;
DROP TABLE IF EXISTS public."dashboard" CASCADE;
DROP TABLE IF EXISTS public."dashboard_widget" CASCADE;
DROP SEQUENCE IF EXISTS public."dashboard_seq" CASCADE;
DROP SEQUENCE IF EXISTS public."dashboard_widget_seq" CASCADE;
DROP TYPE IF EXISTS public."visibilitytype" CASCADE;
DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;
