CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE "invitestatus" as ENUM (
  'revoked',
  'pending',
  'accepted',
  'rejected'
);

CREATE SEQUENCE IF NOT EXISTS clan_invites_seq;
CREATE TABLE "clan_invites" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('clan_invites_seq'::regclass)),
  "clan_id" uuid,
  "sender_id" uuid,
  "invite_code" text UNIQUE,
  "receiver_id" uuid,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp
);

CREATE SEQUENCE IF NOT EXISTS clan_member_seq;
CREATE TABLE "clan_members" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('clan_member_seq'::regclass)),
  "clan_id" uuid,
  "member_id" uuid,
  "role" text,
  "notificatiton" boolean DEFAULT (true),
  "created_at" timestamp NOT NULL DEFAULT (now())
);
CREATE SEQUENCE IF NOT EXISTS clan_seq;
CREATE TABLE "clans" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('clan_seq'::regclass)),
  "clan_id" uuid UNIQUE DEFAULT (uuid_generate_v4()),
  "name" text UNIQUE,
  "visibility" text,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp,
  "avatar" text,
  "created_by" uuid
);
CREATE SEQUENCE IF NOT EXISTS connections_seq;
CREATE TABLE "connection_request" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('connections_seq'::regclass)),
  "sender_id" uuid,
  "receiver_id" uuid,
  "status" invitestatus,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp
);
CREATE SEQUENCE IF NOT EXISTS discord_seq;
CREATE TABLE "discord" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('discord_seq'::regclass)),
  "member_id" uuid DEFAULT (uuid_generate_v4()),
  "discord_user_id" text UNIQUE NOT NULL,
  "username" text,
  "avatar" text,
  "discriminator" text,
  "public_flags" integer,
  "flags" integer,
  "banner" text,
  "banner_color" text,
  "accent_color" integer,
  "locale" text,
  "mfa_enabled" boolean,
  "verified" boolean,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp,
  "email" text UNIQUE
);
CREATE SEQUENCE IF NOT EXISTS member_wallet_seq;
CREATE TABLE "member_wallet" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('member_wallet_seq'::regclass)),
  "member_id" uuid DEFAULT (uuid_generate_v4()),
  "wallet_address" text UNIQUE NOT NULL,
  "default" boolean DEFAULT (false),
  "chain_id" bigint NOT NULL
);
CREATE SEQUENCE IF NOT EXISTS members_seq;
CREATE TABLE "members" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('members_seq'::regclass)),
  "member_id" uuid UNIQUE DEFAULT (uuid_generate_v4()),
  "name" text,
  "phone" text,
  "email" text UNIQUE,
  "about" text,
  "skills" text[] NOT NULL DEFAULT ('{}'::text[]),
  "profile_picture" text,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp,
  "did" text NOT NULL,
  "username" text UNIQUE,
  "captain" boolean DEFAULT (false),
  "open_for_opportunity" boolean DEFAULT (true),
  "ceramic_stream" text,
  "subdomain" text,
  "invite_code" text UNIQUE DEFAULT (substr(md5(random()::text),0,8))
);
CREATE SEQUENCE IF NOT EXISTS onboarding_seq;
CREATE TABLE "onboarding" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('onboarding_seq'::regclass)),
  "member_id" uuid,
  "admin" boolean,
  "contributor" boolean,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp,
  "invite_code" text
);
CREATE SEQUENCE IF NOT EXISTS reviews_id;
CREATE TABLE "reviews" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('reviews_id'::regclass)),
  "member_id" uuid,
  "reviewer_id" uuid NOT NULL,
  "content" text,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "rating" integer
);
CREATE SEQUENCE IF NOT EXISTS rewards_earned_seq;
CREATE TABLE "rewards_earned" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('rewards_earned_seq'::regclass)),
  "member_id" uuid NOT NULL,
  "dao_id" uuid NOT NULL,
  "amount" numeric NOT NULL DEFAULT (0.0),
  "currency" text NOT NULL,
  "link_id" uuid NOT NULL,
  "type" text NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now())
);
CREATE SEQUENCE IF NOT EXISTS social_seq;
CREATE TABLE "social" (
  "id" bigint PRIMARY KEY DEFAULT (nextval('social_seq'::regclass)),
  "member_id" uuid,
  "type" text,
  "url" text,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp
);

CREATE INDEX ON "clan_invites" ("id");

CREATE INDEX ON "clan_invites" ("invite_code");

CREATE INDEX ON "clan_members" ("id");

CREATE INDEX ON "clans" ("id");

CREATE INDEX ON "clans" ("clan_id");

CREATE INDEX ON "clans" ("name");

CREATE INDEX ON "connection_request" ("id");

CREATE INDEX ON "discord" ("id");

CREATE INDEX ON "discord" ("discord_user_id");

CREATE INDEX ON "discord" ("email");

CREATE INDEX ON "member_wallet" ("id");

CREATE INDEX ON "member_wallet" ("wallet_address");

CREATE INDEX ON "members" ("id");

CREATE INDEX ON "members" ("member_id");

CREATE INDEX ON "members" ("email");

CREATE INDEX ON "members" ("username");

CREATE INDEX ON "members" ("invite_code");

CREATE INDEX ON "onboarding" ("id");

CREATE INDEX ON "onboarding" ("invite_code");

CREATE INDEX ON "reviews" ("id");

CREATE INDEX ON "rewards_earned" ("id");

CREATE INDEX ON "social" ("id");

COMMENT ON COLUMN "clan_invites"."invite_code" IS 'must be unique';

COMMENT ON COLUMN "clans"."name" IS 'must be unique';

COMMENT ON COLUMN "discord"."discord_user_id" IS 'must be unique';

ALTER TABLE "clan_invites" ADD FOREIGN KEY ("clan_id") REFERENCES "clans" ("clan_id");

ALTER TABLE "clan_invites" ADD FOREIGN KEY ("sender_id") REFERENCES "members" ("member_id");

ALTER TABLE "clan_invites" ADD FOREIGN KEY ("receiver_id") REFERENCES "members" ("member_id");

ALTER TABLE "clan_members" ADD FOREIGN KEY ("clan_id") REFERENCES "clans" ("clan_id");

ALTER TABLE "clan_members" ADD FOREIGN KEY ("member_id") REFERENCES "members" ("member_id");

ALTER TABLE "clans" ADD FOREIGN KEY ("created_by") REFERENCES "members" ("member_id");

ALTER TABLE "connection_request" ADD FOREIGN KEY ("sender_id") REFERENCES "members" ("member_id");

ALTER TABLE "connection_request" ADD FOREIGN KEY ("receiver_id") REFERENCES "members" ("member_id");

ALTER TABLE "discord" ADD FOREIGN KEY ("member_id") REFERENCES "members" ("member_id");

ALTER TABLE "member_wallet" ADD FOREIGN KEY ("member_id") REFERENCES "members" ("member_id");

ALTER TABLE "onboarding" ADD FOREIGN KEY ("member_id") REFERENCES "members" ("member_id");

ALTER TABLE "reviews" ADD FOREIGN KEY ("member_id") REFERENCES "members" ("member_id");

ALTER TABLE "reviews" ADD FOREIGN KEY ("reviewer_id") REFERENCES "members" ("member_id");

ALTER TABLE "rewards_earned" ADD FOREIGN KEY ("member_id") REFERENCES "members" ("member_id");

ALTER TABLE "social" ADD FOREIGN KEY ("member_id") REFERENCES "members" ("member_id");
