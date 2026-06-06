--
-- PostgreSQL database dump
--


-- Dumped from database version 17.10
-- Dumped by pg_dump version 17.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: applicantstatustype; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.applicantstatustype AS ENUM (
    'applied',
    'accepted',
    'rejected'
);


--
-- Name: jobtype; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.jobtype AS ENUM (
    'project',
    'task'
);


--
-- Name: statustype; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.statustype AS ENUM (
    'open',
    'draft',
    'closed'
);


--
-- Name: visibilitytype; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.visibilitytype AS ENUM (
    'public',
    'private'
);


--
-- Name: member_stub(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.member_stub(mid text) RETURNS json
    LANGUAGE sql IMMUTABLE
    AS $$
  SELECT json_build_object('member_id', COALESCE(mid, ''), 'username', '', 'name', '', 'profile_picture', '')
$$;


--
-- Name: payouts_for(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.payouts_for(link uuid) RETURNS json
    LANGUAGE sql STABLE
    AS $$
  SELECT json_agg(json_build_object(
      'payout_id', p.payout_id, 'link_type', p.link_type, 'link_id', p.link_id, 'name', p.name,
      'member_id', p.member_id, 'provider_id', p.provider_id, 'receiver_address', p.receiver_address,
      'payout_amount', p.payout_amount, 'payout_currency', p.payout_currency, 'token_address', p.token_address,
      'completed', p.completed, 'status', p.status, 'rank', p.rank, 'initiated_by', p.initiated_by,
      'created_at', p.created_at, 'updated_at', p.updated_at))
  FROM payout p WHERE p.link_id = link
$$;


--
-- Name: applicants_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.applicants_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: applicants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.applicants (
    id bigint DEFAULT nextval('public.applicants_seq'::regclass) NOT NULL,
    applicant_id uuid DEFAULT public.uuid_generate_v4(),
    job_id uuid,
    member_id uuid,
    answers json DEFAULT '{}'::json,
    status public.applicantstatustype DEFAULT 'applied'::public.applicantstatustype,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    application text,
    clan_id uuid
);


--
-- Name: bounty_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bounty_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bounty; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bounty (
    id bigint DEFAULT nextval('public.bounty_seq'::regclass) NOT NULL,
    bounty_id uuid DEFAULT public.uuid_generate_v4(),
    dao_id uuid NOT NULL,
    title text,
    description text,
    payout_amount integer DEFAULT 0,
    payout_currency text,
    winner_count integer,
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    poc_member_id uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    tags text[] DEFAULT '{}'::text[],
    skills text[] DEFAULT '{}'::text[],
    visibility public.visibilitytype DEFAULT 'public'::public.visibilitytype,
    req_people_count integer DEFAULT 1,
    status public.statustype DEFAULT 'draft'::public.statustype,
    project_id uuid NOT NULL,
    task_id uuid,
    subtask_id uuid,
    description_raw text,
    created_by uuid,
    updated_by uuid,
    department text,
    remaining_req integer
);


--
-- Name: bounty_files_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bounty_files_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bounty_files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bounty_files (
    id bigint DEFAULT nextval('public.bounty_files_seq'::regclass) NOT NULL,
    bounty_file_id uuid DEFAULT public.uuid_generate_v4(),
    bounty_id uuid,
    name text,
    url text,
    metadata json DEFAULT '{}'::json NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: bounty_skills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bounty_skills (
    skill text
);


--
-- Name: bounty_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bounty_tags (
    tag text
);


--
-- Name: submission_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.submission_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: submission; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.submission (
    id bigint DEFAULT nextval('public.submission_seq'::regclass) NOT NULL,
    bounty_id uuid,
    member_id uuid,
    submission text,
    file text,
    status public.applicantstatustype DEFAULT 'applied'::public.applicantstatustype,
    rank integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    feedback text,
    submission_id uuid DEFAULT public.uuid_generate_v4(),
    clan_id uuid
);


--
-- Name: bounty_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.bounty_view AS
 SELECT b.bounty_id,
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
    public.member_stub((b.poc_member_id)::text) AS poc_member,
    public.member_stub((b.created_by)::text) AS created_by,
    b.skills,
    b.tags,
    public.payouts_for(b.bounty_id) AS payout,
    ( SELECT json_agg(json_build_object('bounty_file_id', bf.bounty_file_id, 'bounty_id', bf.bounty_id, 'name', bf.name, 'url', bf.url, 'metadata', bf.metadata, 'created_at', bf.created_at)) AS json_agg
           FROM public.bounty_files bf
          WHERE (bf.bounty_id = b.bounty_id)) AS files,
    b.visibility,
    b.req_people_count,
    sc.total AS total_applicant_count,
    b.created_at,
    b.updated_at,
    public.member_stub((b.updated_by)::text) AS updated_by,
    b.department,
    sc.accepted AS accepted_submissions
   FROM (public.bounty b
     LEFT JOIN LATERAL ( SELECT (count(*))::integer AS total,
            (count(*) FILTER (WHERE (s.status = 'accepted'::public.applicantstatustype)))::integer AS accepted
           FROM public.submission s
          WHERE (s.bounty_id = b.bounty_id)) sc ON (true));


--
-- Name: favourite_bounty; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.favourite_bounty (
    id bigint NOT NULL,
    bounty_id uuid,
    member_id uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: favourite_bounty_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.favourite_bounty_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: favourite_bounty_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.favourite_bounty_id_seq OWNED BY public.favourite_bounty.id;


--
-- Name: favourite_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.favourite_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: favourite_job; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.favourite_job (
    id bigint DEFAULT nextval('public.favourite_seq'::regclass) NOT NULL,
    bounty_id uuid,
    member_id uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    job_id uuid
);


--
-- Name: job_files_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.job_files_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: job_files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_files (
    id bigint DEFAULT nextval('public.job_files_seq'::regclass) NOT NULL,
    job_file_id uuid DEFAULT public.uuid_generate_v4(),
    job_id uuid,
    name text,
    url text,
    metadata json DEFAULT '{}'::json NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: job_skills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_skills (
    skill text
);


--
-- Name: job_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_tags (
    tag text
);


--
-- Name: opportunity_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.opportunity_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: opportunity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.opportunity (
    id bigint DEFAULT nextval('public.opportunity_seq'::regclass) NOT NULL,
    job_id uuid DEFAULT public.uuid_generate_v4(),
    type public.jobtype,
    title text,
    description text,
    payout_amount integer DEFAULT 0,
    payout_currency text,
    req_people_count integer DEFAULT 1,
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    github text,
    dao_id uuid NOT NULL,
    poc_member_id uuid,
    task_id uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    tags text[] DEFAULT '{}'::text[],
    skills text[] DEFAULT '{}'::text[],
    questions json DEFAULT '{}'::json,
    status public.statustype DEFAULT 'draft'::public.statustype,
    created_by uuid,
    visibility public.visibilitytype DEFAULT 'public'::public.visibilitytype,
    captain boolean DEFAULT false,
    project_id uuid,
    subtask_id uuid,
    description_raw text,
    updated_by uuid,
    department text,
    open_to text[] DEFAULT '{}'::text[],
    experience integer,
    job_format text,
    remaining_req integer,
    transaction_count integer DEFAULT 0
);


--
-- Name: opportunity_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.opportunity_view AS
 SELECT o.job_id,
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
    public.payouts_for(o.job_id) AS payout,
    o.questions,
    o.status,
    o.visibility,
    public.member_stub((o.created_by)::text) AS created_by,
    public.member_stub((o.poc_member_id)::text) AS poc_member,
    ( SELECT json_agg(json_build_object('job_file_id', jf.job_file_id, 'job_id', jf.job_id, 'name', jf.name, 'url', jf.url, 'metadata', jf.metadata, 'created_at', jf.created_at)) AS json_agg
           FROM public.job_files jf
          WHERE (jf.job_id = o.job_id)) AS files,
    o.captain,
    o.created_at,
    o.updated_at,
    o.department,
    o.open_to,
    o.experience,
    o.job_format,
    public.member_stub((o.updated_by)::text) AS updated_by,
    o.transaction_count,
    ac.accepted AS accepted_applicants
   FROM (public.opportunity o
     LEFT JOIN LATERAL ( SELECT (count(*))::integer AS total,
            (count(*) FILTER (WHERE (a.status = 'accepted'::public.applicantstatustype)))::integer AS accepted
           FROM public.applicants a
          WHERE (a.job_id = o.job_id)) ac ON (true));


--
-- Name: payout; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payout (
    id bigint NOT NULL,
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
    status text,
    rank integer,
    initiated_by uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone
);


--
-- Name: payout_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payout_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payout_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payout_id_seq OWNED BY public.payout.id;


--
-- Name: pending_payouts; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.pending_payouts AS
 SELECT p.payout_id,
    COALESCE(o.dao_id, b.dao_id) AS dao_id,
    json_build_object('provider_id', COALESCE((p.provider_id)::text, ''::text)) AS provider,
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
    json_build_object('member_id', COALESCE((p.initiated_by)::text, ''::text)) AS initiated_by,
    p.created_at,
    p.updated_at
   FROM ((public.payout p
     LEFT JOIN public.opportunity o ON ((o.job_id = p.link_id)))
     LEFT JOIN public.bounty b ON ((b.bounty_id = p.link_id)))
  WHERE (p.initiated_by IS NULL);


--
-- Name: favourite_bounty id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favourite_bounty ALTER COLUMN id SET DEFAULT nextval('public.favourite_bounty_id_seq'::regclass);


--
-- Name: payout id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payout ALTER COLUMN id SET DEFAULT nextval('public.payout_id_seq'::regclass);


--
-- Name: applicants applicants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applicants
    ADD CONSTRAINT applicants_pkey PRIMARY KEY (id);


--
-- Name: bounty bounty_bounty_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bounty
    ADD CONSTRAINT bounty_bounty_id_key UNIQUE (bounty_id);


--
-- Name: bounty_files bounty_files_bounty_file_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bounty_files
    ADD CONSTRAINT bounty_files_bounty_file_id_key UNIQUE (bounty_file_id);


--
-- Name: bounty_files bounty_files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bounty_files
    ADD CONSTRAINT bounty_files_pkey PRIMARY KEY (id);


--
-- Name: bounty bounty_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bounty
    ADD CONSTRAINT bounty_pkey PRIMARY KEY (id);


--
-- Name: favourite_bounty favourite_bounty_bounty_id_member_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favourite_bounty
    ADD CONSTRAINT favourite_bounty_bounty_id_member_id_key UNIQUE (bounty_id, member_id);


--
-- Name: favourite_bounty favourite_bounty_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favourite_bounty
    ADD CONSTRAINT favourite_bounty_pkey PRIMARY KEY (id);


--
-- Name: favourite_job favourite_job_job_id_member_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favourite_job
    ADD CONSTRAINT favourite_job_job_id_member_id_key UNIQUE (job_id, member_id);


--
-- Name: favourite_job favourite_job_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favourite_job
    ADD CONSTRAINT favourite_job_pkey PRIMARY KEY (id);


--
-- Name: job_files job_files_job_file_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_files
    ADD CONSTRAINT job_files_job_file_id_key UNIQUE (job_file_id);


--
-- Name: job_files job_files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_files
    ADD CONSTRAINT job_files_pkey PRIMARY KEY (id);


--
-- Name: opportunity opportunity_job_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.opportunity
    ADD CONSTRAINT opportunity_job_id_key UNIQUE (job_id);


--
-- Name: opportunity opportunity_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.opportunity
    ADD CONSTRAINT opportunity_pkey PRIMARY KEY (id);


--
-- Name: payout payout_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payout
    ADD CONSTRAINT payout_id_key UNIQUE (id);


--
-- Name: payout payout_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payout
    ADD CONSTRAINT payout_pkey PRIMARY KEY (payout_id);


--
-- Name: submission submission_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submission
    ADD CONSTRAINT submission_pkey PRIMARY KEY (id);


--
-- Name: submission submission_submission_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submission
    ADD CONSTRAINT submission_submission_id_key UNIQUE (submission_id);


--
-- Name: applicants_index_0; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX applicants_index_0 ON public.applicants USING btree (id);


--
-- Name: bounty_files_index_3; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bounty_files_index_3 ON public.bounty_files USING btree (id);


--
-- Name: bounty_files_index_4; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bounty_files_index_4 ON public.bounty_files USING btree (bounty_file_id);


--
-- Name: bounty_index_1; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bounty_index_1 ON public.bounty USING btree (id);


--
-- Name: bounty_index_2; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bounty_index_2 ON public.bounty USING btree (bounty_id);


--
-- Name: favourite_job_index_5; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX favourite_job_index_5 ON public.favourite_job USING btree (id);


--
-- Name: idx_applicants_job_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_applicants_job_id ON public.applicants USING btree (job_id);


--
-- Name: idx_bounty_files_bounty_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bounty_files_bounty_id ON public.bounty_files USING btree (bounty_id);


--
-- Name: idx_favourite_bounty_bounty_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_favourite_bounty_bounty_id ON public.favourite_bounty USING btree (bounty_id);


--
-- Name: idx_job_files_job_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_job_files_job_id ON public.job_files USING btree (job_id);


--
-- Name: idx_payout_link_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payout_link_id ON public.payout USING btree (link_id);


--
-- Name: idx_payout_link_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payout_link_type ON public.payout USING btree (link_type);


--
-- Name: idx_submission_bounty_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_submission_bounty_id ON public.submission USING btree (bounty_id);


--
-- Name: job_files_index_6; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_files_index_6 ON public.job_files USING btree (id);


--
-- Name: job_files_index_7; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_files_index_7 ON public.job_files USING btree (job_file_id);


--
-- Name: opportunity_index_8; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX opportunity_index_8 ON public.opportunity USING btree (id);


--
-- Name: opportunity_index_9; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX opportunity_index_9 ON public.opportunity USING btree (job_id);


--
-- Name: submission_index_10; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX submission_index_10 ON public.submission USING btree (id);


--
-- Name: submission_index_11; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX submission_index_11 ON public.submission USING btree (submission_id);


--
-- Name: applicants applicants_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applicants
    ADD CONSTRAINT applicants_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.opportunity(job_id);


--
-- Name: bounty_files bounty_files_bounty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bounty_files
    ADD CONSTRAINT bounty_files_bounty_id_fkey FOREIGN KEY (bounty_id) REFERENCES public.bounty(bounty_id);


--
-- Name: favourite_job favourite_job_bounty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favourite_job
    ADD CONSTRAINT favourite_job_bounty_id_fkey FOREIGN KEY (bounty_id) REFERENCES public.opportunity(job_id);


--
-- Name: job_files job_files_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_files
    ADD CONSTRAINT job_files_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.opportunity(job_id);


--
-- Name: submission submission_bounty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submission
    ADD CONSTRAINT submission_bounty_id_fkey FOREIGN KEY (bounty_id) REFERENCES public.bounty(bounty_id);


--
-- PostgreSQL database dump complete
--


