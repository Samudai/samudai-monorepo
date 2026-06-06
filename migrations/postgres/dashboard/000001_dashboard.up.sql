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
-- Name: visibilitytype; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.visibilitytype AS ENUM (
    'public',
    'private'
);


--
-- Name: dashboard_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dashboard_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: dashboard; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dashboard (
    id bigint DEFAULT nextval('public.dashboard_seq'::regclass) NOT NULL,
    dashboard_id uuid DEFAULT public.uuid_generate_v4(),
    dao_id uuid,
    dashboard_name text,
    description text,
    "default" boolean,
    visibility public.visibilitytype,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone
);


--
-- Name: dashboard_widget_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dashboard_widget_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dashboard_widget; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dashboard_widget (
    dashboard_widget_id bigint DEFAULT nextval('public.dashboard_widget_seq'::regclass) NOT NULL,
    dashboard_id uuid,
    active boolean,
    row_id integer,
    col_id integer,
    "order" integer,
    draggable boolean,
    popup_id integer,
    id integer NOT NULL,
    name text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone
);


--
-- Name: dashboard_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.dashboard_view AS
 SELECT dashboard_id,
    dao_id,
    dashboard_name,
    description,
    "default",
    visibility,
    COALESCE(( SELECT json_agg(json_build_object('dashboard_widget_id', w.dashboard_widget_id, 'dashboard_id', w.dashboard_id, 'id', w.id, 'name', w.name, 'active', w.active, 'row_id', w.row_id, 'col_id', w.col_id, 'order', w."order", 'draggable', w.draggable, 'popup_id', w.popup_id, 'created_at', w.created_at, 'updated_at', w.updated_at) ORDER BY w."order") AS json_agg
           FROM public.dashboard_widget w
          WHERE (w.dashboard_id = d.dashboard_id)), '[]'::json) AS widgets,
    created_at,
    updated_at
   FROM public.dashboard d;


--
-- Name: dashboard dashboard_dashboard_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard
    ADD CONSTRAINT dashboard_dashboard_id_key UNIQUE (dashboard_id);


--
-- Name: dashboard dashboard_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard
    ADD CONSTRAINT dashboard_pkey PRIMARY KEY (id);


--
-- Name: dashboard_widget dashboard_widget_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard_widget
    ADD CONSTRAINT dashboard_widget_pkey PRIMARY KEY (dashboard_widget_id);


--
-- Name: dashboard_dashboard_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboard_dashboard_id_idx ON public.dashboard USING btree (dashboard_id);


--
-- Name: dashboard_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboard_id_idx ON public.dashboard USING btree (id);


--
-- Name: dashboard_widget_dashboard_widget_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboard_widget_dashboard_widget_id_idx ON public.dashboard_widget USING btree (dashboard_widget_id);


--
-- Name: dashboard_widget dashboard_widget_dashboard_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard_widget
    ADD CONSTRAINT dashboard_widget_dashboard_id_fkey FOREIGN KEY (dashboard_id) REFERENCES public.dashboard(dashboard_id);


--
-- PostgreSQL database dump complete
--


