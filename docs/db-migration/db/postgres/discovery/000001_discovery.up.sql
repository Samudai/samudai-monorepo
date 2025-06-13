CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE SEQUENCE events_seq;
CREATE TABLE "dao_events" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('events_seq'::regclass)),
  "dao_id" uuid,
  "event_context" text,
  "event_type" text,
  "created_at" timestamp NOT NULL DEFAULT (now())
);
CREATE SEQUENCE member_events_seq;
CREATE TABLE "member_events" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('member_events_seq'::regclass)),
  "member_id" uuid NOT NULL,
  "event_context" text,
  "event_type" text,
  "created_at" timestamp NOT NULL DEFAULT (now())
);

CREATE INDEX ON "dao_events" ("id");

CREATE INDEX ON "member_events" ("id");
