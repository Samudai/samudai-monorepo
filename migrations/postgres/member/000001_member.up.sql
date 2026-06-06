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
-- Name: invitestatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.invitestatus AS ENUM (
    'revoked',
    'pending',
    'accepted',
    'rejected'
);


--
-- Name: clan_invites_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.clan_invites_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: clan_invites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clan_invites (
    id bigint DEFAULT nextval('public.clan_invites_seq'::regclass) NOT NULL,
    clan_id uuid,
    sender_id uuid,
    invite_code text,
    receiver_id uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone
);


--
-- Name: COLUMN clan_invites.invite_code; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.clan_invites.invite_code IS 'must be unique';


--
-- Name: clan_member_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.clan_member_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: clan_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clan_members (
    id bigint DEFAULT nextval('public.clan_member_seq'::regclass) NOT NULL,
    clan_id uuid,
    member_id uuid,
    role text,
    notification boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: clan_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.clan_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: clans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clans (
    id bigint DEFAULT nextval('public.clan_seq'::regclass) NOT NULL,
    clan_id uuid DEFAULT public.uuid_generate_v4(),
    name text,
    visibility text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    avatar text,
    created_by uuid
);


--
-- Name: COLUMN clans.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.clans.name IS 'must be unique';


--
-- Name: members_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.members_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.members (
    id bigint DEFAULT nextval('public.members_seq'::regclass) NOT NULL,
    member_id uuid DEFAULT public.uuid_generate_v4(),
    name text,
    phone text,
    email text,
    about text,
    skills text[] DEFAULT '{}'::text[] NOT NULL,
    profile_picture text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    did text NOT NULL,
    username text,
    captain boolean DEFAULT false,
    open_for_opportunity boolean DEFAULT true,
    ceramic_stream text,
    subdomain text,
    invite_code text DEFAULT substr(md5((random())::text), 0, 8),
    present_role text,
    domain_tags_for_work text[] DEFAULT '{}'::text[],
    currency text,
    hourly_rate text,
    overdue_tasks integer DEFAULT 0,
    ongoing_tasks integer DEFAULT 0,
    total_tasks_taken integer DEFAULT 0,
    pending_admin_reviews integer DEFAULT 0,
    closed_task integer DEFAULT 0,
    tags text[] DEFAULT '{}'::text[]
);


--
-- Name: clan_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.clan_view AS
 SELECT clan_id,
    name,
    visibility,
    avatar,
    created_by,
    created_at,
    updated_at,
    COALESCE(( SELECT json_agg(json_build_object('clan_id', cm.clan_id, 'member_id', cm.member_id, 'role', cm.role, 'username', m.username, 'profile_picture', m.profile_picture, 'notification', cm.notification, 'created_at', cm.created_at)) AS json_agg
           FROM (public.clan_members cm
             LEFT JOIN public.members m ON ((m.member_id = cm.member_id)))
          WHERE (cm.clan_id = c.clan_id)), '[]'::json) AS members
   FROM public.clans c;


--
-- Name: connections_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.connections_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: connection_request; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.connection_request (
    id bigint DEFAULT nextval('public.connections_seq'::regclass) NOT NULL,
    sender_id uuid,
    receiver_id uuid,
    status public.invitestatus,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    message text
);


--
-- Name: coposter_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coposter_users (
    coposter_user_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    member_id uuid,
    signer_uuid text,
    fid text,
    is_authenticated boolean DEFAULT false
);


--
-- Name: discord_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.discord_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: discord; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.discord (
    id bigint DEFAULT nextval('public.discord_seq'::regclass) NOT NULL,
    member_id uuid DEFAULT public.uuid_generate_v4(),
    discord_user_id text NOT NULL,
    username text,
    avatar text,
    discriminator text,
    public_flags integer,
    flags integer,
    banner text,
    banner_color text,
    accent_color integer,
    locale text,
    mfa_enabled boolean,
    verified boolean,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    email text
);


--
-- Name: COLUMN discord.discord_user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.discord.discord_user_id IS 'must be unique';


--
-- Name: domain_tags_for_work; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.domain_tags_for_work (
    domain_tags_for_work text
);


--
-- Name: featured_projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.featured_projects (
    id bigint NOT NULL,
    member_id uuid,
    featured_projects jsonb,
    updated_at timestamp without time zone
);


--
-- Name: featured_projects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.featured_projects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: featured_projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.featured_projects_id_seq OWNED BY public.featured_projects.id;


--
-- Name: member_nft_claims; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.member_nft_claims (
    id bigint NOT NULL,
    member_id uuid NOT NULL,
    requested boolean DEFAULT false NOT NULL,
    approved boolean DEFAULT false NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: member_nft_claims_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.member_nft_claims_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: member_nft_claims_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.member_nft_claims_id_seq OWNED BY public.member_nft_claims.id;


--
-- Name: member_subdomains; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.member_subdomains (
    id bigint NOT NULL,
    member_id uuid NOT NULL,
    subdomain_requested text NOT NULL,
    wallet_address text,
    approved boolean DEFAULT false NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: member_subdomains_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.member_subdomains_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: member_subdomains_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.member_subdomains_id_seq OWNED BY public.member_subdomains.id;


--
-- Name: member_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.member_tags (
    tag text
);


--
-- Name: member_wallet_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.member_wallet_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: member_wallet; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.member_wallet (
    id bigint DEFAULT nextval('public.member_wallet_seq'::regclass) NOT NULL,
    member_id uuid DEFAULT public.uuid_generate_v4(),
    wallet_address text NOT NULL,
    "default" boolean DEFAULT false,
    chain_id bigint NOT NULL
);


--
-- Name: onboarding_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.onboarding_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: onboarding; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.onboarding (
    id bigint DEFAULT nextval('public.onboarding_seq'::regclass) NOT NULL,
    member_id uuid,
    admin boolean,
    contributor boolean,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    invite_code text
);


--
-- Name: member_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.member_view AS
 SELECT m.member_id,
    m.name,
    m.username,
    m.phone,
    COALESCE(m.email, d.email, ''::text) AS email,
    m.about,
    m.open_for_opportunity,
    fp.featured_projects,
    m.skills,
    to_json(ARRAY( SELECT json_build_object('wallet_id', mw2.id, 'wallet_address', mw2.wallet_address, 'chain_id', mw2.chain_id, 'default', mw2."default") AS json_build_object
           FROM public.member_wallet mw2
          WHERE (mw2.member_id = m.member_id))) AS wallets,
    json_build_object('discord_user_id', d.discord_user_id, 'username', d.username, 'avatar', d.avatar, 'discriminator', d.discriminator, 'flags', d.flags, 'locale', d.locale, 'verified', d.verified, 'email', d.email) AS discord,
    m.present_role,
    COALESCE(m.domain_tags_for_work, '{}'::text[]) AS domain_tags_for_work,
    m.currency,
    m.hourly_rate,
    m.captain,
    m.did,
    m.created_at,
    m.updated_at,
    m.profile_picture,
    m.ceramic_stream,
    m.subdomain,
    json_build_object('wallet_id', mw.id, 'member_id', mw.member_id, 'wallet_address', mw.wallet_address, 'chain_id', mw.chain_id, 'default', mw."default") AS default_wallet,
    mw.wallet_address AS default_wallet_address,
    m.invite_code,
    COALESCE(( SELECT sum(
                CASE
                    WHEN (o2.admin OR o2.contributor) THEN 1
                    ELSE 0
                END) AS sum
           FROM public.onboarding o2
          WHERE (o2.invite_code = m.invite_code)), (0)::bigint) AS invite_count,
    COALESCE(m.tags, '{}'::text[]) AS tags,
    NULL::json AS dao_worked_with,
    COALESCE(m.overdue_tasks, 0) AS overdue_tasks,
    COALESCE(m.ongoing_tasks, 0) AS ongoing_tasks,
    COALESCE(m.total_tasks_taken, 0) AS total_tasks_taken,
    COALESCE(m.pending_admin_reviews, 0) AS pending_admin_reviews,
    COALESCE(m.closed_task, 0) AS closed_task
   FROM ((((public.members m
     LEFT JOIN public.discord d ON ((d.member_id = m.member_id)))
     LEFT JOIN public.member_wallet mw ON (((mw.member_id = m.member_id) AND (mw."default" = true))))
     LEFT JOIN public.onboarding o ON ((o.member_id = m.member_id)))
     LEFT JOIN public.featured_projects fp ON ((fp.member_id = m.member_id)));


--
-- Name: mobile; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mobile (
    mobile_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    member_id uuid,
    mobile_otp text,
    linked_status boolean DEFAULT false
);


--
-- Name: privy_member; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.privy_member (
    member_id uuid,
    privy_did text,
    privy_email text,
    privy_google jsonb,
    privy_github jsonb
);


--
-- Name: reviews_id; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reviews_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id bigint DEFAULT nextval('public.reviews_id'::regclass) NOT NULL,
    member_id uuid,
    reviewer_id uuid NOT NULL,
    content text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    rating integer
);


--
-- Name: rewards_earned_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rewards_earned_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rewards_earned; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rewards_earned (
    id bigint DEFAULT nextval('public.rewards_earned_seq'::regclass) NOT NULL,
    member_id uuid NOT NULL,
    dao_id uuid NOT NULL,
    amount numeric DEFAULT 0.0 NOT NULL,
    currency text NOT NULL,
    link_id uuid NOT NULL,
    type text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: skills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.skills (
    skill text
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
    member_id uuid,
    type text,
    url text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone
);


--
-- Name: subdomain; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subdomain (
    subdomain_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    member_id uuid NOT NULL,
    subdomain text NOT NULL,
    redirection_link text,
    wallet_address text,
    access boolean DEFAULT false NOT NULL,
    transaction_hash text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: telegram; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.telegram (
    telegram_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    member_id uuid,
    generated_telegram_id text,
    chat_id text,
    username text,
    first_name text,
    last_name text
);


--
-- Name: waitlist; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.waitlist (
    id bigint NOT NULL,
    email text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: waitlist_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.waitlist_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: waitlist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.waitlist_id_seq OWNED BY public.waitlist.id;


--
-- Name: xcaster_casts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.xcaster_casts (
    id bigint NOT NULL,
    member_id uuid,
    casts jsonb
);


--
-- Name: xcaster_casts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.xcaster_casts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: xcaster_casts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.xcaster_casts_id_seq OWNED BY public.xcaster_casts.id;


--
-- Name: xcaster_tweet; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.xcaster_tweet (
    id bigint NOT NULL,
    member_id uuid,
    tweets jsonb
);


--
-- Name: xcaster_tweet_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.xcaster_tweet_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: xcaster_tweet_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.xcaster_tweet_id_seq OWNED BY public.xcaster_tweet.id;


--
-- Name: xcaster_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.xcaster_users (
    id bigint NOT NULL,
    member_id uuid,
    connected_acc boolean DEFAULT false,
    x_username text,
    warpcast_username text
);


--
-- Name: xcaster_users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.xcaster_users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: xcaster_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.xcaster_users_id_seq OWNED BY public.xcaster_users.id;


--
-- Name: featured_projects id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.featured_projects ALTER COLUMN id SET DEFAULT nextval('public.featured_projects_id_seq'::regclass);


--
-- Name: member_nft_claims id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_nft_claims ALTER COLUMN id SET DEFAULT nextval('public.member_nft_claims_id_seq'::regclass);


--
-- Name: member_subdomains id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_subdomains ALTER COLUMN id SET DEFAULT nextval('public.member_subdomains_id_seq'::regclass);


--
-- Name: waitlist id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.waitlist ALTER COLUMN id SET DEFAULT nextval('public.waitlist_id_seq'::regclass);


--
-- Name: xcaster_casts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.xcaster_casts ALTER COLUMN id SET DEFAULT nextval('public.xcaster_casts_id_seq'::regclass);


--
-- Name: xcaster_tweet id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.xcaster_tweet ALTER COLUMN id SET DEFAULT nextval('public.xcaster_tweet_id_seq'::regclass);


--
-- Name: xcaster_users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.xcaster_users ALTER COLUMN id SET DEFAULT nextval('public.xcaster_users_id_seq'::regclass);


--
-- Name: clan_invites clan_invites_invite_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clan_invites
    ADD CONSTRAINT clan_invites_invite_code_key UNIQUE (invite_code);


--
-- Name: clan_invites clan_invites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clan_invites
    ADD CONSTRAINT clan_invites_pkey PRIMARY KEY (id);


--
-- Name: clan_members clan_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clan_members
    ADD CONSTRAINT clan_members_pkey PRIMARY KEY (id);


--
-- Name: clans clans_clan_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clans
    ADD CONSTRAINT clans_clan_id_key UNIQUE (clan_id);


--
-- Name: clans clans_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clans
    ADD CONSTRAINT clans_name_key UNIQUE (name);


--
-- Name: clans clans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clans
    ADD CONSTRAINT clans_pkey PRIMARY KEY (id);


--
-- Name: connection_request connection_request_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.connection_request
    ADD CONSTRAINT connection_request_pkey PRIMARY KEY (id);


--
-- Name: coposter_users coposter_users_member_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coposter_users
    ADD CONSTRAINT coposter_users_member_id_key UNIQUE (member_id);


--
-- Name: coposter_users coposter_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coposter_users
    ADD CONSTRAINT coposter_users_pkey PRIMARY KEY (coposter_user_id);


--
-- Name: discord discord_discord_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discord
    ADD CONSTRAINT discord_discord_user_id_key UNIQUE (discord_user_id);


--
-- Name: discord discord_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discord
    ADD CONSTRAINT discord_email_key UNIQUE (email);


--
-- Name: discord discord_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discord
    ADD CONSTRAINT discord_pkey PRIMARY KEY (id);


--
-- Name: featured_projects featured_projects_member_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.featured_projects
    ADD CONSTRAINT featured_projects_member_id_key UNIQUE (member_id);


--
-- Name: featured_projects featured_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.featured_projects
    ADD CONSTRAINT featured_projects_pkey PRIMARY KEY (id);


--
-- Name: member_nft_claims member_nft_claims_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_nft_claims
    ADD CONSTRAINT member_nft_claims_pkey PRIMARY KEY (id);


--
-- Name: member_subdomains member_subdomains_member_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_subdomains
    ADD CONSTRAINT member_subdomains_member_id_key UNIQUE (member_id);


--
-- Name: member_subdomains member_subdomains_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_subdomains
    ADD CONSTRAINT member_subdomains_pkey PRIMARY KEY (id);


--
-- Name: member_wallet member_wallet_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_wallet
    ADD CONSTRAINT member_wallet_pkey PRIMARY KEY (id);


--
-- Name: member_wallet member_wallet_wallet_address_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_wallet
    ADD CONSTRAINT member_wallet_wallet_address_key UNIQUE (wallet_address);


--
-- Name: members members_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_email_key UNIQUE (email);


--
-- Name: members members_invite_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_invite_code_key UNIQUE (invite_code);


--
-- Name: members members_member_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_member_id_key UNIQUE (member_id);


--
-- Name: members members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_pkey PRIMARY KEY (id);


--
-- Name: members members_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_username_key UNIQUE (username);


--
-- Name: mobile mobile_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mobile
    ADD CONSTRAINT mobile_pkey PRIMARY KEY (mobile_id);


--
-- Name: onboarding onboarding_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.onboarding
    ADD CONSTRAINT onboarding_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: rewards_earned rewards_earned_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rewards_earned
    ADD CONSTRAINT rewards_earned_pkey PRIMARY KEY (id);


--
-- Name: social social_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.social
    ADD CONSTRAINT social_pkey PRIMARY KEY (id);


--
-- Name: subdomain subdomain_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subdomain
    ADD CONSTRAINT subdomain_pkey PRIMARY KEY (subdomain_id);


--
-- Name: telegram telegram_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.telegram
    ADD CONSTRAINT telegram_pkey PRIMARY KEY (telegram_id);


--
-- Name: waitlist waitlist_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.waitlist
    ADD CONSTRAINT waitlist_pkey PRIMARY KEY (id);


--
-- Name: xcaster_casts xcaster_casts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.xcaster_casts
    ADD CONSTRAINT xcaster_casts_pkey PRIMARY KEY (id);


--
-- Name: xcaster_tweet xcaster_tweet_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.xcaster_tweet
    ADD CONSTRAINT xcaster_tweet_pkey PRIMARY KEY (id);


--
-- Name: xcaster_users xcaster_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.xcaster_users
    ADD CONSTRAINT xcaster_users_pkey PRIMARY KEY (id);


--
-- Name: clan_invites_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX clan_invites_id_idx ON public.clan_invites USING btree (id);


--
-- Name: clan_invites_invite_code_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX clan_invites_invite_code_idx ON public.clan_invites USING btree (invite_code);


--
-- Name: clan_members_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX clan_members_id_idx ON public.clan_members USING btree (id);


--
-- Name: clans_clan_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX clans_clan_id_idx ON public.clans USING btree (clan_id);


--
-- Name: clans_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX clans_id_idx ON public.clans USING btree (id);


--
-- Name: clans_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX clans_name_idx ON public.clans USING btree (name);


--
-- Name: connection_request_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX connection_request_id_idx ON public.connection_request USING btree (id);


--
-- Name: discord_discord_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX discord_discord_user_id_idx ON public.discord USING btree (discord_user_id);


--
-- Name: discord_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX discord_email_idx ON public.discord USING btree (email);


--
-- Name: discord_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX discord_id_idx ON public.discord USING btree (id);


--
-- Name: member_nft_claims_member_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX member_nft_claims_member_id_idx ON public.member_nft_claims USING btree (member_id);


--
-- Name: member_subdomains_member_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX member_subdomains_member_id_idx ON public.member_subdomains USING btree (member_id);


--
-- Name: member_wallet_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX member_wallet_id_idx ON public.member_wallet USING btree (id);


--
-- Name: member_wallet_wallet_address_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX member_wallet_wallet_address_idx ON public.member_wallet USING btree (wallet_address);


--
-- Name: members_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX members_email_idx ON public.members USING btree (email);


--
-- Name: members_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX members_id_idx ON public.members USING btree (id);


--
-- Name: members_invite_code_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX members_invite_code_idx ON public.members USING btree (invite_code);


--
-- Name: members_member_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX members_member_id_idx ON public.members USING btree (member_id);


--
-- Name: members_username_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX members_username_idx ON public.members USING btree (username);


--
-- Name: mobile_member_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mobile_member_id_idx ON public.mobile USING btree (member_id);


--
-- Name: mobile_mobile_otp_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mobile_mobile_otp_idx ON public.mobile USING btree (mobile_otp);


--
-- Name: onboarding_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX onboarding_id_idx ON public.onboarding USING btree (id);


--
-- Name: onboarding_invite_code_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX onboarding_invite_code_idx ON public.onboarding USING btree (invite_code);


--
-- Name: privy_member_member_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX privy_member_member_id_idx ON public.privy_member USING btree (member_id);


--
-- Name: reviews_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX reviews_id_idx ON public.reviews USING btree (id);


--
-- Name: rewards_earned_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX rewards_earned_id_idx ON public.rewards_earned USING btree (id);


--
-- Name: social_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX social_id_idx ON public.social USING btree (id);


--
-- Name: subdomain_member_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX subdomain_member_id_idx ON public.subdomain USING btree (member_id);


--
-- Name: subdomain_subdomain_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX subdomain_subdomain_idx ON public.subdomain USING btree (subdomain);


--
-- Name: telegram_member_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX telegram_member_id_idx ON public.telegram USING btree (member_id);


--
-- Name: xcaster_casts_member_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX xcaster_casts_member_id_idx ON public.xcaster_casts USING btree (member_id);


--
-- Name: xcaster_tweet_member_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX xcaster_tweet_member_id_idx ON public.xcaster_tweet USING btree (member_id);


--
-- Name: xcaster_users_member_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX xcaster_users_member_id_idx ON public.xcaster_users USING btree (member_id);


--
-- Name: clan_invites clan_invites_clan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clan_invites
    ADD CONSTRAINT clan_invites_clan_id_fkey FOREIGN KEY (clan_id) REFERENCES public.clans(clan_id);


--
-- Name: clan_invites clan_invites_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clan_invites
    ADD CONSTRAINT clan_invites_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.members(member_id);


--
-- Name: clan_invites clan_invites_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clan_invites
    ADD CONSTRAINT clan_invites_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.members(member_id);


--
-- Name: clan_members clan_members_clan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clan_members
    ADD CONSTRAINT clan_members_clan_id_fkey FOREIGN KEY (clan_id) REFERENCES public.clans(clan_id);


--
-- Name: clan_members clan_members_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clan_members
    ADD CONSTRAINT clan_members_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(member_id);


--
-- Name: clans clans_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clans
    ADD CONSTRAINT clans_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.members(member_id);


--
-- Name: connection_request connection_request_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.connection_request
    ADD CONSTRAINT connection_request_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.members(member_id);


--
-- Name: connection_request connection_request_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.connection_request
    ADD CONSTRAINT connection_request_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.members(member_id);


--
-- Name: coposter_users coposter_users_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coposter_users
    ADD CONSTRAINT coposter_users_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(member_id) ON DELETE CASCADE;


--
-- Name: discord discord_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discord
    ADD CONSTRAINT discord_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(member_id);


--
-- Name: featured_projects featured_projects_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.featured_projects
    ADD CONSTRAINT featured_projects_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(member_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: member_nft_claims member_nft_claims_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_nft_claims
    ADD CONSTRAINT member_nft_claims_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(member_id) ON DELETE CASCADE;


--
-- Name: member_subdomains member_subdomains_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_subdomains
    ADD CONSTRAINT member_subdomains_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(member_id) ON DELETE CASCADE;


--
-- Name: member_wallet member_wallet_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_wallet
    ADD CONSTRAINT member_wallet_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(member_id);


--
-- Name: mobile mobile_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mobile
    ADD CONSTRAINT mobile_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(member_id) ON DELETE CASCADE;


--
-- Name: onboarding onboarding_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.onboarding
    ADD CONSTRAINT onboarding_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(member_id);


--
-- Name: privy_member privy_member_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.privy_member
    ADD CONSTRAINT privy_member_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(member_id) ON DELETE CASCADE;


--
-- Name: reviews reviews_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(member_id);


--
-- Name: reviews reviews_reviewer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.members(member_id);


--
-- Name: rewards_earned rewards_earned_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rewards_earned
    ADD CONSTRAINT rewards_earned_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(member_id);


--
-- Name: social social_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.social
    ADD CONSTRAINT social_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(member_id);


--
-- Name: subdomain subdomain_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subdomain
    ADD CONSTRAINT subdomain_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(member_id) ON DELETE CASCADE;


--
-- Name: telegram telegram_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.telegram
    ADD CONSTRAINT telegram_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(member_id) ON DELETE CASCADE;


--
-- Name: xcaster_casts xcaster_casts_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.xcaster_casts
    ADD CONSTRAINT xcaster_casts_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(member_id) ON DELETE CASCADE;


--
-- Name: xcaster_tweet xcaster_tweet_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.xcaster_tweet
    ADD CONSTRAINT xcaster_tweet_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(member_id) ON DELETE CASCADE;


--
-- Name: xcaster_users xcaster_users_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.xcaster_users
    ADD CONSTRAINT xcaster_users_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(member_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


