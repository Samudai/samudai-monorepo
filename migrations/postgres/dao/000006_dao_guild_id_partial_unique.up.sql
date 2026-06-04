-- dao.guild_id is `text UNIQUE` (000001), but general (non-Discord) DAOs have no guild and
-- CreateDAO inserts guild_id = '' (DAO.GuildID is a Go string), so the second general DAO
-- violates dao_guild_id_key. Uniqueness should only apply to real guild IDs: drop the full
-- unique constraint and replace it with a partial unique index that ignores NULL/'' values.
-- (The plain dao_guild_id_idx from 000001 stays for lookups.)
ALTER TABLE "dao" DROP CONSTRAINT IF EXISTS dao_guild_id_key;
CREATE UNIQUE INDEX IF NOT EXISTS dao_guild_id_unique
  ON "dao" (guild_id)
  WHERE guild_id IS NOT NULL AND guild_id <> '';
