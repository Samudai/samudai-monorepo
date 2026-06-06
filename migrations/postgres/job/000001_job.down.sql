-- Consolidated down for job: drop every object created by 000001_job.up.sql.
-- Does NOT touch schema_migrations (golang-migrate owns it).

DROP VIEW IF EXISTS public."bounty_view" CASCADE;
DROP VIEW IF EXISTS public."opportunity_view" CASCADE;
DROP VIEW IF EXISTS public."pending_payouts" CASCADE;
DROP TABLE IF EXISTS public."applicants" CASCADE;
DROP TABLE IF EXISTS public."bounty" CASCADE;
DROP TABLE IF EXISTS public."bounty_files" CASCADE;
DROP TABLE IF EXISTS public."bounty_skills" CASCADE;
DROP TABLE IF EXISTS public."bounty_tags" CASCADE;
DROP TABLE IF EXISTS public."favourite_bounty" CASCADE;
DROP TABLE IF EXISTS public."favourite_job" CASCADE;
DROP TABLE IF EXISTS public."job_files" CASCADE;
DROP TABLE IF EXISTS public."job_skills" CASCADE;
DROP TABLE IF EXISTS public."job_tags" CASCADE;
DROP TABLE IF EXISTS public."opportunity" CASCADE;
DROP TABLE IF EXISTS public."payout" CASCADE;
DROP TABLE IF EXISTS public."submission" CASCADE;
DROP SEQUENCE IF EXISTS public."applicants_seq" CASCADE;
DROP SEQUENCE IF EXISTS public."bounty_files_seq" CASCADE;
DROP SEQUENCE IF EXISTS public."bounty_seq" CASCADE;
DROP SEQUENCE IF EXISTS public."favourite_bounty_id_seq" CASCADE;
DROP SEQUENCE IF EXISTS public."favourite_seq" CASCADE;
DROP SEQUENCE IF EXISTS public."job_files_seq" CASCADE;
DROP SEQUENCE IF EXISTS public."opportunity_seq" CASCADE;
DROP SEQUENCE IF EXISTS public."payout_id_seq" CASCADE;
DROP SEQUENCE IF EXISTS public."submission_seq" CASCADE;
DROP FUNCTION IF EXISTS public."member_stub"(mid text) CASCADE;
DROP FUNCTION IF EXISTS public."payouts_for"(link uuid) CASCADE;
DROP TYPE IF EXISTS public."applicantstatustype" CASCADE;
DROP TYPE IF EXISTS public."jobtype" CASCADE;
DROP TYPE IF EXISTS public."statustype" CASCADE;
DROP TYPE IF EXISTS public."visibilitytype" CASCADE;
DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;
