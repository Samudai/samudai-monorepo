-- Reverse 000002_discussion_service_fixes. Drop views before the columns they reference.
DROP VIEW IF EXISTS public.message_view;
DROP VIEW IF EXISTS public.discussion_view;
DROP FUNCTION IF EXISTS public.member_stub(text);

DROP INDEX IF EXISTS idx_participant_discussion_id;
DROP INDEX IF EXISTS idx_message_discussion_id;
DROP INDEX IF EXISTS idx_discussion_dao_id;

ALTER TABLE "message" DROP COLUMN IF EXISTS "tagged";
ALTER TABLE "message" DROP COLUMN IF EXISTS "all_tagged";
ALTER TABLE "message" DROP COLUMN IF EXISTS "edited";
ALTER TABLE "message" DROP COLUMN IF EXISTS "parent_id";

ALTER TABLE "discussion" DROP COLUMN IF EXISTS "views";
ALTER TABLE "discussion" DROP COLUMN IF EXISTS "last_comment_at";
ALTER TABLE "discussion" DROP COLUMN IF EXISTS "visibility";
ALTER TABLE "discussion" DROP COLUMN IF EXISTS "pinned";
ALTER TABLE "discussion" DROP COLUMN IF EXISTS "tags";
ALTER TABLE "discussion" DROP COLUMN IF EXISTS "description_raw";
