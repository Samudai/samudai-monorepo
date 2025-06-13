# service-job

Develop - [![.github/workflows/dev.yaml](https://github.com/Samudai/service-job/actions/workflows/dev.yaml/badge.svg?branch=develop)](https://github.com/Samudai/service-job/actions/workflows/dev.yaml)

Staging - [![.github/workflows/staging.yaml](https://github.com/Samudai/service-job/actions/workflows/staging.yaml/badge.svg?branch=staging)](https://github.com/Samudai/service-job/actions/workflows/staging.yaml)

Prod - [![.github/workflows/workflow.yaml](https://github.com/Samudai/service-job/actions/workflows/workflow.yaml/badge.svg)](https://github.com/Samudai/service-job/actions/workflows/workflow.yaml)

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
CREATE TYPE jobtype AS ENUM ('project','task');
CREATE TYPE visibilitytype AS ENUM ('public','private');
CREATE TYPE statustype AS ENUM ('open','draft','closed');
CREATE TYPE applicantstatustype AS ENUM ('applied','accepted','rejected');
```

- create enum cast

```sql
CREATE CAST (applicantstatustype AS integer) WITH FUNCTION enum_to_position(anyenum);
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
