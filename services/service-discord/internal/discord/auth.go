package discord

import (
	"context"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-discord/pkg/discord"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func Auth(redirectURI, code, memberID string) (discord.AuthData, error) {
	db := db.GetMongo()
	database := db.Database(discord.DatabaseDiscord)

	var result discord.AuthData
	cursor := database.Collection(discord.CollectionAuth).FindOne(context.Background(), bson.M{"_id": memberID})

	if err := cursor.Err(); err != nil {
		token, err := DiscordAuth(redirectURI, code)
		if err != nil {
			return result, err
		}

		if token.Accesstoken != "" {
			logger.LogMessage("info", "discord access token fetched successfully!")
			data := discord.AuthData{
				MemberID: memberID,
				Token:    *token,
			}
			err = SaveAuthData(data)
			if err != nil {
				return result, err
			}
			return data, nil
		}
	}

	if err := cursor.Decode(&result); err != nil {
		return result, err
	}

	logger.LogMessage("info", "discord: auth data found for member: %s", memberID)

	return result, nil
}

func SaveAuthData(data discord.AuthData) error {
	db := db.GetMongo()
	database := db.Database(discord.DatabaseDiscord)

	// upsert
	_, err := database.Collection(discord.CollectionAuth).UpdateOne(context.Background(), bson.M{"_id": data.MemberID}, bson.M{"$set": data}, &options.UpdateOptions{Upsert: &[]bool{true}[0]})
	if err != nil {
		return err
	}

	return nil
}

// Point 

func AuthPoint(redirectURI, code, memberID string) (discord.AuthData, error) {
	db := db.GetMongo()
	database := db.Database(discord.DatabasePointDiscord)

	var result discord.AuthData
	cursor := database.Collection(discord.CollectionAuth).FindOne(context.Background(), bson.M{"_id": memberID})

	if err := cursor.Err(); err != nil {
		token, err := DiscordAuth(redirectURI, code)
		if err != nil {
			return result, err
		}

		if token.Accesstoken != "" {
			logger.LogMessage("info", "discord access token fetched successfully!")
			data := discord.AuthData{
				MemberID: memberID,
				Token:    *token,
			}
			err = SaveAuthDataPoint(data)
			if err != nil {
				return result, err
			}
			return data, nil
		}
	}

	if err := cursor.Decode(&result); err != nil {
		return result, err
	}

	logger.LogMessage("info", "discord: auth data found for member: %s", memberID)

	return result, nil
}

func SaveAuthDataPoint(data discord.AuthData) error {
	db := db.GetMongo()
	database := db.Database(discord.DatabasePointDiscord)

	// upsert
	_, err := database.Collection(discord.CollectionAuth).UpdateOne(context.Background(), bson.M{"_id": data.MemberID}, bson.M{"$set": data}, &options.UpdateOptions{Upsert: &[]bool{true}[0]})
	if err != nil {
		return err
	}

	return nil
}

