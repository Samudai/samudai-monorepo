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
-- Name: events_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.events_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: dao_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dao_events (
    id bigint DEFAULT nextval('public.events_seq'::regclass) NOT NULL,
    dao_id uuid,
    event_context text,
    event_type text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: member_events_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.member_events_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: member_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.member_events (
    id bigint DEFAULT nextval('public.member_events_seq'::regclass) NOT NULL,
    member_id uuid NOT NULL,
    event_context text,
    event_type text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    dao_id uuid
);


--
-- Name: dao_events dao_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dao_events
    ADD CONSTRAINT dao_events_pkey PRIMARY KEY (id);


--
-- Name: member_events member_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_events
    ADD CONSTRAINT member_events_pkey PRIMARY KEY (id);


--
-- Name: dao_events_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dao_events_id_idx ON public.dao_events USING btree (id);


--
-- Name: member_events_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX member_events_id_idx ON public.member_events USING btree (id);


--
-- PostgreSQL database dump complete
--


