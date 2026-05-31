DROP VIEW IF EXISTS member_view;
DROP TABLE IF EXISTS featured_projects;
ALTER TABLE members
  DROP COLUMN IF EXISTS present_role,
  DROP COLUMN IF EXISTS domain_tags_for_work,
  DROP COLUMN IF EXISTS currency,
  DROP COLUMN IF EXISTS hourly_rate,
  DROP COLUMN IF EXISTS overdue_tasks,
  DROP COLUMN IF EXISTS ongoing_tasks,
  DROP COLUMN IF EXISTS total_tasks_taken,
  DROP COLUMN IF EXISTS pending_admin_reviews,
  DROP COLUMN IF EXISTS closed_task,
  DROP COLUMN IF EXISTS tags;
