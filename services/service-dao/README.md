# service-dao

Develop - [![.github/workflows/dev.yaml](https://github.com/Samudai/service-dao/actions/workflows/dev.yaml/badge.svg?branch=develop)](https://github.com/Samudai/service-dao/actions/workflows/dev.yaml)

Staging - [![.github/workflows/staging.yaml](https://github.com/Samudai/service-dao/actions/workflows/staging.yaml/badge.svg?branch=staging)](https://github.com/Samudai/service-dao/actions/workflows/staging.yaml)

Prod - [![.github/workflows/workflow.yaml](https://github.com/Samudai/service-dao/actions/workflows/workflow.yaml/badge.svg)](https://github.com/Samudai/service-dao/actions/workflows/workflow.yaml)

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
CREATE TYPE accesstype AS ENUM ('view','create_task','manage_project','manage_dao');
CREATE TYPE visibilitytype AS ENUM ('public','private');
CREATE TYPE invitestatus AS ENUM ('pending','accepted','rejected');
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

- list enums

```sql
SELECT enum_range(NULL::accesstype);

SELECT n.nspname AS enum_schema,  
       t.typname AS enum_name,  
       e.enumlabel AS enum_value
FROM pg_type t 
   JOIN pg_enum e ON t.oid = e.enumtypid  
   JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace;
```
