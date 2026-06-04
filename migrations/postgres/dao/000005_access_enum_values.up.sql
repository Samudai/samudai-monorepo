-- The accesstype enum (000001) only had hidden, view, create_task, manage_project, manage_dao,
-- but dao/internal/dao/access.go CreateAccesses inserts access rows with manage_payment,
-- manage_job and manage_forum (declared in pkg/dao/access.go). Postgres rejects those as
-- "invalid input value for enum accesstype", failing /dao/access/creatediscord (and the
-- /api/member/adddao onboarding flow that calls it). Add the missing values.
ALTER TYPE "accesstype" ADD VALUE IF NOT EXISTS 'manage_payment';
ALTER TYPE "accesstype" ADD VALUE IF NOT EXISTS 'manage_job';
ALTER TYPE "accesstype" ADD VALUE IF NOT EXISTS 'manage_forum';
