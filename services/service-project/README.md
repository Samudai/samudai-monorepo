# service-project

Develop - [![.github/workflows/dev.yaml](https://github.com/Samudai/service-project/actions/workflows/dev.yaml/badge.svg?branch=develop)](https://github.com/Samudai/service-project/actions/workflows/dev.yaml)

Staging - [![.github/workflows/staging.yaml](https://github.com/Samudai/service-project/actions/workflows/staging.yaml/badge.svg?branch=staging)](https://github.com/Samudai/service-project/actions/workflows/staging.yaml)

Prod - [![.github/workflows/production.yaml](https://github.com/Samudai/service-project/actions/workflows/production.yaml/badge.svg)](https://github.com/Samudai/service-project/actions/workflows/production.yaml)

## enum to integer

- create function

```sql
CREATE OR REPLACE FUNCTION enum_to_position(anyenum) RETURNS integer AS $$
SELECT enumpos::integer FROM (
        SELECT row_number() OVER (order by enumsortorder) AS enumpos,
               enumsortorder,
               enumlabel
        FROM pg_catalog.pg_enum
        WHERE enumtypid = pg_typeof($1)
    ) enum_ordering
    WHERE enumlabel = ($1::text);
$$ LANGUAGE SQL STABLE STRICT;
```

- create enum

```sql
CREATE TYPE accesstype AS ENUM ('hidden','view','create_task','manage_project');
CREATE TYPE visibilitytype AS ENUM ('public','private');
CREATE TYPE projecttype AS ENUM ('default','internal','investment');
CREATE TYPE linktype AS ENUM ('dao','clan','member');
CREATE TYPE commenttype AS ENUM ('project','task');
```

- create enum cast

```sql
CREATE CAST (accesstype AS integer) WITH FUNCTION enum_to_position(anyenum);
```

- list functions

```sql
SELECT
    routine_name
FROM 
    information_schema.routines
WHERE 
    routine_type = 'FUNCTION'
AND
    routine_schema = 'public';
```

```sql
ALTER TYPE accesstype ADD VALUE 'new_value' BEFORE/AFTER 'old_value';
```
