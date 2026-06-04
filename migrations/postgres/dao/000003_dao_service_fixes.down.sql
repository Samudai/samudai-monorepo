-- Reverse 000003_dao_service_fixes. Drop views before the columns they depend on.
DROP VIEW IF EXISTS public.collaboration_view;
DROP TABLE IF EXISTS "dao_subdomains";
ALTER TABLE "collaboration" DROP COLUMN IF EXISTS "scope";
-- collaboration.requirements type change (json -> text[]) is intentionally NOT reversed
-- (a data-preserving down is unsafe).
ALTER TABLE "provider" DROP COLUMN IF EXISTS "provider_id";
ALTER TABLE "blogs" DROP COLUMN IF EXISTS "metadata";
