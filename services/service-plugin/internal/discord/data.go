package discord

import (
	"context"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-discord/pkg/discord"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func CheckMemberDiscordExists(discordID string) (bool, *string, error) {
	db := db.GetMongo()
	database := db.Database(discord.DatabaseDiscord)

	var memberData discord.Member
	err := database.Collection(discord.CollectionMembers).FindOne(context.Background(), bson.M{"discord_user_id": discordID}).Decode(&memberData)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return false, nil, nil
		}
		return false, nil, err
	}

	return true, &memberData.Username, nil
}
