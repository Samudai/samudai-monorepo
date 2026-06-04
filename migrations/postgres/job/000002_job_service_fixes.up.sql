-- job service fixes: reconcile schema with the SQL the job service executes.
-- Idempotent + guarded so it is correct on both fresh and already-applied databases.

-- applicants typo: code uses applicant_id everywhere; 000001 spelled it appilcant_id.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'applicants' AND column_name = 'appilcant_id'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'applicants' AND column_name = 'applicant_id'
  ) THEN
    ALTER TABLE "applicants" RENAME COLUMN "appilcant_id" TO "applicant_id";
  END IF;
END $$;

-- opportunity: columns the service writes/reads (job.go CreateOpportunity/UpdateOpportunity,
-- *_view scans). open_to is pq.Array -> text[]; experience/remaining_req/transaction_count are ints.
ALTER TABLE "opportunity" ADD COLUMN IF NOT EXISTS "subtask_id" uuid;
ALTER TABLE "opportunity" ADD COLUMN IF NOT EXISTS "description_raw" text;
ALTER TABLE "opportunity" ADD COLUMN IF NOT EXISTS "updated_by" uuid;
ALTER TABLE "opportunity" ADD COLUMN IF NOT EXISTS "department" text;
ALTER TABLE "opportunity" ADD COLUMN IF NOT EXISTS "open_to" text[] DEFAULT ('{}'::text[]);
ALTER TABLE "opportunity" ADD COLUMN IF NOT EXISTS "experience" integer;
ALTER TABLE "opportunity" ADD COLUMN IF NOT EXISTS "job_format" text;
ALTER TABLE "opportunity" ADD COLUMN IF NOT EXISTS "remaining_req" integer;
ALTER TABLE "opportunity" ADD COLUMN IF NOT EXISTS "transaction_count" integer DEFAULT (0);

-- bounty: columns the service writes/reads (bounty.go CreateBounty/UpdateBounty, *_view scans).
ALTER TABLE "bounty" ADD COLUMN IF NOT EXISTS "task_id" uuid;
ALTER TABLE "bounty" ADD COLUMN IF NOT EXISTS "subtask_id" uuid;
ALTER TABLE "bounty" ADD COLUMN IF NOT EXISTS "description_raw" text;
ALTER TABLE "bounty" ADD COLUMN IF NOT EXISTS "created_by" uuid;
ALTER TABLE "bounty" ADD COLUMN IF NOT EXISTS "updated_by" uuid;
ALTER TABLE "bounty" ADD COLUMN IF NOT EXISTS "department" text;
ALTER TABLE "bounty" ADD COLUMN IF NOT EXISTS "remaining_req" integer;

-- favourite_job: code inserts (job_id, member_id) with ON CONFLICT (job_id, member_id);
-- 000001 only has bounty_id. Add job_id + the unique constraint the upsert relies on.
ALTER TABLE "favourite_job" ADD COLUMN IF NOT EXISTS "job_id" uuid;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'favourite_job_job_id_member_id_key'
  ) THEN
    ALTER TABLE "favourite_job" ADD CONSTRAINT favourite_job_job_id_member_id_key UNIQUE (job_id, member_id);
  END IF;
END $$;

-- favourite_bounty: entirely absent from 000001 (favourite_bounty.go).
CREATE TABLE IF NOT EXISTS "favourite_bounty" (
  "id" bigserial PRIMARY KEY,
  "bounty_id" uuid,
  "member_id" uuid,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  UNIQUE ("bounty_id", "member_id")
);

-- payout: entirely absent from 000001 (payout.go). payout_id is the uuid PK; id is a bigint
-- surrogate used by UpdatePayoutByLinkIdForTransaction's ROW_NUMBER/self-join.
-- payout_amount is float64; payout_currency is json; status is the PayoutStatusType text enum.
CREATE TABLE IF NOT EXISTS "payout" (
  "id" bigserial UNIQUE NOT NULL,
  "payout_id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "provider_id" uuid,
  "link_type" text,
  "link_id" uuid,
  "name" text,
  "receiver_address" text,
  "payout_amount" double precision,
  "payout_currency" json,
  "token_address" text,
  "completed" boolean DEFAULT (false),
  "member_id" uuid,
  "status" text,
  "rank" integer,
  "initiated_by" uuid,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp
);

-- lookup tables (read-only SELECTs; seeding is out of scope).
CREATE TABLE IF NOT EXISTS "job_tags" ("tag" text);
CREATE TABLE IF NOT EXISTS "bounty_tags" ("tag" text);
CREATE TABLE IF NOT EXISTS "job_skills" ("skill" text);
CREATE TABLE IF NOT EXISTS "bounty_skills" ("skill" text);

-- Indexes for the view subqueries + payout lookups (no duplicates of 000001's id indexes).
CREATE INDEX IF NOT EXISTS idx_applicants_job_id ON "applicants" ("job_id");
CREATE INDEX IF NOT EXISTS idx_submission_bounty_id ON "submission" ("bounty_id");
CREATE INDEX IF NOT EXISTS idx_job_files_job_id ON "job_files" ("job_id");
CREATE INDEX IF NOT EXISTS idx_bounty_files_bounty_id ON "bounty_files" ("bounty_id");
CREATE INDEX IF NOT EXISTS idx_payout_link_id ON "payout" ("link_id");
CREATE INDEX IF NOT EXISTS idx_payout_link_type ON "payout" ("link_type");
CREATE INDEX IF NOT EXISTS idx_favourite_bounty_bounty_id ON "favourite_bounty" ("bounty_id");

-- Cross-DB member stub (member profile lives in the member DB; gateway enriches the rest).
CREATE OR REPLACE FUNCTION public.member_stub(mid text) RETURNS json
  LANGUAGE sql IMMUTABLE AS $$
  SELECT json_build_object('member_id', COALESCE(mid, ''), 'username', '', 'name', '', 'profile_picture', '')
$$;

-- json array of the payout rows linked to a job/bounty (NULL when none, matching the code's
-- `if payout != nil` guard). Shared by opportunity_view and bounty_view so the 16-field shape
-- lives in one place.
CREATE OR REPLACE FUNCTION public.payouts_for(link uuid) RETURNS json
  LANGUAGE sql STABLE AS $$
  SELECT json_agg(json_build_object(
      'payout_id', p.payout_id, 'link_type', p.link_type, 'link_id', p.link_id, 'name', p.name,
      'member_id', p.member_id, 'provider_id', p.provider_id, 'receiver_address', p.receiver_address,
      'payout_amount', p.payout_amount, 'payout_currency', p.payout_currency, 'token_address', p.token_address,
      'completed', p.completed, 'status', p.status, 'rank', p.rank, 'initiated_by', p.initiated_by,
      'created_at', p.created_at, 'updated_at', p.updated_at))
  FROM payout p WHERE p.link_id = link
$$;

-- opportunity_view: job.go (SearchNFilterJob / GetOpportunityCreatedBy / GetOpportunityByDAOID /
-- GetPublicOpportunities / GetOpportunityByID / favourite.GetFavouriteList) read FROM opportunity_view.
-- Different queries name different subsets, so the view is a verified SUPERSET of every Scan.
-- created_by/poc_member/updated_by are cross-DB member info -> json with member_id (gateway enriches);
-- dao_name/project_name/task_name/subtask_name are cross-DB -> NULL::text (code COALESCEs);
-- payout is a json array of the related payout rows; files aggregates job_files; counts are computed.
CREATE OR REPLACE VIEW public.opportunity_view AS
SELECT
  o.job_id,
  o.dao_id,
  NULL::text AS dao_name,
  o.type,
  o.project_id,
  NULL::text AS project_name,
  o.task_id,
  NULL::text AS task_name,
  o.subtask_id,
  NULL::text AS subtask_name,
  o.title,
  o.description,
  o.description_raw,
  o.req_people_count,
  ac.total AS total_applicant_count,
  o.start_date,
  o.end_date,
  o.github,
  o.skills,
  o.tags,
  payouts_for(o.job_id) AS payout,
  o.questions,
  o.status,
  o.visibility,
  member_stub(o.created_by::text) AS created_by,
  member_stub(o.poc_member_id::text) AS poc_member,
  (SELECT json_agg(json_build_object(
      'job_file_id', jf.job_file_id, 'job_id', jf.job_id, 'name', jf.name, 'url', jf.url,
      'metadata', jf.metadata, 'created_at', jf.created_at))
   FROM job_files jf WHERE jf.job_id = o.job_id) AS files,
  o.captain,
  o.created_at,
  o.updated_at,
  o.department,
  o.open_to,
  o.experience,
  o.job_format,
  member_stub(o.updated_by::text) AS updated_by,
  o.transaction_count,
  ac.accepted AS accepted_applicants
FROM opportunity o
-- one pass over applicants yields both the total and accepted counts.
LEFT JOIN LATERAL (
  SELECT count(*)::int AS total,
         count(*) FILTER (WHERE a.status = 'accepted')::int AS accepted
  FROM applicants a WHERE a.job_id = o.job_id
) ac ON true;

-- bounty_view: bounty.go (GetBountyByID / GetBountyByDAOID / GetOpenBounties / GetBountyCreatedBy /
-- GetBountyListForMember / favourite_bounty.GetFavouriteListBounty) read FROM bounty_view.
-- Superset of every Scan; same cross-DB conventions as opportunity_view. For a bounty, "applicants"
-- are submissions, so total_applicant_count/accepted_submissions count the submission table.
CREATE OR REPLACE VIEW public.bounty_view AS
SELECT
  b.bounty_id,
  b.dao_id,
  NULL::text AS dao_name,
  b.project_id,
  NULL::text AS project_name,
  b.task_id,
  NULL::text AS task_name,
  b.subtask_id,
  NULL::text AS subtask_name,
  b.title,
  b.description,
  b.description_raw,
  b.winner_count,
  b.start_date,
  b.end_date,
  b.status,
  member_stub(b.poc_member_id::text) AS poc_member,
  member_stub(b.created_by::text) AS created_by,
  b.skills,
  b.tags,
  payouts_for(b.bounty_id) AS payout,
  (SELECT json_agg(json_build_object(
      'bounty_file_id', bf.bounty_file_id, 'bounty_id', bf.bounty_id, 'name', bf.name, 'url', bf.url,
      'metadata', bf.metadata, 'created_at', bf.created_at))
   FROM bounty_files bf WHERE bf.bounty_id = b.bounty_id) AS files,
  b.visibility,
  b.req_people_count,
  sc.total AS total_applicant_count,
  b.created_at,
  b.updated_at,
  member_stub(b.updated_by::text) AS updated_by,
  b.department,
  sc.accepted AS accepted_submissions
FROM bounty b
-- one pass over submission yields both the total and accepted counts.
LEFT JOIN LATERAL (
  SELECT count(*)::int AS total,
         count(*) FILTER (WHERE s.status = 'accepted')::int AS accepted
  FROM submission s WHERE s.bounty_id = b.bounty_id
) sc ON true;

-- pending_payouts: payout.go GetUninitiatedPayoutForDao reads FROM pending_payouts WHERE dao_id = $1.
-- dao_id is resolved from the payout's link (opportunity.job_id or bounty.bounty_id). provider and
-- initiated_by are cross-DB -> json with the id form. "Pending/uninitiated" = initiated_by IS NULL.
CREATE OR REPLACE VIEW public.pending_payouts AS
SELECT
  p.payout_id,
  COALESCE(o.dao_id, b.dao_id) AS dao_id,
  json_build_object('provider_id', COALESCE(p.provider_id::text, '')) AS provider,
  p.link_type,
  p.link_id,
  p.member_id,
  p.receiver_address,
  p.payout_amount,
  p.payout_currency,
  p.token_address,
  p.name,
  p.completed,
  p.status,
  json_build_object('member_id', COALESCE(p.initiated_by::text, '')) AS initiated_by,
  p.created_at,
  p.updated_at
FROM payout p
LEFT JOIN opportunity o ON o.job_id = p.link_id
LEFT JOIN bounty b ON b.bounty_id = p.link_id
WHERE p.initiated_by IS NULL;
