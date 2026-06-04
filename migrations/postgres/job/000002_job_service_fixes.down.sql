-- Reverse 000002_job_service_fixes. Drop views before the tables/columns they depend on.
DROP VIEW IF EXISTS public.pending_payouts;
DROP VIEW IF EXISTS public.bounty_view;
DROP VIEW IF EXISTS public.opportunity_view;
DROP FUNCTION IF EXISTS public.payouts_for(uuid);
DROP FUNCTION IF EXISTS public.member_stub(text);

DROP INDEX IF EXISTS idx_favourite_bounty_bounty_id;
DROP INDEX IF EXISTS idx_payout_link_type;
DROP INDEX IF EXISTS idx_payout_link_id;
DROP INDEX IF EXISTS idx_bounty_files_bounty_id;
DROP INDEX IF EXISTS idx_job_files_job_id;
DROP INDEX IF EXISTS idx_submission_bounty_id;
DROP INDEX IF EXISTS idx_applicants_job_id;

DROP TABLE IF EXISTS "bounty_skills";
DROP TABLE IF EXISTS "job_skills";
DROP TABLE IF EXISTS "bounty_tags";
DROP TABLE IF EXISTS "job_tags";
DROP TABLE IF EXISTS "payout";
DROP TABLE IF EXISTS "favourite_bounty";

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'favourite_job_job_id_member_id_key') THEN
    ALTER TABLE "favourite_job" DROP CONSTRAINT favourite_job_job_id_member_id_key;
  END IF;
END $$;
ALTER TABLE "favourite_job" DROP COLUMN IF EXISTS "job_id";

ALTER TABLE "bounty" DROP COLUMN IF EXISTS "remaining_req";
ALTER TABLE "bounty" DROP COLUMN IF EXISTS "department";
ALTER TABLE "bounty" DROP COLUMN IF EXISTS "updated_by";
ALTER TABLE "bounty" DROP COLUMN IF EXISTS "created_by";
ALTER TABLE "bounty" DROP COLUMN IF EXISTS "description_raw";
ALTER TABLE "bounty" DROP COLUMN IF EXISTS "subtask_id";
ALTER TABLE "bounty" DROP COLUMN IF EXISTS "task_id";

ALTER TABLE "opportunity" DROP COLUMN IF EXISTS "transaction_count";
ALTER TABLE "opportunity" DROP COLUMN IF EXISTS "remaining_req";
ALTER TABLE "opportunity" DROP COLUMN IF EXISTS "job_format";
ALTER TABLE "opportunity" DROP COLUMN IF EXISTS "experience";
ALTER TABLE "opportunity" DROP COLUMN IF EXISTS "open_to";
ALTER TABLE "opportunity" DROP COLUMN IF EXISTS "department";
ALTER TABLE "opportunity" DROP COLUMN IF EXISTS "updated_by";
ALTER TABLE "opportunity" DROP COLUMN IF EXISTS "description_raw";
ALTER TABLE "opportunity" DROP COLUMN IF EXISTS "subtask_id";

-- applicant_id -> appilcant_id rename-back (guarded).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'applicants' AND column_name = 'applicant_id'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'applicants' AND column_name = 'appilcant_id'
  ) THEN
    ALTER TABLE "applicants" RENAME COLUMN "applicant_id" TO "appilcant_id";
  END IF;
END $$;
