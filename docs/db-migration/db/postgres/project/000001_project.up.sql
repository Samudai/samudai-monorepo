CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TYPE "accesstype" AS ENUM (
  'hidden',
  'view',
  'create_task',
  'manage_project'
);

CREATE TYPE "commenttype" AS ENUM (
  'project',
  'task'
);

CREATE TYPE "visibilitytype" AS ENUM (
  'public',
  'private'
);

CREATE TYPE "linktype" AS ENUM (
  'dao',
  'member',
  'clan'
);

CREATE TYPE "projecttype" AS ENUM (
  'default',
  'internal',
  'investment'
);
CREATE SEQUENCE access_seq;
CREATE TABLE "access" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('access_seq'::regclass)),
  "project_id" uuid,
  "access" accesstype,
  "members" uuid[] DEFAULT ('{}'::uuid[]),
  "roles" uuid[] DEFAULT ('{}'::uuid[]),
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp,
  "invite_link" text UNIQUE DEFAULT (substr(md5(random()::text),0,10))
);
CREATE SEQUENCE comments_seq;
CREATE TABLE "comments" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('comments_seq'::regclass)),
  "link_id" uuid,
  "body" text,
  "author" uuid,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp,
  "type" commenttype NOT NULL,
  "tagged_members" uuid[] DEFAULT ('{}'::uuid[])
);
CREATE SEQUENCE project_folder_seq;
CREATE TABLE "folder" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('project_folder_seq'::regclass)),
  "folder_id" uuid UNIQUE DEFAULT (uuid_generate_v4()),
  "name" text,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp,
  "project_id" uuid,
  "description" text,
  "created_by" uuid,
  "updated_by" uuid
);
CREATE SEQUENCE form_response_id;
CREATE TABLE "form_response" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('form_response_id'::regclass)),
  "response_id" uuid UNIQUE DEFAULT (uuid_generate_v4()),
  "response_type" text,
  "mongo_object" text,
  "title" text,
  "col" integer DEFAULT (1),
  "position" double precision,
  "assignee_member" uuid[] DEFAULT ('{}'::uuid[]),
  "assignee_clan" uuid[] DEFAULT ('{}'::uuid[]),
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp,
  "updated_by" uuid,
  "discussion_id" uuid
);
CREATE SEQUENCE project_seq;
CREATE TABLE "project" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('project_seq'::regclass)),
  "project_id" uuid UNIQUE DEFAULT (uuid_generate_v4()),
  "description" text,
  "title" text,
  "visibility" visibilitytype NOT NULL DEFAULT ('public'::visibilitytype),
  "poc_member_id" uuid,
  "created_by" uuid,
  "discord_channel" text,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp,
  "link_id" uuid,
  "updated_by" uuid,
  "default" boolean DEFAULT (false),
  "github_repos" text[] DEFAULT ('{}'::text[]),
  "start_date" timestamp,
  "end_date" timestamp,
  "type" linktype NOT NULL DEFAULT ('dao'::linktype),
  "captain" uuid,
  "department" uuid,
  "notion_database" text,
  "columns" text DEFAULT ('[]'::text),
  "budget_amount" numeric,
  "budget_currency" text,
  "completed" boolean DEFAULT (false),
  "project_type" projecttype DEFAULT ('default'::projecttype),
  "total_col" integer,
  "pinned" boolean DEFAULT (false)
);
CREATE SEQUENCE project_file_seq;
CREATE TABLE "project_files" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('project_file_seq'::regclass)),
  "project_file_id" uuid UNIQUE DEFAULT (uuid_generate_v4()),
  "name" text,
  "url" text,
  "metadata" json NOT NULL DEFAULT ('{}'::json),
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "folder_id" uuid
);
CREATE SEQUENCE subtask_seq;
CREATE TABLE "subtask" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('subtask_seq'::regclass)),
  "subtask_id" uuid UNIQUE DEFAULT (uuid_generate_v4()),
  "task_id" uuid,
  "title" text NOT NULL,
  "completed" boolean DEFAULT (false),
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp
);
CREATE SEQUENCE task_file_seq;
CREATE TABLE "tasks_files" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('task_file_seq'::regclass)),
  "task_file_id" uuid UNIQUE DEFAULT (uuid_generate_v4()),
  "task_id" uuid,
  "name" text,
  "url" text,
  "metadata" json DEFAULT ('{}'::json),
  "created_at" timestamp NOT NULL DEFAULT (now())
);
CREATE SEQUENCE task_seq;
CREATE TABLE "task" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('task_seq'::regclass)),
  "task_id" uuid UNIQUE DEFAULT (uuid_generate_v4()),
  "title" text,
  "description" text,
  "poc_member_id" uuid,
  "deadline" timestamp,
  "created_by" uuid,
  "updated_by" uuid,
  "assignee_member" uuid[] DEFAULT ('{}'::uuid[]),
  "project_id" uuid,
  "tags" text[] DEFAULT ('{}'::text[]),
  "feedback" text,
  "assignee_clan" uuid[] DEFAULT ('{}'::uuid[]),
  "github_issue" integer DEFAULT (0::integer),
  "position" double precision NOT NULL,
  "notion_page" text,
  "notion_property" text,
  "col" integer NOT NULL,
  "payout" text DEFAULT ('[]'::text),
  "vc_claim" boolean DEFAULT (false),
  "payment_created" boolean DEFAULT (false),
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp
);

CREATE INDEX ON "access" ("id");

CREATE INDEX ON "access" ("invite_link");

CREATE INDEX ON "comments" ("id");

CREATE INDEX ON "folder" ("id");

CREATE INDEX ON "folder" ("folder_id");

CREATE INDEX ON "form_response" ("id");

CREATE INDEX ON "form_response" ("response_id");

CREATE INDEX ON "project" ("id");

CREATE INDEX ON "project" ("project_id");

CREATE INDEX ON "project_files" ("id");

CREATE INDEX ON "project_files" ("project_file_id");

CREATE INDEX ON "subtask" ("id");

CREATE INDEX ON "subtask" ("subtask_id");

CREATE INDEX ON "tasks_files" ("id");

CREATE INDEX ON "task" ("id");

CREATE INDEX ON "task" ("task_id");

ALTER TABLE "access" ADD FOREIGN KEY ("project_id") REFERENCES "project" ("project_id");

ALTER TABLE "comments" ADD FOREIGN KEY ("link_id") REFERENCES "task" ("task_id");

ALTER TABLE "folder" ADD FOREIGN KEY ("project_id") REFERENCES "project" ("project_id");

ALTER TABLE "project_files" ADD FOREIGN KEY ("folder_id") REFERENCES "folder" ("folder_id");

ALTER TABLE "subtask" ADD FOREIGN KEY ("task_id") REFERENCES "task" ("task_id");

ALTER TABLE "tasks_files" ADD FOREIGN KEY ("task_id") REFERENCES "task" ("task_id");

ALTER TABLE "task" ADD FOREIGN KEY ("project_id") REFERENCES "project" ("project_id");
