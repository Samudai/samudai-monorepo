# service-discovery

Develop - [![.github/workflows/dev.yaml](https://github.com/Samudai/service-discovery/actions/workflows/dev.yaml/badge.svg?branch=develop)](https://github.com/Samudai/service-discovery/actions/workflows/dev.yaml)

Staging - [![.github/workflows/staging.yaml](https://github.com/Samudai/service-discovery/actions/workflows/staging.yaml/badge.svg?branch=staging)](https://github.com/Samudai/service-discovery/actions/workflows/staging.yaml)

Prod - [![.github/workflows/workflow.yaml](https://github.com/Samudai/service-discovery/actions/workflows/workflow.yaml/badge.svg)](https://github.com/Samudai/service-discovery/actions/workflows/workflow.yaml)

```sql
CREATE TYPE eventcontext AS ENUM ('project','bounty','opportunity');
CREATE TYPE eventtype AS ENUM ('project_created','project_completed','project_deleted');

CREATE TYPE membereventcontext AS ENUM ('task','verifyable_creds');
CREATE TYPE membereventtype AS ENUM ('task_created','task_assigned','task_unassigned', 'task_completed', 'task_deleted', 'verifyable_creds_created', 'verifyable_creds_updated');
```
