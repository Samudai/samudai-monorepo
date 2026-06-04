-- dao_tags lookup table: dao/internal/dao/tag.go ListTags does `SELECT tag FROM dao_tags`.
-- Read-only in the service, so an empty table clears the error; seeding is out of scope.
CREATE TABLE IF NOT EXISTS "dao_tags" ("tag" text);
