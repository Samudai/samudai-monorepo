CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TYPE "visibilitytype" AS ENUM (
  'public',
  'private'
);
CREATE SEQUENCE dashboard_seq;
CREATE TABLE "dashboard" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('dashboard_seq'::regclass)),
  "dashboard_id" uuid UNIQUE DEFAULT (uuid_generate_v4()),
  "dao_id" uuid,
  "dashboard_name" text,
  "description" text,
  "default" boolean,
  "visibility" visibilitytype,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp
);
CREATE SEQUENCE dashboard_widget_seq;
CREATE TABLE "dashboard_widget" (
  "dashboard_widget_id" bigint PRIMARY KEY DEFAULT (nextval('dashboard_widget_seq'::regclass)),
  "dashboard_id" uuid,
  "active" boolean,
  "row_id" integer,
  "col_id" integer,
  "order" integer,
  "draggable" boolean,
  "popup_id" integer,
  "id" integer NOT NULL,
  "name" text,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp
);

CREATE INDEX ON "dashboard" ("id");

CREATE INDEX ON "dashboard" ("dashboard_id");

CREATE INDEX ON "dashboard_widget" ("dashboard_widget_id");

ALTER TABLE "dashboard_widget" ADD FOREIGN KEY ("dashboard_id") REFERENCES "dashboard" ("dashboard_id");
