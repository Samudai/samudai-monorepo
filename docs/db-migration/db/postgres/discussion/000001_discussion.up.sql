CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE SEQUENCE discussion_seq;
CREATE TABLE "discussion" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('discussion_seq'::regclass)),
  "discussion_id" uuid UNIQUE DEFAULT (uuid_generate_v4()),
  "dao_id" uuid,
  "topic" text,
  "description" text,
  "created_by" uuid,
  "updated_by" uuid,
  "category" text,
  "category_id" uuid,
  "closed" boolean DEFAULT (false),
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp,
  "closed_on" timestamp,
  "proposal_id" text
);
CREATE SEQUENCE participant_seq;
CREATE TABLE "participant" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('participant_seq'::regclass)),
  "discussion_id" uuid,
  "member_id" uuid,
  "created_at" timestamp NOT NULL DEFAULT (now())
);
CREATE SEQUENCE message_seq;
CREATE TABLE "message" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('message_seq'::regclass)),
  "discussion_id" uuid,
  "message_id" uuid UNIQUE NOT NULL DEFAULT (uuid_generate_v4()),
  "type" text,
  "content" text,
  "sender_id" uuid NOT NULL,
  "attachment_link" text,
  "metadata" json DEFAULT ('{}'::json),
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp
);

CREATE INDEX ON "discussion" ("id");

CREATE INDEX ON "discussion" ("discussion_id");

CREATE INDEX ON "participant" ("id");

CREATE INDEX ON "message" ("id");

CREATE INDEX ON "message" ("message_id");

ALTER TABLE "participant" ADD FOREIGN KEY ("discussion_id") REFERENCES "discussion" ("discussion_id");

ALTER TABLE "message" ADD FOREIGN KEY ("discussion_id") REFERENCES "discussion" ("discussion_id");
