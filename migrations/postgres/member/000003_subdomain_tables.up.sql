CREATE TABLE IF NOT EXISTS subdomain (
  subdomain_id      uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id         uuid NOT NULL REFERENCES members(member_id) ON DELETE CASCADE,
  subdomain         text NOT NULL,
  redirection_link  text,
  wallet_address    text,
  access            boolean NOT NULL DEFAULT false,
  transaction_hash  text,
  created_at        timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS subdomain_member_id_idx ON subdomain (member_id);
CREATE INDEX IF NOT EXISTS subdomain_subdomain_idx ON subdomain (subdomain);

CREATE TABLE IF NOT EXISTS member_subdomains (
  id                  bigserial PRIMARY KEY,
  member_id           uuid UNIQUE NOT NULL REFERENCES members(member_id) ON DELETE CASCADE,
  subdomain_requested text NOT NULL,
  wallet_address      text,
  approved            boolean NOT NULL DEFAULT false,
  updated_at          timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS member_subdomains_member_id_idx ON member_subdomains (member_id);

CREATE TABLE IF NOT EXISTS member_nft_claims (
  id         bigserial PRIMARY KEY,
  member_id  uuid NOT NULL REFERENCES members(member_id) ON DELETE CASCADE,
  requested  boolean NOT NULL DEFAULT false,
  approved   boolean NOT NULL DEFAULT false,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS member_nft_claims_member_id_idx ON member_nft_claims (member_id);
