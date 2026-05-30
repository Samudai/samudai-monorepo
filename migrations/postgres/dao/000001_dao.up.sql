CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE "accesstype" AS ENUM (
  'hidden',
  'view',
  'create_task',
  'manage_project',
  'manage_dao'
);

CREATE TYPE "invitestatus" AS ENUM (
  'pending',
  'accepted',
  'rejected'
);
CREATE SEQUENCE access_seq;
CREATE TABLE "access" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('access_seq'::regclass)),
  "dao_id" uuid,
  "access" accesstype,
  "roles" uuid[] DEFAULT ('{}'::uuid[]),
  "members" uuid[] DEFAULT ('{}'::uuid[]),
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp
);
CREATE SEQUENCE analytics_seq;
CREATE TABLE "analytics" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('analytics_seq'::regclass)),
  "dao_id" uuid,
  "member_id" uuid,
  "time" timestamp NOT NULL DEFAULT (now()),
  "visitor_ip" text
);
CREATE SEQUENCE blogs_seq;
CREATE TABLE "blogs" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('blogs_seq'::regclass)),
  "dao_id" uuid,
  "link" text,
  "created_at" timestamp NOT NULL DEFAULT (now())
);
CREATE SEQUENCE collaboration_seq;
CREATE TABLE "collaboration" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('collaboration_seq'::regclass)),
  "collaboration_id" uuid UNIQUE DEFAULT (uuid_generate_v4()),
  "applying_member_id" uuid NOT NULL,
  "from_dao_id" uuid,
  "to_dao_id" uuid,
  "status" text,
  "title" text,
  "department" uuid,
  "description" text,
  "requirements" json DEFAULT ('{}'::json),
  "benefits" text,
  "attachment" text,
  "replying_member_id" uuid NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp
);
CREATE SEQUENCE dao_id_seq;
CREATE TABLE "dao" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('dao_id_seq'::regclass)),
  "dao_id" uuid UNIQUE DEFAULT (uuid_generate_v4()),
  "name" text,
  "guild_id" text UNIQUE,
  "about" text,
  "profile_picture" text,
  "contract_address" text,
  "snapshot" text,
  "owner_id" uuid DEFAULT (uuid_nil()),
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp,
  "onboarding" boolean DEFAULT (false),
  "dao_type" text DEFAULT ('general'),
  "token_gating" boolean DEFAULT (false)
);
CREATE SEQUENCE dao_invites_seq;
CREATE TABLE "dao_invites" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('dao_invites_seq'::regclass)),
  "dao_id" uuid,
  "sender_id" uuid,
  "invite_code" text UNIQUE,
  "receiver_id" uuid,
  "status" invitestatus,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp
);
CREATE SEQUENCE dao_partner_seq;
CREATE TABLE "dao_partner" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('dao_partner_seq'::regclass)),
  "dao_partner_id" uuid UNIQUE DEFAULT (uuid_generate_v4()),
  "name" text,
  "logo" text,
  "website" text,
  "email" text,
  "phone" text,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp,
  "dao_id" uuid
);
CREATE SEQUENCE department_seq;
CREATE TABLE "department" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('department_seq'::regclass)),
  "department_id" uuid UNIQUE DEFAULT (uuid_generate_v4()),
  "name" text,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp,
  "dao_id" uuid
);
CREATE SEQUENCE favourite_seq;
CREATE TABLE "favourite" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('favourite_seq'::regclass)),
  "memeber_id" uuid,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "dao_id" uuid
);
CREATE SEQUENCE member_role_seq;
CREATE TABLE "member_roles" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('member_role_seq'::regclass)),
  "memeber_id" uuid,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "role_id" uuid,
  "dao_id" uuid
);
CREATE SEQUENCE dao_member_seq;
CREATE TABLE "member" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('dao_member_seq'::regclass)),
  "memeber_id" uuid,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "dao_id" uuid
);
CREATE SEQUENCE partner_social_seq;
CREATE TABLE "partner_social" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('partner_social_seq'::regclass)),
  "type" text,
  "url" text,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "dao_partner_id" uuid,
  "updated_at" timestamp
);
CREATE SEQUENCE provider_seq;
CREATE TABLE "provider" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('provider_seq'::regclass)),
  "provider_type" text,
  "address" text,
  "created_by" uuid,
  "chain_id" integer,
  "is_default" boolean,
  "name" text,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "dao_id" uuid,
  "updated_at" timestamp
);
CREATE SEQUENCE reviews_seq;
CREATE TABLE "reviews" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('reviews_seq'::regclass)),
  "member_id" uuid NOT NULL,
  "content" text,
  "rating" integer,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "dao_id" uuid
);
CREATE SEQUENCE dao_role_seq;
CREATE TABLE "roles" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('dao_role_seq'::regclass)),
  "role_id" uuid UNIQUE DEFAULT (uuid_generate_v4()),
  "name" text,
  "discord_role_id" text,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "dao_id" uuid,
  "updated_at" timestamp
);
CREATE SEQUENCE social_seq;
CREATE TABLE "social" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('social_seq'::regclass)),
  "type" text,
  "ur" text,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "dao_id" uuid,
  "updated_at" timestamp
);
CREATE SEQUENCE token_seq;
CREATE TABLE "token" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('token_seq'::regclass)),
  "ticker" text,
  "contract_address" text,
  "average_time_held" text,
  "holders" integer,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "dao_id" uuid,
  "updated_at" timestamp
);

CREATE INDEX ON "access" ("id");

CREATE INDEX ON "analytics" ("id");

CREATE INDEX ON "blogs" ("id");

CREATE INDEX ON "collaboration" ("id");

CREATE INDEX ON "collaboration" ("collaboration_id");

CREATE INDEX ON "dao" ("id");

CREATE INDEX ON "dao" ("dao_id");

CREATE INDEX ON "dao" ("guild_id");

CREATE INDEX ON "dao_invites" ("id");

CREATE INDEX ON "dao_invites" ("invite_code");

CREATE INDEX ON "dao_partner" ("id");

CREATE INDEX ON "dao_partner" ("dao_partner_id");

CREATE INDEX ON "department" ("id");

CREATE INDEX ON "department" ("department_id");

CREATE INDEX ON "favourite" ("id");

CREATE INDEX ON "member_roles" ("id");

CREATE INDEX ON "member" ("id");

CREATE INDEX ON "partner_social" ("id");

CREATE INDEX ON "provider" ("id");

CREATE INDEX ON "reviews" ("id");

CREATE INDEX ON "roles" ("id");

CREATE INDEX ON "roles" ("role_id");

CREATE INDEX ON "social" ("id");

CREATE INDEX ON "token" ("id");

COMMENT ON COLUMN "provider"."provider_type" IS 'enum - gnosis, wallet, parcel';

ALTER TABLE "access" ADD FOREIGN KEY ("dao_id") REFERENCES "dao" ("dao_id");

ALTER TABLE "blogs" ADD FOREIGN KEY ("dao_id") REFERENCES "dao" ("dao_id");

ALTER TABLE "collaboration" ADD FOREIGN KEY ("from_dao_id") REFERENCES "dao" ("dao_id");

ALTER TABLE "collaboration" ADD FOREIGN KEY ("to_dao_id") REFERENCES "dao" ("dao_id");

ALTER TABLE "collaboration" ADD FOREIGN KEY ("department") REFERENCES "department" ("department_id");

ALTER TABLE "dao_invites" ADD FOREIGN KEY ("dao_id") REFERENCES "dao" ("dao_id");

ALTER TABLE "dao_partner" ADD FOREIGN KEY ("dao_id") REFERENCES "dao" ("dao_id");

ALTER TABLE "department" ADD FOREIGN KEY ("dao_id") REFERENCES "dao" ("dao_id");

ALTER TABLE "favourite" ADD FOREIGN KEY ("dao_id") REFERENCES "dao" ("dao_id");

ALTER TABLE "member_roles" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("role_id");

ALTER TABLE "member_roles" ADD FOREIGN KEY ("dao_id") REFERENCES "dao" ("dao_id");

ALTER TABLE "member" ADD FOREIGN KEY ("dao_id") REFERENCES "dao" ("dao_id");

ALTER TABLE "partner_social" ADD FOREIGN KEY ("dao_partner_id") REFERENCES "dao_partner" ("dao_partner_id");

ALTER TABLE "provider" ADD FOREIGN KEY ("dao_id") REFERENCES "dao" ("dao_id");

ALTER TABLE "reviews" ADD FOREIGN KEY ("dao_id") REFERENCES "dao" ("dao_id");

ALTER TABLE "roles" ADD FOREIGN KEY ("dao_id") REFERENCES "dao" ("dao_id");

ALTER TABLE "social" ADD FOREIGN KEY ("dao_id") REFERENCES "dao" ("dao_id");

ALTER TABLE "token" ADD FOREIGN KEY ("dao_id") REFERENCES "dao" ("dao_id");
