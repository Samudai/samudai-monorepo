-- dao service fixes: reconcile schema with the SQL the dao service executes.
-- Idempotent + guarded so it is correct on both fresh and already-applied databases.

-- blogs.metadata: blog.go CreateBlog/ListBlogsForDAO insert & select a json metadata column.
ALTER TABLE "blogs" ADD COLUMN IF NOT EXISTS "metadata" json;

-- provider.provider_id: provider.go does `RETURNING provider_id` and
-- `WHERE provider_id = $1::uuid` / `SELECT provider_id, ...`. The 000001 table only has
-- bigint id. provider_id is also the FK target of job.payout.provider_id.
ALTER TABLE "provider" ADD COLUMN IF NOT EXISTS "provider_id" uuid UNIQUE DEFAULT (uuid_generate_v4());

-- collaboration.scope: collaboration.go CreateDAOCollaboration inserts scope.
ALTER TABLE "collaboration" ADD COLUMN IF NOT EXISTS "scope" text;

-- collaboration.requirements is scanned/inserted with pq.Array, so it must be a text[]
-- array, not json (the 000001 type). The 000001 default was an empty json object and
-- pq.Array inserts into a json column always errored, so no real array data exists;
-- reset to an empty text[] (a constant USING expr — subqueries aren't allowed here).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'collaboration'
      AND column_name = 'requirements' AND data_type = 'json'
  ) THEN
    ALTER TABLE "collaboration" ALTER COLUMN "requirements" DROP DEFAULT;
    ALTER TABLE "collaboration" ALTER COLUMN "requirements" TYPE text[] USING '{}'::text[];
    ALTER TABLE "collaboration" ALTER COLUMN "requirements" SET DEFAULT ('{}'::text[]);
  END IF;
END $$;

-- dao_subdomains: dao.go ClaimSubdomain/CheckSubdomain/FetchSubdomainByDAOID.
-- One claim per DAO (ClaimSubdomain uses ON CONFLICT (dao_id)) -> dao_id is UNIQUE.
CREATE TABLE IF NOT EXISTS "dao_subdomains" (
  "id" bigserial PRIMARY KEY,
  "dao_id" uuid UNIQUE NOT NULL,
  "subdomain_claimed" text,
  "provider_address" text,
  "approved" boolean DEFAULT (false),
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp
);

-- collaboration_view: collaboration.go ListDAOCollaborations selects, in this order,
-- collaboration_id, applying_member(json), from_dao_id, to_dao_id, status, title,
-- department, description, requirements(text[]), benefits, attachment, scope,
-- replying_member(json), created_at, updated_at.
-- Member profile info lives in the member DB (cross-DB), so applying_member/replying_member
-- expose member_id only and the gateway enriches them, mirroring poc_member in dao_view.
CREATE OR REPLACE VIEW public.collaboration_view AS
SELECT
  c.collaboration_id,
  member_stub(c.applying_member_id::text) AS applying_member,
  c.from_dao_id,
  c.to_dao_id,
  c.status,
  c.title,
  c.department,
  c.description,
  c.requirements,
  c.benefits,
  c.attachment,
  c.scope,
  member_stub(c.replying_member_id::text) AS replying_member,
  c.created_at,
  c.updated_at
FROM collaboration c;
