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
-- Name: member_stub(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.member_stub(mid text) RETURNS json
    LANGUAGE sql IMMUTABLE
    AS $$
  SELECT json_build_object('member_id', COALESCE(mid, ''), 'username', '', 'name', '', 'profile_picture', '')
$$;


--
-- Name: discussion_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.discussion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: discussion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.discussion (
    id bigint DEFAULT nextval('public.discussion_seq'::regclass) NOT NULL,
    discussion_id uuid DEFAULT public.uuid_generate_v4(),
    dao_id uuid,
    topic text,
    description text,
    created_by uuid,
    updated_by uuid,
    category text,
    category_id uuid,
    closed boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    closed_on timestamp without time zone,
    proposal_id text,
    description_raw text,
    tags text[] DEFAULT '{}'::text[],
    pinned boolean DEFAULT false,
    visibility text DEFAULT 'public'::text,
    last_comment_at timestamp without time zone,
    views integer DEFAULT 0
);


--
-- Name: message_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.message_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: message; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.message (
    id bigint DEFAULT nextval('public.message_seq'::regclass) NOT NULL,
    discussion_id uuid,
    message_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    type text,
    content text,
    sender_id uuid NOT NULL,
    attachment_link text,
    metadata json DEFAULT '{}'::json,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    parent_id uuid,
    edited boolean DEFAULT false,
    all_tagged boolean DEFAULT false,
    tagged text[] DEFAULT '{}'::text[]
);


--
-- Name: participant_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.participant_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: participant; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.participant (
    id bigint DEFAULT nextval('public.participant_seq'::regclass) NOT NULL,
    discussion_id uuid,
    member_id uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: discussion_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.discussion_view AS
 SELECT d.discussion_id,
    d.dao_id,
    d.topic,
    d.description,
    public.member_stub((d.created_by)::text) AS created_by,
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
   FROM ((public.discussion d
     LEFT JOIN LATERAL ( SELECT (count(*))::integer AS cnt,
            COALESCE(json_agg(public.member_stub((p.member_id)::text)), '[]'::json) AS arr
           FROM public.participant p
          WHERE (p.discussion_id = d.discussion_id)) pcte ON (true))
     LEFT JOIN LATERAL ( SELECT (count(*))::integer AS cnt,
            COALESCE(json_agg(json_build_object('message_id', m.message_id, 'discussion_id', m.discussion_id, 'type', m.type, 'content', m.content, 'sender_id', m.sender_id, 'attachment_link', m.attachment_link, 'metadata', m.metadata, 'parent_id', m.parent_id, 'edited', m.edited, 'all_tagged', m.all_tagged, 'tagged', COALESCE(m.tagged, '{}'::text[]), 'created_at', m.created_at, 'updated_at', m.updated_at) ORDER BY m.created_at), '[]'::json) AS arr
           FROM public.message m
          WHERE (m.discussion_id = d.discussion_id)) mcte ON (true));


--
-- Name: message_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.message_view AS
 SELECT message_id,
    discussion_id,
    type,
    content,
    sender_id,
    public.member_stub((sender_id)::text) AS sender,
    attachment_link,
    metadata,
    created_at,
    updated_at,
        CASE
            WHEN (parent_id IS NULL) THEN NULL::json
            ELSE ( SELECT json_build_object('message_id', pm.message_id, 'discussion_id', pm.discussion_id, 'type', pm.type, 'content', pm.content, 'sender', public.member_stub((pm.sender_id)::text), 'attachment_link', pm.attachment_link, 'metadata', pm.metadata) AS json_build_object
               FROM public.message pm
              WHERE (pm.message_id = m.parent_id))
        END AS parent_message,
    edited,
    all_tagged,
    COALESCE(( SELECT json_agg(public.member_stub(t.t)) AS json_agg
           FROM unnest(m.tagged) t(t)), '[]'::json) AS tagged
   FROM public.message m;


--
-- Name: discussion discussion_discussion_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discussion
    ADD CONSTRAINT discussion_discussion_id_key UNIQUE (discussion_id);


--
-- Name: discussion discussion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discussion
    ADD CONSTRAINT discussion_pkey PRIMARY KEY (id);


--
-- Name: message message_message_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_message_id_key UNIQUE (message_id);


--
-- Name: message message_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_pkey PRIMARY KEY (id);


--
-- Name: participant participant_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participant
    ADD CONSTRAINT participant_pkey PRIMARY KEY (id);


--
-- Name: discussion_discussion_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX discussion_discussion_id_idx ON public.discussion USING btree (discussion_id);


--
-- Name: discussion_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX discussion_id_idx ON public.discussion USING btree (id);


--
-- Name: idx_discussion_dao_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_discussion_dao_id ON public.discussion USING btree (dao_id);


--
-- Name: idx_message_discussion_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_message_discussion_id ON public.message USING btree (discussion_id);


--
-- Name: idx_participant_discussion_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_participant_discussion_id ON public.participant USING btree (discussion_id);


--
-- Name: message_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX message_id_idx ON public.message USING btree (id);


--
-- Name: message_message_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX message_message_id_idx ON public.message USING btree (message_id);


--
-- Name: participant_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX participant_id_idx ON public.participant USING btree (id);


--
-- Name: message message_discussion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_discussion_id_fkey FOREIGN KEY (discussion_id) REFERENCES public.discussion(discussion_id);


--
-- Name: participant participant_discussion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participant
    ADD CONSTRAINT participant_discussion_id_fkey FOREIGN KEY (discussion_id) REFERENCES public.discussion(discussion_id);


--
-- PostgreSQL database dump complete
--


