-- 000002_project_service_fixes
-- Reconcile committed schema with the SQL the project service actually executes.
-- Idempotent + guarded so it is safe on a fresh DB and on one already carrying
-- columns/tables that drifted in ahead of this migration.

-- ---------------------------------------------------------------------------
-- 1. member_assigned (read-only here: project.go:26/66/91/122/177/230/570)
--    ARRAY(SELECT DISTINCT member_id FROM member_assigned WHERE project_id = ...)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "member_assigned" (
  "id" bigserial PRIMARY KEY,
  "project_id" uuid,
  "member_id" uuid
);

-- ---------------------------------------------------------------------------
-- 2. task_credentials (task.go:390)
--    INSERT INTO task_credentials (task_id, member_id, vc_claim) VALUES (..,..,true)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "task_credentials" (
  "id" bigserial PRIMARY KEY,
  "task_id" uuid,
  "member_id" uuid,
  "vc_claim" boolean DEFAULT (false),
  "created_at" timestamp NOT NULL DEFAULT (now())
);

-- ---------------------------------------------------------------------------
-- 3. tags (tag.go:8) -- SELECT tag FROM tags
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "tags" (
  "id" bigserial PRIMARY KEY,
  "tag" text
);

-- ---------------------------------------------------------------------------
-- 4. task added columns (task.go INSERT/UPDATE/Scan)
-- ---------------------------------------------------------------------------
ALTER TABLE "task" ADD COLUMN IF NOT EXISTS "description_raw" text;                       -- task.go:181 INSERT, :219 UPDATE (DescriptionRaw *string)
ALTER TABLE "task" ADD COLUMN IF NOT EXISTS "github_pr" json;                             -- task.go:181/217 (GithubPR -> convertToJSONString)
ALTER TABLE "task" ADD COLUMN IF NOT EXISTS "archived" boolean DEFAULT (false);           -- task.go:425 UPDATE, :33 Scan (Archived bool)
ALTER TABLE "task" ADD COLUMN IF NOT EXISTS "associated_job_type" text DEFAULT ('none');  -- task.go:181/217/412 (AssociatedJobType)
ALTER TABLE "task" ADD COLUMN IF NOT EXISTS "associated_job_id" uuid;                     -- task.go:181/217/412 (AssociatedJobId *string)
ALTER TABLE "task" ADD COLUMN IF NOT EXISTS "source" text;                                -- task.go:181/217 Scan :34 (Source *TaskCreatedSource)
-- notion_property already exists in 000001 (task line 158)

-- ---------------------------------------------------------------------------
-- 5. subtask added columns (subtask.go INSERT/UPDATE/Scan)
-- ---------------------------------------------------------------------------
ALTER TABLE "subtask" ADD COLUMN IF NOT EXISTS "project_id" uuid;                          -- subtask.go:120 INSERT, :19 Scan
ALTER TABLE "subtask" ADD COLUMN IF NOT EXISTS "description" text;                         -- subtask.go:120 INSERT, :19 Scan
ALTER TABLE "subtask" ADD COLUMN IF NOT EXISTS "description_raw" text;                     -- subtask.go:120 INSERT (DescriptionRaw *string)
ALTER TABLE "subtask" ADD COLUMN IF NOT EXISTS "deadline" timestamp;                       -- subtask.go:120 (Deadline)
ALTER TABLE "subtask" ADD COLUMN IF NOT EXISTS "poc_member_id" uuid;                       -- subtask.go:120 (POCMemberID)
ALTER TABLE "subtask" ADD COLUMN IF NOT EXISTS "assignee_member" uuid[] DEFAULT ('{}'::uuid[]); -- subtask.go:120 INSERT, :25 Scan pq.Array(AssigneeMember)
ALTER TABLE "subtask" ADD COLUMN IF NOT EXISTS "github_issue" integer DEFAULT (0);         -- subtask.go:120 (GithubIssue *int)
ALTER TABLE "subtask" ADD COLUMN IF NOT EXISTS "position" double precision;                -- subtask.go:120/244 (Position float64)
ALTER TABLE "subtask" ADD COLUMN IF NOT EXISTS "notion_page" text;                         -- subtask.go:120 (NotionPage *string)
ALTER TABLE "subtask" ADD COLUMN IF NOT EXISTS "notion_property" text;                     -- subtask.go:120 (NotionProperty *string)
ALTER TABLE "subtask" ADD COLUMN IF NOT EXISTS "col" integer DEFAULT (0);                  -- subtask.go:120/185 (Col int)
ALTER TABLE "subtask" ADD COLUMN IF NOT EXISTS "payout" text DEFAULT ('[]'::text);         -- subtask.go:232 UPDATE payout, :26 Scan json string
ALTER TABLE "subtask" ADD COLUMN IF NOT EXISTS "payment_created" boolean DEFAULT (false);  -- subtask.go:120 (PaymentCreated bool)
ALTER TABLE "subtask" ADD COLUMN IF NOT EXISTS "github_pr" json;                           -- subtask.go:120 (GithubPR -> convertToJSONString)
ALTER TABLE "subtask" ADD COLUMN IF NOT EXISTS "archived" boolean DEFAULT (false);         -- subtask.go:120/307 (Archived bool)
ALTER TABLE "subtask" ADD COLUMN IF NOT EXISTS "associated_job_type" text DEFAULT ('none');-- subtask.go:120/294 (AssociatedJobType)
ALTER TABLE "subtask" ADD COLUMN IF NOT EXISTS "associated_job_id" uuid;                   -- subtask.go:120/294 (AssociatedJobId *string)
ALTER TABLE "subtask" ADD COLUMN IF NOT EXISTS "created_by" uuid;                          -- subtask.go:120 INSERT, :22 Scan
ALTER TABLE "subtask" ADD COLUMN IF NOT EXISTS "updated_by" uuid;                          -- subtask.go:120 INSERT/UPDATE, :22 Scan

-- ---------------------------------------------------------------------------
-- 6. project added columns
-- ---------------------------------------------------------------------------
ALTER TABLE "project" ADD COLUMN IF NOT EXISTS "form_id" text;                             -- project.go:277 INSERT, :467 WHERE form_id (FormID)
ALTER TABLE "project" ADD COLUMN IF NOT EXISTS "is_archived" boolean DEFAULT (false);      -- project.go:541 UPDATE, :573 WHERE is_archived

-- comments.created_at already exists in 000001 (comments line 47) -- nothing to add.

-- ---------------------------------------------------------------------------
-- 9. Indexes (none of these exist in 000001; 000001 only indexes id / *_id pk-ish)
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS "idx_task_project_id" ON "task" ("project_id");
CREATE INDEX IF NOT EXISTS "idx_subtask_task_id" ON "subtask" ("task_id");
CREATE INDEX IF NOT EXISTS "idx_subtask_project_id" ON "subtask" ("project_id");
CREATE INDEX IF NOT EXISTS "idx_member_assigned_project_id" ON "member_assigned" ("project_id");
CREATE INDEX IF NOT EXISTS "idx_member_assigned_member_id" ON "member_assigned" ("member_id");

-- ---------------------------------------------------------------------------
-- 8. Denormalized views. Every consumer names columns explicitly (no SELECT *),
--    so the views are a SUPERSET of all referenced columns; physical order is
--    irrelevant. files/subtasks/comments/payout/vc_claim are json/array
--    aggregates over the base tables.
--    task_view consumers: task.go GetTask(:22), GetAllTaskByProject(:82),
--      GetArchiveTaskByProject(:438), PersonalTaskByMemberID(:631),
--      AssignedTaskByMemberID(:697 -> adds project_name, columns, dao_id,
--      dao_name, department), github.go:49 (COUNT(*)).
--    subtask_view consumers: subtask.go:19/55/322.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW "task_view" AS
SELECT
  t.task_id,
  t.project_id,
  t.title,
  t.description,
  t.description_raw,
  t.col,
  t.created_by,
  t.updated_by,
  t.poc_member_id,
  t.notion_page,
  t.notion_property,
  t.tags,
  t.deadline,
  t.assignee_member,
  t.assignee_clan,
  t.feedback,
  t.position,
  t.github_issue,
  t.github_pr,
  t.payout,
  t.payment_created,
  t.archived,
  t.associated_job_type,
  t.associated_job_id,
  t.source,
  t.created_at,
  t.updated_at,
  -- vc_claim is read as pq.Array(&task.VCClaim) ([]string): array of member_ids
  -- that have a claimed credential (task.go:33). NOT the base task.vc_claim bool.
  ARRAY(
    SELECT tc.member_id
    FROM task_credentials tc
    WHERE tc.task_id = t.task_id AND tc.vc_claim = true
  ) AS vc_claim,
  -- project context (consumed by AssignedTaskByMemberID, task.go:697)
  p.title AS project_name,
  p.columns AS columns,
  p.link_id AS dao_id,
  NULL::text AS dao_name,   -- member/dao name is cross-DB; expose null, code COALESCEs to ''
  p.department AS department,
  -- files: tasks_files for this task
  (
    SELECT to_json(COALESCE(json_agg(json_build_object(
      'task_file_id', f.task_file_id,
      'task_id', f.task_id,
      'name', f.name,
      'url', f.url,
      'metadata', f.metadata,
      'created_at', f.created_at
    )), '[]'::json))
    FROM tasks_files f
    WHERE f.task_id = t.task_id
  ) AS files,
  -- subtasks: subtask rows for this task
  (
    SELECT to_json(COALESCE(json_agg(json_build_object(
      'subtask_id', s.subtask_id,
      'task_id', s.task_id,
      'project_id', s.project_id,
      'title', s.title,
      'completed', s.completed,
      'description', s.description,
      'description_raw', s.description_raw,
      'deadline', s.deadline,
      'poc_member_id', s.poc_member_id,
      'assignee_member', s.assignee_member,
      'github_issue', s.github_issue,
      'position', s.position,
      'notion_page', s.notion_page,
      'notion_property', s.notion_property,
      'col', s.col,
      'payout', s.payout,
      'payment_created', s.payment_created,
      'github_pr', s.github_pr,
      'archived', s.archived,
      'associated_job_type', s.associated_job_type,
      'associated_job_id', s.associated_job_id,
      'created_by', s.created_by,
      'updated_by', s.updated_by,
      'created_at', s.created_at,
      'updated_at', s.updated_at
    )), '[]'::json))
    FROM subtask s
    WHERE s.task_id = t.task_id
  ) AS subtasks,
  -- comments: comments linked to this task (comments.link_id = task.task_id)
  (
    SELECT to_json(COALESCE(json_agg(json_build_object(
      'id', c.id,
      'link_id', c.link_id,
      'body', c.body,
      'author', c.author,
      'type', c.type,
      'tagged_members', c.tagged_members,
      'created_at', c.created_at,
      'updated_at', c.updated_at
    )), '[]'::json))
    FROM comments c
    WHERE c.link_id = t.task_id AND c.type = 'task'
  ) AS comments
FROM task t
LEFT JOIN project p ON p.project_id = t.project_id;

CREATE OR REPLACE VIEW "subtask_view" AS
SELECT
  s.subtask_id,
  s.task_id,
  s.project_id,
  s.title,
  s.completed,
  s.description,
  s.description_raw,
  s.deadline,
  s.poc_member_id,
  s.assignee_member,
  s.github_issue,
  s.position,
  s.notion_page,
  s.notion_property,
  s.col,
  s.payout,
  s.payment_created,
  s.github_pr,
  s.archived,
  s.associated_job_type,
  s.associated_job_id,
  s.created_by,
  s.updated_by,
  s.created_at,
  s.updated_at
FROM subtask s;
