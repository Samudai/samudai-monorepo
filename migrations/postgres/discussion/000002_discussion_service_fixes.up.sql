-- discussion service fixes: reconcile schema with the SQL the discussion service executes.

-- discussion columns (discussion.go CreateDiscussion/UpdateDiscussion/UpdateView/GetDiscussionByID).
-- visibility defaults to 'public' so existing rows pass the `visibility != 'private'` filter.
ALTER TABLE "discussion" ADD COLUMN IF NOT EXISTS "description_raw" text;
ALTER TABLE "discussion" ADD COLUMN IF NOT EXISTS "tags" text[] DEFAULT ('{}'::text[]);
ALTER TABLE "discussion" ADD COLUMN IF NOT EXISTS "pinned" boolean DEFAULT (false);
ALTER TABLE "discussion" ADD COLUMN IF NOT EXISTS "visibility" text DEFAULT ('public');
ALTER TABLE "discussion" ADD COLUMN IF NOT EXISTS "last_comment_at" timestamp;
ALTER TABLE "discussion" ADD COLUMN IF NOT EXISTS "views" integer DEFAULT (0);

-- message columns (message.go CreateMessage/UpdateMessageContent). tagged holds member_ids
-- (pq.Array(message.Tagged), Tagged []string) -> text[].
ALTER TABLE "message" ADD COLUMN IF NOT EXISTS "parent_id" uuid;
ALTER TABLE "message" ADD COLUMN IF NOT EXISTS "edited" boolean DEFAULT (false);
ALTER TABLE "message" ADD COLUMN IF NOT EXISTS "all_tagged" boolean DEFAULT (false);
ALTER TABLE "message" ADD COLUMN IF NOT EXISTS "tagged" text[] DEFAULT ('{}'::text[]);

-- Indexes for the view subqueries and dao filtering (PG doesn't index FK columns automatically).
CREATE INDEX IF NOT EXISTS idx_discussion_dao_id ON "discussion" ("dao_id");
CREATE INDEX IF NOT EXISTS idx_message_discussion_id ON "message" ("discussion_id");
CREATE INDEX IF NOT EXISTS idx_participant_discussion_id ON "participant" ("discussion_id");

-- Cross-DB member stub: member profile data lives in the member DB, so views expose only the
-- member_id and the gateway enriches username/name/profile_picture. Centralized here.
CREATE OR REPLACE FUNCTION public.member_stub(mid text) RETURNS json
  LANGUAGE sql IMMUTABLE AS $$
  SELECT json_build_object('member_id', COALESCE(mid, ''), 'username', '', 'name', '', 'profile_picture', '')
$$;

-- discussion_view: discussion.go GetDiscussionsByDAOID/ByMemberID/Count read FROM discussion_view.
-- Columns + order match the GetDiscussionsByDAOID Scan exactly. created_by/participants are
-- cross-DB member info -> expose the member_id (IMember) form; the gateway enriches the rest.
-- messages is a json array of the base Message shape; participant_count/message_count are computed.
CREATE OR REPLACE VIEW public.discussion_view AS
SELECT
  d.discussion_id,
  d.dao_id,
  d.topic,
  d.description,
  member_stub(d.created_by::text) AS created_by,
  d.updated_by,
  d.category,
  d.category_id,
  d.closed,
  d.created_at,
  d.updated_at,
  pcte.cnt AS participant_count,
  pcte.arr AS participants,
  mcte.arr AS messages,
  d.proposal_id,
  COALESCE(d.tags, '{}'::text[]) AS tags,
  d.pinned,
  d.last_comment_at,
  d.views,
  mcte.cnt AS message_count,
  d.visibility
FROM discussion d
-- one pass each over participant/message yields both the count and the json array.
LEFT JOIN LATERAL (
  SELECT count(*)::int AS cnt,
         COALESCE(json_agg(member_stub(p.member_id::text)), '[]'::json) AS arr
  FROM participant p WHERE p.discussion_id = d.discussion_id
) pcte ON true
LEFT JOIN LATERAL (
  SELECT count(*)::int AS cnt,
         COALESCE(json_agg(json_build_object(
             'message_id',      m.message_id,
             'discussion_id',   m.discussion_id,
             'type',            m.type,
             'content',         m.content,
             'sender_id',       m.sender_id,
             'attachment_link', m.attachment_link,
             'metadata',        m.metadata,
             'parent_id',       m.parent_id,
             'edited',          m.edited,
             'all_tagged',      m.all_tagged,
             'tagged',          COALESCE(m.tagged, '{}'::text[]),
             'created_at',      m.created_at,
             'updated_at',      m.updated_at
           ) ORDER BY m.created_at), '[]'::json) AS arr
  FROM message m WHERE m.discussion_id = d.discussion_id
) mcte ON true;

-- message_view: message.go GetMessagesByDiscussionID reads FROM message_view.
-- Columns + order match the Scan exactly. sender is a cross-DB IMember (member_id form);
-- parent_message is the referenced parent (NULL when parent_id is null); tagged is a json
-- array of IMember built from the tagged member_id array.
CREATE OR REPLACE VIEW public.message_view AS
SELECT
  m.message_id,
  m.discussion_id,
  m.type,
  m.content,
  m.sender_id,
  member_stub(m.sender_id::text) AS sender,
  m.attachment_link,
  m.metadata,
  m.created_at,
  m.updated_at,
  CASE WHEN m.parent_id IS NULL THEN NULL ELSE (
    SELECT json_build_object(
        'message_id',      pm.message_id,
        'discussion_id',   pm.discussion_id,
        'type',            pm.type,
        'content',         pm.content,
        'sender',          member_stub(pm.sender_id::text),
        'attachment_link', pm.attachment_link,
        'metadata',        pm.metadata
      )
    FROM message pm WHERE pm.message_id = m.parent_id
  ) END AS parent_message,
  m.edited,
  m.all_tagged,
  COALESCE((
    SELECT json_agg(member_stub(t::text))
    FROM unnest(m.tagged) AS t
  ), '[]'::json) AS tagged
FROM message m;
