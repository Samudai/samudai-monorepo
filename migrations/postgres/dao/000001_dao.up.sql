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
    'manage_project',
    'manage_dao',
    'manage_payment',
    'manage_job',
    'manage_forum'
);


--
-- Name: invitestatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.invitestatus AS ENUM (
    'pending',
    'accepted',
    'rejected'
);


--
-- Name: member_stub(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.member_stub(mid text) RETURNS json
    LANGUAGE sql IMMUTABLE
    AS $$
  SELECT json_build_object(
    'member_id',       COALESCE(mid, ''),
    'username',        '',
    'name',            '',
    'profile_picture', ''
  )
$$;


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
    dao_id uuid,
    access public.accesstype,
    roles uuid[] DEFAULT '{}'::uuid[],
    members uuid[] DEFAULT '{}'::uuid[],
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone
);


--
-- Name: analytics_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.analytics_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: analytics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analytics (
    id bigint DEFAULT nextval('public.analytics_seq'::regclass) NOT NULL,
    dao_id uuid,
    member_id uuid,
    "time" timestamp without time zone DEFAULT now() NOT NULL,
    visitor_ip text
);


--
-- Name: blogs_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blogs_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blogs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blogs (
    id bigint DEFAULT nextval('public.blogs_seq'::regclass) NOT NULL,
    dao_id uuid,
    link text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    metadata json
);


--
-- Name: collaboration_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.collaboration_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: collaboration; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.collaboration (
    id bigint DEFAULT nextval('public.collaboration_seq'::regclass) NOT NULL,
    collaboration_id uuid DEFAULT public.uuid_generate_v4(),
    applying_member_id uuid NOT NULL,
    from_dao_id uuid,
    to_dao_id uuid,
    status text,
    title text,
    department uuid,
    description text,
    requirements text[] DEFAULT '{}'::text[],
    benefits text,
    attachment text,
    replying_member_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    scope text
);


--
-- Name: collaboration_pass; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.collaboration_pass (
    collaboration_pass_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    dao_id uuid,
    claimed boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone
);


--
-- Name: collaboration_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.collaboration_view AS
 SELECT collaboration_id,
    public.member_stub((applying_member_id)::text) AS applying_member,
    from_dao_id,
    to_dao_id,
    status,
    title,
    department,
    description,
    requirements,
    benefits,
    attachment,
    scope,
    public.member_stub((replying_member_id)::text) AS replying_member,
    created_at,
    updated_at
   FROM public.collaboration c;


--
-- Name: dao_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dao_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dao; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dao (
    id bigint DEFAULT nextval('public.dao_id_seq'::regclass) NOT NULL,
    dao_id uuid DEFAULT public.uuid_generate_v4(),
    name text,
    guild_id text,
    about text,
    profile_picture text,
    contract_address text,
    snapshot text,
    owner_id uuid DEFAULT public.uuid_nil(),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    onboarding boolean DEFAULT false,
    dao_type text DEFAULT 'general'::text,
    token_gating boolean DEFAULT false,
    tags text[] DEFAULT '{}'::text[],
    open_to_collaboration boolean DEFAULT false,
    poc_member_id uuid,
    join_dao_link text,
    is_trial boolean DEFAULT false NOT NULL
);


--
-- Name: dao_invites_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dao_invites_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dao_invites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dao_invites (
    id bigint DEFAULT nextval('public.dao_invites_seq'::regclass) NOT NULL,
    dao_id uuid,
    sender_id uuid,
    invite_code text,
    receiver_id uuid,
    status public.invitestatus,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone
);


--
-- Name: dao_member_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dao_member_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dao_partner_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dao_partner_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dao_partner; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dao_partner (
    id bigint DEFAULT nextval('public.dao_partner_seq'::regclass) NOT NULL,
    dao_partner_id uuid DEFAULT public.uuid_generate_v4(),
    name text,
    logo text,
    website text,
    email text,
    phone text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    dao_id uuid
);


--
-- Name: dao_role_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dao_role_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dao_subdomains; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dao_subdomains (
    id bigint NOT NULL,
    dao_id uuid NOT NULL,
    subdomain_claimed text,
    provider_address text,
    approved boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone
);


--
-- Name: dao_subdomains_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dao_subdomains_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dao_subdomains_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dao_subdomains_id_seq OWNED BY public.dao_subdomains.id;


--
-- Name: dao_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dao_tags (
    tag text
);


--
-- Name: department_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.department_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: department; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.department (
    id bigint DEFAULT nextval('public.department_seq'::regclass) NOT NULL,
    department_id uuid DEFAULT public.uuid_generate_v4(),
    name text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    dao_id uuid
);


--
-- Name: members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.members (
    id bigint DEFAULT nextval('public.dao_member_seq'::regclass) NOT NULL,
    member_id uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    dao_id uuid,
    licensed_member boolean DEFAULT false
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id bigint DEFAULT nextval('public.dao_role_seq'::regclass) NOT NULL,
    role_id uuid DEFAULT public.uuid_generate_v4(),
    name text,
    discord_role_id text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    dao_id uuid,
    updated_at timestamp without time zone
);


--
-- Name: social_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.social_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: social; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.social (
    id bigint DEFAULT nextval('public.social_seq'::regclass) NOT NULL,
    type text,
    url text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    dao_id uuid,
    updated_at timestamp without time zone
);


--
-- Name: stripe_subscription; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stripe_subscription (
    subscription_id text NOT NULL,
    dao_id uuid,
    member_id uuid,
    customer_id text,
    invoice_ids text[],
    subscription_status text,
    quantity integer,
    current_period_end timestamp without time zone,
    current_period_start timestamp without time zone,
    plan json,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: token_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.token_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: token; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.token (
    id bigint DEFAULT nextval('public.token_seq'::regclass) NOT NULL,
    ticker text,
    contract_address text,
    average_time_held text,
    holders integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    dao_id uuid,
    updated_at timestamp without time zone
);


--
-- Name: dao_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.dao_view AS
 SELECT dao_id,
    name,
    about,
    guild_id,
    profile_picture,
    contract_address,
    snapshot,
    owner_id,
    created_at,
    updated_at,
    onboarding,
    token_gating,
    dao_type,
    COALESCE(tags, '{}'::text[]) AS tags,
    COALESCE(open_to_collaboration, false) AS open_to_collaboration,
    join_dao_link,
    is_trial,
    to_json(ARRAY( SELECT json_build_object('role_id', r.role_id, 'name', r.name) AS json_build_object
           FROM public.roles r
          WHERE (r.dao_id = d.dao_id))) AS roles,
    to_json(ARRAY( SELECT json_build_object('department_id', dep.department_id, 'name', dep.name) AS json_build_object
           FROM public.department dep
          WHERE (dep.dao_id = d.dao_id))) AS departments,
    to_json(ARRAY( SELECT json_build_object('id', s.id, 'type', s.type, 'url', s.url) AS json_build_object
           FROM public.social s
          WHERE (s.dao_id = d.dao_id))) AS socials,
    to_json(ARRAY( SELECT json_build_object('id', t.id, 'ticker', t.ticker, 'contract_address', t.contract_address, 'average_time_held', t.average_time_held, 'holders', t.holders) AS json_build_object
           FROM public.token t
          WHERE (t.dao_id = d.dao_id))) AS tokens,
    COALESCE(to_json(ARRAY( SELECT public.member_stub((m.member_id)::text) AS member_stub
           FROM public.members m
          WHERE (m.dao_id = d.dao_id))), '[]'::json) AS members,
    (( SELECT count(*) AS count
           FROM public.members m
          WHERE (m.dao_id = d.dao_id)))::integer AS members_count,
    '{}'::text[] AS members_profile_pictures,
    public.member_stub((poc_member_id)::text) AS poc_member,
    ( SELECT json_build_object('collaboration_pass_id', (cp.collaboration_pass_id)::text, 'claimed', cp.claimed) AS json_build_object
           FROM public.collaboration_pass cp
          WHERE (cp.dao_id = d.dao_id)
         LIMIT 1) AS collaboration_pass,
    COALESCE(to_json(ARRAY( SELECT json_build_object('collaboration_id', (c.collaboration_id)::text, 'dao_id',
                CASE
                    WHEN (c.from_dao_id = d.dao_id) THEN c.to_dao_id
                    ELSE c.from_dao_id
                END, 'name', partner.name, 'profile_picture', partner.profile_picture) AS json_build_object
           FROM (public.collaboration c
             JOIN public.dao partner ON ((partner.dao_id =
                CASE
                    WHEN (c.from_dao_id = d.dao_id) THEN c.to_dao_id
                    ELSE c.from_dao_id
                END)))
          WHERE (((c.from_dao_id = d.dao_id) OR (c.to_dao_id = d.dao_id)) AND (c.status = 'accepted'::text)))), '[]'::json) AS collaborations,
    ( SELECT json_build_object('subscription_status', ss.subscription_status, 'quantity', ss.quantity, 'current_plan', ss.plan, 'interval', json_build_object('currency', NULL::unknown, 'interval', NULL::unknown, 'interval_count', 0)) AS json_build_object
           FROM public.stripe_subscription ss
          WHERE (ss.dao_id = d.dao_id)
         LIMIT 1) AS subscription,
    (( SELECT count(*) AS count
           FROM public.stripe_subscription ss
          WHERE (ss.dao_id = d.dao_id)))::integer AS subscription_count
   FROM public.dao d;


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
-- Name: favourite; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.favourite (
    id bigint DEFAULT nextval('public.favourite_seq'::regclass) NOT NULL,
    member_id uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    dao_id uuid
);


--
-- Name: member_role_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.member_role_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: member_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.member_roles (
    id bigint DEFAULT nextval('public.member_role_seq'::regclass) NOT NULL,
    member_id uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    role_id uuid,
    dao_id uuid
);


--
-- Name: members_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.members_view AS
 SELECT m.member_id,
    d.dao_id,
    d.name,
    d.about,
    d.guild_id,
    d.profile_picture,
    d.owner_id,
    to_json(ARRAY( SELECT json_build_object('dao_id', dr.dao_id, 'role_id', dr.role_id, 'name', dr.name, 'discord_role_id', dr.discord_role_id) AS json_build_object
           FROM (public.roles dr
             JOIN public.member_roles mr ON ((dr.role_id = mr.role_id)))
          WHERE ((mr.member_id = m.member_id) AND (mr.dao_id = d.dao_id)))) AS roles,
    ARRAY( SELECT DISTINCT a.access
           FROM public.access a
          WHERE ((a.dao_id = d.dao_id) AND ((m.member_id = ANY (a.members)) OR (EXISTS ( SELECT 1
                   FROM public.member_roles mr
                  WHERE ((mr.member_id = m.member_id) AND (mr.dao_id = d.dao_id) AND (mr.role_id = ANY (a.roles)))))))) AS access,
    d.created_at AS dao_created,
    d.updated_at AS dao_updated,
    d.onboarding,
    d.snapshot,
    d.dao_type,
    m.created_at AS member_joined,
    d.token_gating,
    COALESCE(d.tags, '{}'::text[]) AS tags,
    COALESCE(d.open_to_collaboration, false) AS open_to_collaboration
   FROM (public.members m
     JOIN public.dao d ON ((d.dao_id = m.dao_id)));


--
-- Name: partner_social_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.partner_social_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: partner_social; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partner_social (
    id bigint DEFAULT nextval('public.partner_social_seq'::regclass) NOT NULL,
    type text,
    url text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    dao_partner_id uuid,
    updated_at timestamp without time zone
);


--
-- Name: provider_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.provider_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: provider; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.provider (
    id bigint DEFAULT nextval('public.provider_seq'::regclass) NOT NULL,
    provider_type text,
    address text,
    created_by uuid,
    chain_id integer,
    is_default boolean,
    name text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    dao_id uuid,
    updated_at timestamp without time zone,
    provider_id uuid DEFAULT public.uuid_generate_v4()
);


--
-- Name: COLUMN provider.provider_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.provider.provider_type IS 'enum - gnosis, wallet, parcel';


--
-- Name: reviews_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reviews_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id bigint DEFAULT nextval('public.reviews_seq'::regclass) NOT NULL,
    member_id uuid NOT NULL,
    content text,
    rating integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    dao_id uuid
);


--
-- Name: stripe_customer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stripe_customer (
    customer_id text NOT NULL,
    name text,
    email text,
    address json,
    phone text
);


--
-- Name: subdomain; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subdomain (
    subdomain_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    dao_id uuid,
    subdomain text,
    redirection_link text,
    wallet_address text,
    access boolean DEFAULT false,
    transaction_hash text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone
);


--
-- Name: dao_subdomains id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dao_subdomains ALTER COLUMN id SET DEFAULT nextval('public.dao_subdomains_id_seq'::regclass);


--
-- Name: access access_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access
    ADD CONSTRAINT access_pkey PRIMARY KEY (id);


--
-- Name: analytics analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics
    ADD CONSTRAINT analytics_pkey PRIMARY KEY (id);


--
-- Name: blogs blogs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT blogs_pkey PRIMARY KEY (id);


--
-- Name: collaboration collaboration_collaboration_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collaboration
    ADD CONSTRAINT collaboration_collaboration_id_key UNIQUE (collaboration_id);


--
-- Name: collaboration_pass collaboration_pass_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collaboration_pass
    ADD CONSTRAINT collaboration_pass_pkey PRIMARY KEY (collaboration_pass_id);


--
-- Name: collaboration collaboration_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collaboration
    ADD CONSTRAINT collaboration_pkey PRIMARY KEY (id);


--
-- Name: dao dao_dao_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dao
    ADD CONSTRAINT dao_dao_id_key UNIQUE (dao_id);


--
-- Name: dao_invites dao_invites_invite_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dao_invites
    ADD CONSTRAINT dao_invites_invite_code_key UNIQUE (invite_code);


--
-- Name: dao_invites dao_invites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dao_invites
    ADD CONSTRAINT dao_invites_pkey PRIMARY KEY (id);


--
-- Name: dao_partner dao_partner_dao_partner_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dao_partner
    ADD CONSTRAINT dao_partner_dao_partner_id_key UNIQUE (dao_partner_id);


--
-- Name: dao_partner dao_partner_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dao_partner
    ADD CONSTRAINT dao_partner_pkey PRIMARY KEY (id);


--
-- Name: dao dao_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dao
    ADD CONSTRAINT dao_pkey PRIMARY KEY (id);


--
-- Name: dao_subdomains dao_subdomains_dao_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dao_subdomains
    ADD CONSTRAINT dao_subdomains_dao_id_key UNIQUE (dao_id);


--
-- Name: dao_subdomains dao_subdomains_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dao_subdomains
    ADD CONSTRAINT dao_subdomains_pkey PRIMARY KEY (id);


--
-- Name: department department_department_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department
    ADD CONSTRAINT department_department_id_key UNIQUE (department_id);


--
-- Name: department department_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department
    ADD CONSTRAINT department_pkey PRIMARY KEY (id);


--
-- Name: favourite favourite_dao_id_member_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favourite
    ADD CONSTRAINT favourite_dao_id_member_id_key UNIQUE (dao_id, member_id);


--
-- Name: favourite favourite_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favourite
    ADD CONSTRAINT favourite_pkey PRIMARY KEY (id);


--
-- Name: member_roles member_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_roles
    ADD CONSTRAINT member_roles_pkey PRIMARY KEY (id);


--
-- Name: members members_dao_id_member_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_dao_id_member_id_key UNIQUE (dao_id, member_id);


--
-- Name: members members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_pkey PRIMARY KEY (id);


--
-- Name: partner_social partner_social_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partner_social
    ADD CONSTRAINT partner_social_pkey PRIMARY KEY (id);


--
-- Name: provider provider_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provider
    ADD CONSTRAINT provider_pkey PRIMARY KEY (id);


--
-- Name: provider provider_provider_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provider
    ADD CONSTRAINT provider_provider_id_key UNIQUE (provider_id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: roles roles_role_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_id_key UNIQUE (role_id);


--
-- Name: social social_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.social
    ADD CONSTRAINT social_pkey PRIMARY KEY (id);


--
-- Name: stripe_customer stripe_customer_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stripe_customer
    ADD CONSTRAINT stripe_customer_pkey PRIMARY KEY (customer_id);


--
-- Name: stripe_subscription stripe_subscription_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stripe_subscription
    ADD CONSTRAINT stripe_subscription_pkey PRIMARY KEY (subscription_id);


--
-- Name: subdomain subdomain_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subdomain
    ADD CONSTRAINT subdomain_pkey PRIMARY KEY (subdomain_id);


--
-- Name: token token_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_pkey PRIMARY KEY (id);


--
-- Name: access_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX access_id_idx ON public.access USING btree (id);


--
-- Name: analytics_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX analytics_id_idx ON public.analytics USING btree (id);


--
-- Name: blogs_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blogs_id_idx ON public.blogs USING btree (id);


--
-- Name: collaboration_collaboration_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX collaboration_collaboration_id_idx ON public.collaboration USING btree (collaboration_id);


--
-- Name: collaboration_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX collaboration_id_idx ON public.collaboration USING btree (id);


--
-- Name: dao_dao_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dao_dao_id_idx ON public.dao USING btree (dao_id);


--
-- Name: dao_guild_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dao_guild_id_idx ON public.dao USING btree (guild_id);


--
-- Name: dao_guild_id_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX dao_guild_id_unique ON public.dao USING btree (guild_id) WHERE ((guild_id IS NOT NULL) AND (guild_id <> ''::text));


--
-- Name: dao_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dao_id_idx ON public.dao USING btree (id);


--
-- Name: dao_invites_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dao_invites_id_idx ON public.dao_invites USING btree (id);


--
-- Name: dao_invites_invite_code_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dao_invites_invite_code_idx ON public.dao_invites USING btree (invite_code);


--
-- Name: dao_is_trial_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX dao_is_trial_unique ON public.dao USING btree (is_trial) WHERE (is_trial = true);


--
-- Name: dao_partner_dao_partner_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dao_partner_dao_partner_id_idx ON public.dao_partner USING btree (dao_partner_id);


--
-- Name: dao_partner_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dao_partner_id_idx ON public.dao_partner USING btree (id);


--
-- Name: department_department_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX department_department_id_idx ON public.department USING btree (department_id);


--
-- Name: department_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX department_id_idx ON public.department USING btree (id);


--
-- Name: favourite_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX favourite_id_idx ON public.favourite USING btree (id);


--
-- Name: member_roles_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX member_roles_id_idx ON public.member_roles USING btree (id);


--
-- Name: members_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX members_id_idx ON public.members USING btree (id);


--
-- Name: partner_social_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partner_social_id_idx ON public.partner_social USING btree (id);


--
-- Name: provider_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX provider_id_idx ON public.provider USING btree (id);


--
-- Name: reviews_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX reviews_id_idx ON public.reviews USING btree (id);


--
-- Name: roles_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX roles_id_idx ON public.roles USING btree (id);


--
-- Name: roles_role_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX roles_role_id_idx ON public.roles USING btree (role_id);


--
-- Name: social_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX social_id_idx ON public.social USING btree (id);


--
-- Name: token_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX token_id_idx ON public.token USING btree (id);


--
-- Name: access access_dao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access
    ADD CONSTRAINT access_dao_id_fkey FOREIGN KEY (dao_id) REFERENCES public.dao(dao_id);


--
-- Name: blogs blogs_dao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT blogs_dao_id_fkey FOREIGN KEY (dao_id) REFERENCES public.dao(dao_id);


--
-- Name: collaboration collaboration_department_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collaboration
    ADD CONSTRAINT collaboration_department_fkey FOREIGN KEY (department) REFERENCES public.department(department_id);


--
-- Name: collaboration collaboration_from_dao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collaboration
    ADD CONSTRAINT collaboration_from_dao_id_fkey FOREIGN KEY (from_dao_id) REFERENCES public.dao(dao_id);


--
-- Name: collaboration_pass collaboration_pass_dao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collaboration_pass
    ADD CONSTRAINT collaboration_pass_dao_id_fkey FOREIGN KEY (dao_id) REFERENCES public.dao(dao_id);


--
-- Name: collaboration collaboration_to_dao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collaboration
    ADD CONSTRAINT collaboration_to_dao_id_fkey FOREIGN KEY (to_dao_id) REFERENCES public.dao(dao_id);


--
-- Name: dao_invites dao_invites_dao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dao_invites
    ADD CONSTRAINT dao_invites_dao_id_fkey FOREIGN KEY (dao_id) REFERENCES public.dao(dao_id);


--
-- Name: dao_partner dao_partner_dao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dao_partner
    ADD CONSTRAINT dao_partner_dao_id_fkey FOREIGN KEY (dao_id) REFERENCES public.dao(dao_id);


--
-- Name: department department_dao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department
    ADD CONSTRAINT department_dao_id_fkey FOREIGN KEY (dao_id) REFERENCES public.dao(dao_id);


--
-- Name: favourite favourite_dao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favourite
    ADD CONSTRAINT favourite_dao_id_fkey FOREIGN KEY (dao_id) REFERENCES public.dao(dao_id);


--
-- Name: member_roles member_roles_dao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_roles
    ADD CONSTRAINT member_roles_dao_id_fkey FOREIGN KEY (dao_id) REFERENCES public.dao(dao_id);


--
-- Name: member_roles member_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_roles
    ADD CONSTRAINT member_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(role_id);


--
-- Name: members members_dao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_dao_id_fkey FOREIGN KEY (dao_id) REFERENCES public.dao(dao_id);


--
-- Name: partner_social partner_social_dao_partner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partner_social
    ADD CONSTRAINT partner_social_dao_partner_id_fkey FOREIGN KEY (dao_partner_id) REFERENCES public.dao_partner(dao_partner_id);


--
-- Name: provider provider_dao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provider
    ADD CONSTRAINT provider_dao_id_fkey FOREIGN KEY (dao_id) REFERENCES public.dao(dao_id);


--
-- Name: reviews reviews_dao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_dao_id_fkey FOREIGN KEY (dao_id) REFERENCES public.dao(dao_id);


--
-- Name: roles roles_dao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_dao_id_fkey FOREIGN KEY (dao_id) REFERENCES public.dao(dao_id);


--
-- Name: social social_dao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.social
    ADD CONSTRAINT social_dao_id_fkey FOREIGN KEY (dao_id) REFERENCES public.dao(dao_id);


--
-- Name: token token_dao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_dao_id_fkey FOREIGN KEY (dao_id) REFERENCES public.dao(dao_id);


--
-- PostgreSQL database dump complete
--



-- Seed known trial DAO IDs per environment (only one will exist in each DB).
-- No-op on a fresh database; preserved from the original 000007 migration.
UPDATE public.dao SET is_trial = true WHERE dao_id IN (
    'e27c7209-b5ba-4f5f-856f-dd2cb05453c0',
    'dd304ed6-f758-4dec-8413-3d972eb08a39'
);
