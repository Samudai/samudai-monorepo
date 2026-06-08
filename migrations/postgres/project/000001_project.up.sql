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
-- Name: accesstype; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.accesstype AS ENUM (
    'hidden',
    'view',
    'create_task',
    'manage_project'
);


--
-- Name: commenttype; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.commenttype AS ENUM (
    'project',
    'task'
);


--
-- Name: linktype; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.linktype AS ENUM (
    'dao',
    'member',
    'clan'
);


--
-- Name: projecttype; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.projecttype AS ENUM (
    'default',
    'internal',
    'investment'
);


--
-- Name: visibilitytype; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.visibilitytype AS ENUM (
    'public',
    'private'
);


--
-- Name: access_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.access_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: access; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.access (
    id bigint DEFAULT nextval('public.access_seq'::regclass) NOT NULL,
    project_id uuid,
    access public.accesstype,
    members uuid[] DEFAULT '{}'::uuid[],
    roles uuid[] DEFAULT '{}'::uuid[],
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    invite_link text DEFAULT substr(md5((random())::text), 0, 10)
);


--
-- Name: comments_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comments_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comments (
    id bigint DEFAULT nextval('public.comments_seq'::regclass) NOT NULL,
    link_id uuid,
    body text,
    author uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    type public.commenttype NOT NULL,
    tagged_members uuid[] DEFAULT '{}'::uuid[]
);


--
-- Name: project_folder_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.project_folder_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: folder; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.folder (
    id bigint DEFAULT nextval('public.project_folder_seq'::regclass) NOT NULL,
    folder_id uuid DEFAULT public.uuid_generate_v4(),
    name text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    project_id uuid,
    description text,
    created_by uuid,
    updated_by uuid
);


--
-- Name: form_response_id; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.form_response_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: form_response; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.form_response (
    id bigint DEFAULT nextval('public.form_response_id'::regclass) NOT NULL,
    response_id uuid DEFAULT public.uuid_generate_v4(),
    response_type text,
    mongo_object text,
    title text,
    col integer DEFAULT 1,
    "position" double precision,
    assignee_member uuid[] DEFAULT '{}'::uuid[],
    assignee_clan uuid[] DEFAULT '{}'::uuid[],
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    updated_by uuid,
    discussion_id uuid
);


--
-- Name: member_assigned; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.member_assigned (
    id bigint NOT NULL,
    project_id uuid,
    member_id uuid
);


--
-- Name: member_assigned_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.member_assigned_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: member_assigned_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.member_assigned_id_seq OWNED BY public.member_assigned.id;


--
-- Name: project_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.project_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: project; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project (
    id bigint DEFAULT nextval('public.project_seq'::regclass) NOT NULL,
    project_id uuid DEFAULT public.uuid_generate_v4(),
    description text,
    title text,
    visibility public.visibilitytype DEFAULT 'public'::public.visibilitytype NOT NULL,
    poc_member_id uuid,
    created_by uuid,
    discord_channel text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    link_id uuid,
    updated_by uuid,
    "default" boolean DEFAULT false,
    github_repos text[] DEFAULT '{}'::text[],
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    type public.linktype DEFAULT 'dao'::public.linktype NOT NULL,
    captain uuid,
    department uuid,
    notion_database text,
    columns text DEFAULT '[]'::text,
    budget_amount numeric,
    budget_currency text,
    completed boolean DEFAULT false,
    project_type public.projecttype DEFAULT 'default'::public.projecttype,
    total_col integer,
    pinned boolean DEFAULT false,
    form_id text,
    is_archived boolean DEFAULT false
);


--
-- Name: project_file_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.project_file_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: project_files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project_files (
    id bigint DEFAULT nextval('public.project_file_seq'::regclass) NOT NULL,
    project_file_id uuid DEFAULT public.uuid_generate_v4(),
    name text,
    url text,
    metadata json DEFAULT '{}'::json NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    folder_id uuid
);


--
-- Name: subtask_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.subtask_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: subtask; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subtask (
    id bigint DEFAULT nextval('public.subtask_seq'::regclass) NOT NULL,
    subtask_id uuid DEFAULT public.uuid_generate_v4(),
    task_id uuid,
    title text NOT NULL,
    completed boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    project_id uuid,
    description text,
    description_raw text,
    deadline timestamp without time zone,
    poc_member_id uuid,
    assignee_member uuid[] DEFAULT '{}'::uuid[],
    github_issue integer DEFAULT 0,
    "position" double precision,
    notion_page text,
    notion_property text,
    col integer DEFAULT 0,
    payout text DEFAULT '[]'::text,
    payment_created boolean DEFAULT false,
    github_pr json,
    archived boolean DEFAULT false,
    associated_job_type text DEFAULT 'none'::text,
    associated_job_id uuid,
    created_by uuid,
    updated_by uuid
);


--
-- Name: subtask_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.subtask_view AS
 SELECT subtask_id,
    task_id,
    project_id,
    title,
    completed,
    description,
    description_raw,
    deadline,
    poc_member_id,
    assignee_member,
    github_issue,
    "position",
    notion_page,
    notion_property,
    col,
    payout,
    payment_created,
    github_pr,
    archived,
    associated_job_type,
    associated_job_id,
    created_by,
    updated_by,
    created_at,
    updated_at
   FROM public.subtask s;


--
-- Name: tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tags (
    id bigint NOT NULL,
    tag text
);


--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- Name: task_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.task_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: task; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.task (
    id bigint DEFAULT nextval('public.task_seq'::regclass) NOT NULL,
    task_id uuid DEFAULT public.uuid_generate_v4(),
    title text,
    description text,
    poc_member_id uuid,
    deadline timestamp without time zone,
    created_by uuid,
    updated_by uuid,
    assignee_member uuid[] DEFAULT '{}'::uuid[],
    project_id uuid,
    tags text[] DEFAULT '{}'::text[],
    feedback text,
    assignee_clan uuid[] DEFAULT '{}'::uuid[],
    github_issue integer DEFAULT 0,
    "position" double precision NOT NULL,
    notion_page text,
    notion_property text,
    col integer NOT NULL,
    payout text DEFAULT '[]'::text,
    vc_claim boolean DEFAULT false,
    payment_created boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    description_raw text,
    github_pr json,
    archived boolean DEFAULT false,
    associated_job_type text DEFAULT 'none'::text,
    associated_job_id uuid,
    source text
);


--
-- Name: task_credentials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.task_credentials (
    id bigint NOT NULL,
    task_id uuid,
    member_id uuid,
    vc_claim boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: task_credentials_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.task_credentials_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: task_credentials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.task_credentials_id_seq OWNED BY public.task_credentials.id;


--
-- Name: task_file_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.task_file_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tasks_files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tasks_files (
    id bigint DEFAULT nextval('public.task_file_seq'::regclass) NOT NULL,
    task_file_id uuid DEFAULT public.uuid_generate_v4(),
    task_id uuid,
    name text,
    url text,
    metadata json DEFAULT '{}'::json,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: task_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.task_view AS
 SELECT t.task_id,
    t.project_id,
    t.title,
    t.description,
    t.description_raw,
    t.col,
    t.created_by,
    t.updated_by,
    t.poc_member_id,
    t.notion_page,
    t.notion_property,
    t.tags,
    t.deadline,
    t.assignee_member,
    t.assignee_clan,
    t.feedback,
    t."position",
    t.github_issue,
    t.github_pr,
    t.payout,
    t.payment_created,
    t.archived,
    t.associated_job_type,
    t.associated_job_id,
    t.source,
    t.created_at,
    t.updated_at,
    ARRAY( SELECT tc.member_id
           FROM public.task_credentials tc
          WHERE ((tc.task_id = t.task_id) AND (tc.vc_claim = true))) AS vc_claim,
    p.title AS project_name,
    p.columns,
    p.link_id AS dao_id,
    NULL::text AS dao_name,
    p.department,
    ( SELECT to_json(COALESCE(json_agg(json_build_object('task_file_id', f.task_file_id, 'task_id', f.task_id, 'name', f.name, 'url', f.url, 'metadata', f.metadata, 'created_at', f.created_at)), '[]'::json)) AS to_json
           FROM public.tasks_files f
          WHERE (f.task_id = t.task_id)) AS files,
    ( SELECT to_json(COALESCE(json_agg(json_build_object('subtask_id', s.subtask_id, 'task_id', s.task_id, 'project_id', s.project_id, 'title', s.title, 'completed', s.completed, 'description', s.description, 'description_raw', s.description_raw, 'deadline', s.deadline, 'poc_member_id', s.poc_member_id, 'assignee_member', s.assignee_member, 'github_issue', s.github_issue, 'position', s."position", 'notion_page', s.notion_page, 'notion_property', s.notion_property, 'col', s.col, 'payout', s.payout, 'payment_created', s.payment_created, 'github_pr', s.github_pr, 'archived', s.archived, 'associated_job_type', s.associated_job_type, 'associated_job_id', s.associated_job_id, 'created_by', s.created_by, 'updated_by', s.updated_by, 'created_at', s.created_at, 'updated_at', s.updated_at)), '[]'::json)) AS to_json
           FROM public.subtask s
          WHERE (s.task_id = t.task_id)) AS subtasks,
    ( SELECT to_json(COALESCE(json_agg(json_build_object('id', c.id, 'link_id', c.link_id, 'body', c.body, 'author', c.author, 'type', c.type, 'tagged_members', c.tagged_members, 'created_at', c.created_at, 'updated_at', c.updated_at)), '[]'::json)) AS to_json
           FROM public.comments c
          WHERE ((c.link_id = t.task_id) AND (c.type = 'task'::public.commenttype))) AS comments
   FROM (public.task t
     LEFT JOIN public.project p ON ((p.project_id = t.project_id)));


--
-- Name: member_assigned id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_assigned ALTER COLUMN id SET DEFAULT nextval('public.member_assigned_id_seq'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- Name: task_credentials id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_credentials ALTER COLUMN id SET DEFAULT nextval('public.task_credentials_id_seq'::regclass);


--
-- Name: access access_invite_link_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access
    ADD CONSTRAINT access_invite_link_key UNIQUE (invite_link);


--
-- Name: access access_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access
    ADD CONSTRAINT access_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: folder folder_folder_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.folder
    ADD CONSTRAINT folder_folder_id_key UNIQUE (folder_id);


--
-- Name: folder folder_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.folder
    ADD CONSTRAINT folder_pkey PRIMARY KEY (id);


--
-- Name: form_response form_response_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.form_response
    ADD CONSTRAINT form_response_pkey PRIMARY KEY (id);


--
-- Name: form_response form_response_response_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.form_response
    ADD CONSTRAINT form_response_response_id_key UNIQUE (response_id);


--
-- Name: member_assigned member_assigned_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_assigned
    ADD CONSTRAINT member_assigned_pkey PRIMARY KEY (id);


--
-- Name: project_files project_files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_files
    ADD CONSTRAINT project_files_pkey PRIMARY KEY (id);


--
-- Name: project_files project_files_project_file_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_files
    ADD CONSTRAINT project_files_project_file_id_key UNIQUE (project_file_id);


--
-- Name: project project_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_pkey PRIMARY KEY (id);


--
-- Name: project project_project_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_project_id_key UNIQUE (project_id);


--
-- Name: subtask subtask_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subtask
    ADD CONSTRAINT subtask_pkey PRIMARY KEY (id);


--
-- Name: subtask subtask_subtask_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subtask
    ADD CONSTRAINT subtask_subtask_id_key UNIQUE (subtask_id);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: task_credentials task_credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_credentials
    ADD CONSTRAINT task_credentials_pkey PRIMARY KEY (id);


--
-- Name: task task_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT task_pkey PRIMARY KEY (id);


--
-- Name: task task_task_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT task_task_id_key UNIQUE (task_id);


--
-- Name: tasks_files tasks_files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks_files
    ADD CONSTRAINT tasks_files_pkey PRIMARY KEY (id);


--
-- Name: tasks_files tasks_files_task_file_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks_files
    ADD CONSTRAINT tasks_files_task_file_id_key UNIQUE (task_file_id);


--
-- Name: access_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX access_id_idx ON public.access USING btree (id);


--
-- Name: access_invite_link_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX access_invite_link_idx ON public.access USING btree (invite_link);


--
-- Name: comments_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX comments_id_idx ON public.comments USING btree (id);


--
-- Name: folder_folder_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX folder_folder_id_idx ON public.folder USING btree (folder_id);


--
-- Name: folder_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX folder_id_idx ON public.folder USING btree (id);


--
-- Name: form_response_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX form_response_id_idx ON public.form_response USING btree (id);


--
-- Name: form_response_response_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX form_response_response_id_idx ON public.form_response USING btree (response_id);


--
-- Name: idx_member_assigned_member_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_member_assigned_member_id ON public.member_assigned USING btree (member_id);


--
-- Name: idx_member_assigned_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_member_assigned_project_id ON public.member_assigned USING btree (project_id);


--
-- Name: idx_subtask_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_subtask_project_id ON public.subtask USING btree (project_id);


--
-- Name: idx_subtask_task_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_subtask_task_id ON public.subtask USING btree (task_id);


--
-- Name: idx_task_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_task_project_id ON public.task USING btree (project_id);


--
-- Name: project_files_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX project_files_id_idx ON public.project_files USING btree (id);


--
-- Name: project_files_project_file_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX project_files_project_file_id_idx ON public.project_files USING btree (project_file_id);


--
-- Name: project_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX project_id_idx ON public.project USING btree (id);


--
-- Name: project_project_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX project_project_id_idx ON public.project USING btree (project_id);


--
-- Name: subtask_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX subtask_id_idx ON public.subtask USING btree (id);


--
-- Name: subtask_subtask_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX subtask_subtask_id_idx ON public.subtask USING btree (subtask_id);


--
-- Name: task_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX task_id_idx ON public.task USING btree (id);


--
-- Name: task_task_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX task_task_id_idx ON public.task USING btree (task_id);


--
-- Name: tasks_files_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tasks_files_id_idx ON public.tasks_files USING btree (id);


--
-- Name: access access_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access
    ADD CONSTRAINT access_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.project(project_id);


--
-- Name: comments comments_link_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_link_id_fkey FOREIGN KEY (link_id) REFERENCES public.task(task_id);


--
-- Name: folder folder_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.folder
    ADD CONSTRAINT folder_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.project(project_id);


--
-- Name: project_files project_files_folder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_files
    ADD CONSTRAINT project_files_folder_id_fkey FOREIGN KEY (folder_id) REFERENCES public.folder(folder_id);


--
-- Name: subtask subtask_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subtask
    ADD CONSTRAINT subtask_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.task(task_id);


--
-- Name: task task_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT task_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.project(project_id);


--
-- Name: tasks_files tasks_files_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks_files
    ADD CONSTRAINT tasks_files_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.task(task_id);


--
-- PostgreSQL database dump complete
--


