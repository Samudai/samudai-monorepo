package discordsvc

import (
	"context"
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/Samudai/backend/services/discord/pkg/discord"
)

// EnsureIndexes creates the secondary indexes the discord service queries on, for
// both the discord and pointdiscord Mongo databases. It is idempotent (an existing
// identical index is a no-op), so it is safe to call on every boot. Indexes are
// non-unique: the service upserts on its own keys and the bulk-insert paths do not
// dedup, so the database must not enforce uniqueness.
func EnsureIndexes(ctx context.Context) error {
	client := db.GetMongo()

	guildID := mongoIndex("guild_id", bson.D{{Key: "guild_id", Value: 1}})
	userGuild := mongoIndex("discord_user_guild", bson.D{{Key: "discord_user_id", Value: 1}, {Key: "guild_id", Value: 1}})
	userPoint := mongoIndex("discord_user_point", bson.D{{Key: "discord_user_id", Value: 1}, {Key: "point_id", Value: 1}})

	plans := []struct {
		database   string
		collection string
		models     []mongo.IndexModel
	}{
		{discord.DatabaseDiscord, discord.CollectionMembers, []mongo.IndexModel{userGuild, guildID}},
		{discord.DatabaseDiscord, discord.CollectionRoles, []mongo.IndexModel{guildID}},
		{discord.DatabaseDiscord, discord.CollectionEvents, []mongo.IndexModel{guildID}},
		{discord.DatabasePointDiscord, discord.CollectionMembers, []mongo.IndexModel{userGuild, userPoint, guildID}},
		{discord.DatabasePointDiscord, discord.CollectionRoles, []mongo.IndexModel{guildID}},
		{discord.DatabasePointDiscord, discord.CollectionEvents, []mongo.IndexModel{guildID}},
	}

	for _, p := range plans {
		if _, err := client.Database(p.database).Collection(p.collection).Indexes().CreateMany(ctx, p.models); err != nil {
			return fmt.Errorf("%s.%s: %w", p.database, p.collection, err)
		}
	}
	return nil
}

// mongoIndex builds a named, non-unique index model.
func mongoIndex(name string, keys bson.D) mongo.IndexModel {
	return mongo.IndexModel{Keys: keys, Options: options.Index().SetName(name)}
}
