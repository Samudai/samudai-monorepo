# service-member

Develop - [![.github/workflows/dev.yaml](https://github.com/Samudai/service-member/actions/workflows/dev.yaml/badge.svg?branch=develop)](https://github.com/Samudai/service-member/actions/workflows/dev.yaml)

Staging - [![.github/workflows/staging.yaml](https://github.com/Samudai/service-member/actions/workflows/staging.yaml/badge.svg?branch=staging)](https://github.com/Samudai/service-member/actions/workflows/staging.yaml)

Prod - [![.github/workflows/workflow.yaml](https://github.com/Samudai/service-member/actions/workflows/workflow.yaml/badge.svg)](https://github.com/Samudai/service-member/actions/workflows/workflow.yaml)

## enum

```sql
CREATE TYPE chaintype AS ENUM ('mainnet','testnet');
CREATE TYPE invitestatus AS ENUM ('revoked','pending','accepted','rejected');
```

- list enums

```sql
SELECT enum_range(NULL::invitestatus);

SELECT n.nspname AS enum_schema,  
       t.typname AS enum_name,  
       e.enumlabel AS enum_value
FROM pg_type t 
   JOIN pg_enum e ON t.oid = e.enumtypid  
   JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace;
```

- alter enums

```sql
ALTER TYPE invitestatus ADD VALUE 'new_value' BEFORE/AFTER 'old_value';
```

- testing tsvector search on postgres

```sql
ALTER TABLE members ADD COLUMN username_ts tsvector
    GENERATED ALWAYS AS (to_tsvector('english', username)) STORED;

CREATE INDEX username_ts_idx ON members USING GIN (username_ts);

SELECT *
FROM members
WHERE username_ts @@ to_tsquery('english', 'kush');
```
x
