-- discovery service fixes: reconcile schema with the SQL the discovery service executes.
-- member.go RecordMemberEvent inserts dao_id, but 000001's member_events has no dao_id.
ALTER TABLE "member_events" ADD COLUMN IF NOT EXISTS "dao_id" uuid;
