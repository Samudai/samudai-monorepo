-- Restore the original full unique constraint. NOTE: this will fail if multiple rows with the
-- same non-null guild_id (incl. several '') exist, which is exactly the state this migration
-- was created to allow.
DROP INDEX IF EXISTS dao_guild_id_unique;
ALTER TABLE "dao" ADD CONSTRAINT dao_guild_id_key UNIQUE (guild_id);
