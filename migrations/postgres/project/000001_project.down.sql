-- Consolidated down for project: drop every object created by 000001_project.up.sql.
-- Does NOT touch schema_migrations (golang-migrate owns it).

DROP VIEW IF EXISTS public."subtask_view" CASCADE;
DROP VIEW IF EXISTS public."task_view" CASCADE;
DROP TABLE IF EXISTS public."access" CASCADE;
DROP TABLE IF EXISTS public."comments" CASCADE;
DROP TABLE IF EXISTS public."folder" CASCADE;
DROP TABLE IF EXISTS public."form_response" CASCADE;
DROP TABLE IF EXISTS public."member_assigned" CASCADE;
DROP TABLE IF EXISTS public."project" CASCADE;
DROP TABLE IF EXISTS public."project_files" CASCADE;
DROP TABLE IF EXISTS public."subtask" CASCADE;
DROP TABLE IF EXISTS public."tags" CASCADE;
DROP TABLE IF EXISTS public."task" CASCADE;
DROP TABLE IF EXISTS public."task_credentials" CASCADE;
DROP TABLE IF EXISTS public."tasks_files" CASCADE;
DROP SEQUENCE IF EXISTS public."access_seq" CASCADE;
DROP SEQUENCE IF EXISTS public."comments_seq" CASCADE;
DROP SEQUENCE IF EXISTS public."form_response_id" CASCADE;
DROP SEQUENCE IF EXISTS public."member_assigned_id_seq" CASCADE;
DROP SEQUENCE IF EXISTS public."project_file_seq" CASCADE;
DROP SEQUENCE IF EXISTS public."project_folder_seq" CASCADE;
DROP SEQUENCE IF EXISTS public."project_seq" CASCADE;
DROP SEQUENCE IF EXISTS public."subtask_seq" CASCADE;
DROP SEQUENCE IF EXISTS public."tags_id_seq" CASCADE;
DROP SEQUENCE IF EXISTS public."task_credentials_id_seq" CASCADE;
DROP SEQUENCE IF EXISTS public."task_file_seq" CASCADE;
DROP SEQUENCE IF EXISTS public."task_seq" CASCADE;
DROP TYPE IF EXISTS public."accesstype" CASCADE;
DROP TYPE IF EXISTS public."commenttype" CASCADE;
DROP TYPE IF EXISTS public."linktype" CASCADE;
DROP TYPE IF EXISTS public."projecttype" CASCADE;
DROP TYPE IF EXISTS public."visibilitytype" CASCADE;
DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;
