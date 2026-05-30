CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE "applicantstatustype" AS ENUM (
  'applied',
  'accepted',
  'rejected'
);

CREATE TYPE "visibilitytype" AS ENUM (
  'public',
  'private'
);

CREATE TYPE "statustype" AS ENUM (
  'open', 
  'draft', 
  'closed'
);

CREATE TYPE "jobtype" AS ENUM(
  'project', 
  'task'
);

CREATE SEQUENCE IF NOT EXISTS applicants_seq;
CREATE TABLE "applicants" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('applicants_seq'::regclass)),
  "appilcant_id" uuid DEFAULT (uuid_generate_v4()),
  "job_id" uuid,
  "member_id" uuid,
  "answers" json DEFAULT ('{}'::json),
  "status" applicantstatustype DEFAULT ('applied'::applicantstatustype),
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp,
  "application" text,
  "clan_id" uuid
);
CREATE SEQUENCE IF NOT EXISTS  bounty_seq;
CREATE TABLE "bounty" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('bounty_seq'::regclass)),
  "bounty_id" uuid UNIQUE DEFAULT (uuid_generate_v4()),
  "dao_id" uuid NOT NULL,
  "title" text,
  "description" text,
  "payout_amount" integer DEFAULT (0),
  "payout_currency" text,
  "winner_count" integer,
  "start_date" timestamp,
  "end_date" timestamp,
  "poc_member_id" uuid,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp,
  "tags" text[] DEFAULT ('{}'::text[]),
  "skills" text[] DEFAULT ('{}'::text[]),
  "visibility" visibilitytype DEFAULT ('public'::visibilitytype),
  "req_people_count" integer DEFAULT (1),
  "status" statustype DEFAULT ('draft'::statustype),
  "project_id" uuid NOT NULL
);
CREATE SEQUENCE IF NOT EXISTS  bounty_files_seq;
CREATE TABLE "bounty_files" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('bounty_files_seq'::regclass)),
  "bounty_file_id" uuid UNIQUE DEFAULT (uuid_generate_v4()),
  "bounty_id" uuid,
  "name" text,
  "url" text,
  "metadata" json NOT NULL DEFAULT ('{}'::json),
  "created_at" timestamp NOT NULL DEFAULT (now())
);
CREATE SEQUENCE IF NOT EXISTS  favourite_seq;
CREATE TABLE "favourite_job" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('favourite_seq'::regclass)),
  "bounty_id" uuid,
  "member_id" uuid,
  "created_at" timestamp NOT NULL DEFAULT (now())
);
CREATE SEQUENCE IF NOT EXISTS  job_files_seq;
CREATE TABLE "job_files" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('job_files_seq'::regclass)),
  "job_file_id" uuid UNIQUE DEFAULT (uuid_generate_v4()),
  "job_id" uuid,
  "name" text,
  "url" text,
  "metadata" json NOT NULL DEFAULT ('{}'::json),
  "created_at" timestamp NOT NULL DEFAULT (now())
);
CREATE SEQUENCE IF NOT EXISTS  opportunity_seq;
CREATE TABLE "opportunity" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('opportunity_seq'::regclass)),
  "job_id" uuid UNIQUE DEFAULT (uuid_generate_v4()),
  "type" jobtype,
  "title" text,
  "description" text,
  "payout_amount" integer DEFAULT (0),
  "payout_currency" text,
  "req_people_count" integer DEFAULT (1),
  "start_date" timestamp,
  "end_date" timestamp,
  "github" text,
  "dao_id" uuid NOT NULL,
  "poc_member_id" uuid,
  "task_id" uuid,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp,
  "tags" text[] DEFAULT ('{}'::text[]),
  "skills" text[] DEFAULT ('{}'::text[]),
  "questions" json DEFAULT ('{}'::json),
  "status" statustype DEFAULT ('draft'::statustype),
  "created_by" uuid,
  "visibility" visibilitytype DEFAULT ('public'::visibilitytype),
  "captain" boolean DEFAULT (false),
  "project_id" uuid
);
CREATE SEQUENCE IF NOT EXISTS  submission_seq;
CREATE TABLE "submission" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('submission_seq'::regclass)),
  "bounty_id" uuid,
  "member_id" uuid,
  "submission" text,
  "file" text,
  "status" applicantstatustype DEFAULT ( 'applied'::applicantstatustype),
  "rank" integer,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp,
  "feedback" text,
  "submission_id" uuid UNIQUE DEFAULT (uuid_generate_v4()),
  "clan_id" uuid
);

CREATE INDEX "applicants_index_0" ON "applicants" ("id");

CREATE INDEX "bounty_index_1" ON "bounty" ("id");

CREATE INDEX "bounty_index_2" ON "bounty" ("bounty_id");

CREATE INDEX "bounty_files_index_3" ON "bounty_files" ("id");

CREATE INDEX "bounty_files_index_4" ON "bounty_files" ("bounty_file_id");

CREATE INDEX "favourite_job_index_5" ON "favourite_job" ("id");

CREATE INDEX "job_files_index_6" ON "job_files" ("id");

CREATE INDEX "job_files_index_7" ON "job_files" ("job_file_id");

CREATE INDEX "opportunity_index_8" ON "opportunity" ("id");

CREATE INDEX "opportunity_index_9" ON "opportunity" ("job_id");

CREATE INDEX "submission_index_10" ON "submission" ("id");

CREATE INDEX "submission_index_11" ON "submission" ("submission_id");

ALTER TABLE "applicants" ADD FOREIGN KEY ("job_id") REFERENCES "opportunity" ("job_id");

ALTER TABLE "bounty_files" ADD FOREIGN KEY ("bounty_id") REFERENCES "bounty" ("bounty_id");

ALTER TABLE "favourite_job" ADD FOREIGN KEY ("bounty_id") REFERENCES "opportunity" ("job_id");

ALTER TABLE "job_files" ADD FOREIGN KEY ("job_id") REFERENCES "opportunity" ("job_id");

ALTER TABLE "submission" ADD FOREIGN KEY ("bounty_id") REFERENCES "bounty" ("bounty_id");
