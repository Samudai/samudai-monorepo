-- 000002_project_service_fixes (down)
-- Reverse 000002 best-effort. Drop views first (they depend on task/subtask/
-- project columns), then indexes, columns, and the new tables. Non
-- data-destructive ordering; uses IF EXISTS throughout.

-- Views (drop before the columns/tables they reference)
DROP VIEW IF EXISTS "task_view";
DROP VIEW IF EXISTS "subtask_view";

-- Indexes
DROP INDEX IF EXISTS "idx_member_assigned_member_id";
DROP INDEX IF EXISTS "idx_member_assigned_project_id";
DROP INDEX IF EXISTS "idx_subtask_project_id";
DROP INDEX IF EXISTS "idx_subtask_task_id";
DROP INDEX IF EXISTS "idx_task_project_id";

-- project columns
ALTER TABLE "project" DROP COLUMN IF EXISTS "is_archived";
ALTER TABLE "project" DROP COLUMN IF EXISTS "form_id";

-- subtask columns
ALTER TABLE "subtask" DROP COLUMN IF EXISTS "updated_by";
ALTER TABLE "subtask" DROP COLUMN IF EXISTS "created_by";
ALTER TABLE "subtask" DROP COLUMN IF EXISTS "associated_job_id";
ALTER TABLE "subtask" DROP COLUMN IF EXISTS "associated_job_type";
ALTER TABLE "subtask" DROP COLUMN IF EXISTS "archived";
ALTER TABLE "subtask" DROP COLUMN IF EXISTS "github_pr";
ALTER TABLE "subtask" DROP COLUMN IF EXISTS "payment_created";
ALTER TABLE "subtask" DROP COLUMN IF EXISTS "payout";
ALTER TABLE "subtask" DROP COLUMN IF EXISTS "col";
ALTER TABLE "subtask" DROP COLUMN IF EXISTS "notion_property";
ALTER TABLE "subtask" DROP COLUMN IF EXISTS "notion_page";
ALTER TABLE "subtask" DROP COLUMN IF EXISTS "position";
ALTER TABLE "subtask" DROP COLUMN IF EXISTS "github_issue";
ALTER TABLE "subtask" DROP COLUMN IF EXISTS "assignee_member";
ALTER TABLE "subtask" DROP COLUMN IF EXISTS "poc_member_id";
ALTER TABLE "subtask" DROP COLUMN IF EXISTS "deadline";
ALTER TABLE "subtask" DROP COLUMN IF EXISTS "description_raw";
ALTER TABLE "subtask" DROP COLUMN IF EXISTS "description";
ALTER TABLE "subtask" DROP COLUMN IF EXISTS "project_id";

-- task columns
ALTER TABLE "task" DROP COLUMN IF EXISTS "source";
ALTER TABLE "task" DROP COLUMN IF EXISTS "associated_job_id";
ALTER TABLE "task" DROP COLUMN IF EXISTS "associated_job_type";
ALTER TABLE "task" DROP COLUMN IF EXISTS "archived";
ALTER TABLE "task" DROP COLUMN IF EXISTS "github_pr";
ALTER TABLE "task" DROP COLUMN IF EXISTS "description_raw";

-- new tables
DROP TABLE IF EXISTS "tags";
DROP TABLE IF EXISTS "task_credentials";
DROP TABLE IF EXISTS "member_assigned";
