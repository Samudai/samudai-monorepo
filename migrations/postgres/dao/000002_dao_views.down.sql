-- 000002 only *introduces* the two views (and the member_stub helper); the columns, tables and
-- renames it also touches are ensured idempotently but are owned by 000001 and reversed by
-- 000001's down. Reverse only what is unique to 000002 here, so rolling back to version 1
-- doesn't strip objects that the (still-applied) 000001 created.
DROP VIEW IF EXISTS public.dao_view;
DROP VIEW IF EXISTS public.members_view;
DROP FUNCTION IF EXISTS public.member_stub(text);
