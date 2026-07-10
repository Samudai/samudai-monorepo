CREATE TABLE IF NOT EXISTS public.payout (
    payout_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    provider_id uuid,
    link_type text,
    link_id uuid,
    name text,
    receiver_address text,
    payout_amount double precision,
    payout_currency json,
    token_address text,
    completed boolean DEFAULT false,
    member_id uuid,
    payment_status text,
    initiated_by uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    CONSTRAINT payout_pkey PRIMARY KEY (payout_id)
);

CREATE VIEW public.pending_payouts AS
 SELECT py.payout_id,
    proj.link_id AS dao_id,
    json_build_object('provider_id', COALESCE(py.provider_id::text, ''::text)) AS provider,
    py.link_type,
    py.link_id,
    COALESCE(t.project_id, s.project_id) AS project_id,
    py.member_id,
    py.receiver_address,
    py.payout_amount,
    py.payout_currency,
    py.token_address,
    COALESCE(t.payment_created, s.payment_created, false) AS payment_created,
    py.completed,
    json_build_object('member_id', COALESCE(py.initiated_by::text, ''::text)) AS initiated_by,
    py.created_at,
    py.updated_at
   FROM (((public.payout py
     LEFT JOIN public.task t ON (py.link_type = 'task' AND t.task_id = py.link_id))
     LEFT JOIN public.subtask s ON (py.link_type = 'subtask' AND s.subtask_id = py.link_id))
     LEFT JOIN public.project proj ON (proj.project_id = COALESCE(t.project_id, s.project_id)));
