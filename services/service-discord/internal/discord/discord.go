package discord

import (
	"context"
	"fmt"
	"log"
	"sort"
	"time"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-discord/pkg/discord"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// AddUpdateDiscord adds discord guilds to the database
func AddUpdateDiscord(params discord.Guild) error {
	db := db.GetMongo()
	_, err := db.Database(discord.DatabaseDiscord).Collection(discord.CollectionGuilds).UpdateOne(context.Background(), bson.M{"_id": params.GuildID}, bson.M{"$set": params}, &options.UpdateOptions{Upsert: &[]bool{true}[0]})
	if err != nil {
		return fmt.Errorf("error adding discord: %w", err)
	}

	logger.LogMessage("info", "Added discord ID: %s", params.GuildID)
	return nil
}

// GetGuildsByUserID returns guilds by member id
func GetGuildsByUserID(userID string) ([]discord.GuildForMember, error) {
	db := db.GetMongo()
	membersCol := db.Database(discord.DatabaseDiscord).Collection(discord.CollectionMembers)

	cursor, err := membersCol.Aggregate(context.Background(), []bson.M{
		{"$lookup": bson.M{
			"from":         discord.CollectionGuilds,
			"localField":   "guild_id",
			"foreignField": "_id",
			"as":           "guildlist",
		}},
		{"$match": bson.M{"discord_user_id": userID}},
	})
	if err != nil {
		return nil, fmt.Errorf("error getting guilds by user id: %w", err)
	}

	var data []discord.GuildForMember
	if err = cursor.All(context.Background(), &data); err != nil {
		return nil, fmt.Errorf("error getting guilds by user id: %w", err)
	}

	return data, nil
}

func DeleteGuild(guildID string) error {
	db := db.GetMongo()
	_, err := db.Database(discord.DatabaseDiscord).Collection(discord.CollectionGuilds).DeleteOne(context.Background(), bson.M{"_id": guildID})
	if err != nil {
		return fmt.Errorf("error deleting guild: %w", err)
	}

	logger.LogMessage("info", "Deleted guild ID: %s", guildID)

	_, err = db.Database(discord.DatabaseDiscord).Collection(discord.CollectionMembers).DeleteMany(context.Background(), bson.M{"guild_id": guildID})
	if err != nil {
		return fmt.Errorf("error deleting members: %w", err)
	}

	logger.LogMessage("info", "Deleted members for guild ID: %s", guildID)

	_, err = db.Database(discord.DatabaseDiscord).Collection(discord.CollectionRoles).DeleteMany(context.Background(), bson.M{"guild_id": guildID})
	if err != nil {
		return fmt.Errorf("error deleting roles: %w", err)
	}

	logger.LogMessage("info", "Deleted roles for guild ID: %s", guildID)

	return nil
}

func DisconnectMem(memberID string) error {
	db := db.GetMongo()
	_, err := db.Database(discord.DatabaseDiscord).Collection(discord.CollectionAuth).DeleteOne(context.Background(), bson.M{"_id": memberID})
	if err != nil {
		return fmt.Errorf("error deleting auth Data: %w", err)
	}

	logger.LogMessage("info", "Deleted Auth Data: %s", memberID)

	return nil
}

// Point

// AddUpdateDiscord adds discord guilds to the database
func AddUpdateDiscordPoint(params discord.Guild) error {
	db := db.GetMongo()
	_, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionGuilds).UpdateOne(context.Background(), bson.M{"_id": params.GuildID}, bson.M{"$set": params}, &options.UpdateOptions{Upsert: &[]bool{true}[0]})
	if err != nil {
		return fmt.Errorf("error adding discord: %w", err)
	}

	logger.LogMessage("info", "Added discord ID: %s", params.GuildID)
	return nil
}

// Adds a collection for activity if doesnt exist then creates one and adds activity
func AddActivityGuild(params discord.ActivityGuild) error {
	db := db.GetMongo()
	now := time.Now()
	params.CreatedAt = &now
	_, err := db.Database(discord.DatabasePointDiscordActivity).Collection(params.PointId).InsertOne(context.TODO(), params)
	if err != nil {
		return fmt.Errorf("error adding guild activity: %w", err)
	}
	logger.LogMessage("info", "Added Activity Guild: %s", params.PointId)
	return nil
}

// Fetchlast24hrs total points for every guild
func AddGuildMetric() error {
	db := db.GetMongo()
	now := time.Now()
	before := now.Add(-24 * time.Hour)
	pipeline := []bson.M{
		{"$match": bson.M{
			"created_at": bson.M{
				"$gte": before,
				"$lt":  now,
			},
		}},
		{"$group": bson.M{
			"_id": "$point_id",
			"totalPoints": bson.M{
				"$sum": "$points",
			},
		}},
	}
	collections, err := db.Database(discord.DatabasePointDiscordActivity).ListCollectionNames(context.TODO(), bson.M{})
	if err != nil {
		return fmt.Errorf("error listing collections: %w", err)
	}
	for _, collectionName := range collections {
		var params discord.MetricsData
		cursor, err := db.Database(discord.DatabasePointDiscordActivity).Collection(collectionName).Aggregate(context.TODO(), pipeline)
		if err != nil {
			return fmt.Errorf("error executing aggregation pipeline for collection %s: %w", collectionName, err)
		}
		defer cursor.Close(context.TODO())

		// Iterate over the results
		var results []bson.M
		if err = cursor.All(context.TODO(), &results); err != nil {
			return fmt.Errorf("error iterating over results for collection %s: %w", collectionName, err)
		}
		// Process the results
		for _, result := range results {
			fmt.Printf("Collection: %s, Guild ID: %v, Total Points: %v\n", collectionName, result["_id"], result["totalPoints"])
			params.PointID = result["_id"].(string)
			params.TotalPoints = result["totalPoints"].(float64)
		}
		filter := bson.M{
			"point_id": collectionName,
			"points_num": bson.M{
				"$gt": 0,
			},
		}
		count, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).CountDocuments(context.TODO(), filter)
		if err != nil {
			return fmt.Errorf("error counting documents: %w", err)
		}
		params.UniquePointHolders = count
		params.CreatedAt = &now
		_, err = db.Database(discord.DatabaseGuildMetrics).Collection(collectionName).InsertOne(context.TODO(), params)
		if err != nil {
			return fmt.Errorf("error counting documents: %w", err)
		}
	}
	return nil
}
func RemoveDuplicate() error {
	db := db.GetMongo()
	collections, err := db.Database(discord.DatabaseGuildMetrics).ListCollectionNames(context.TODO(), bson.M{})
	if err != nil {
		return fmt.Errorf("error listing collections: %w", err)
	}

	// Define the start and end of the range (today and tomorrow)
	now := time.Now()
	gmtLoc, err := time.LoadLocation("GMT")
	if err != nil {
		return fmt.Errorf("error loading GMT location: %w", err)
	}

	startOfRange := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, gmtLoc)
	for _, collectionName := range collections {
		// Construct the aggregation pipeline
		pipeline := mongo.Pipeline{
			// Match documents created between today and tomorrow
			bson.D{{
				Key: "$match", Value: bson.D{
					{Key: "created_at", Value: bson.D{
						{Key: "$gte", Value: startOfRange},
					}},
				},
			}},
			// Group by guild_id and keep the first document of each group
			bson.D{{
				Key: "$group", Value: bson.D{
					{Key: "_id", Value: "$point_id"},
					{Key: "docs", Value: bson.D{{Key: "$push", Value: "$$ROOT"}}},
				},
			}},
			// Sort by created_at to ensure the first document is indeed the earliest
			bson.D{{
				Key: "$sort", Value: bson.D{
					{Key: "docs.created_at", Value: 1},
				},
			}},
		}

		cursor, err := db.Database(discord.DatabaseGuildMetrics).Collection(collectionName).Aggregate(context.TODO(), pipeline)
		if err != nil {
			return fmt.Errorf("error executing aggregation pipeline for collection %s: %w", collectionName, err)
		}
		defer cursor.Close(context.TODO())

		var results []bson.M
		if err = cursor.All(context.TODO(), &results); err != nil {
			return fmt.Errorf("error iterating over results for collection %s: %w", collectionName, err)
		}

		// Process the results
		for _, result := range results {
			docs := result["docs"].(primitive.A)
			if len(docs) > 1 {
				for _, doc := range docs[1:] {
					docMap := doc.(bson.M)
					_, err := db.Database(discord.DatabaseGuildMetrics).Collection(collectionName).DeleteOne(context.TODO(), bson.M{"_id": docMap["_id"]})
					if err != nil {
						return fmt.Errorf("error deleting duplicate document in collection %s: %w", collectionName, err)
					}
				}
			}

		}

	}

	logger.LogMessage("info", "Successfully fetched documents from all collections in the database")
	return nil
}

func GetGuildMetric(days int, pointId string) ([]discord.MetricsData, error) {
	db := db.GetMongo()

	now := time.Now()
	startDate := now.AddDate(0, 0, -days)
	filter := bson.M{
		"point_id": pointId,
		"created_at": bson.M{
			"$gte": startDate,
		},
	}
	var results []discord.MetricsData
	cursor, err := db.Database(discord.DatabaseGuildMetrics).Collection(pointId).Find(context.TODO(), filter)
	if err != nil {
		return nil, fmt.Errorf("error fetching guild metrics: %w", err)
	}
	defer cursor.Close(context.TODO())

	if err = cursor.All(context.TODO(), &results); err != nil {
		return nil, fmt.Errorf("error decoding guild metrics: %w", err)
	}
	return results, nil

}

// Adds a collection for member activity if doesnt exist then creates one and adds activity
func AddMemberActivity(params discord.ActivityGuild) error {
	db := db.GetMongo()
	now := time.Now()
	params.CreatedAt = &now
	_, err := db.Database(discord.DatabasePointMemberActivity).Collection(*params.To).InsertOne(context.TODO(), params)
	if err != nil {
		return fmt.Errorf("error adding member activity: %w", err)
	}
	logger.LogMessage("info", "Added Member Activity: %s", *params.GuildID)
	return nil
}
func AddMemberIDActivity(params discord.ActivityGuild) error {
	db := db.GetMongo()
	now := time.Now()
	params.CreatedAt = &now
	_, err := db.Database(discord.DatabaseMember).Collection(*params.MemberID).InsertOne(context.TODO(), params)
	if err != nil {
		return fmt.Errorf("error adding member activity: %w", err)
	}
	logger.LogMessage("info", "Added Member Activity: %s", params.PointId)
	return nil
}

// Adds a collection for member activity if doesnt exist then creates one and adds activity
func AddWalletActivity(params discord.ActivityWallet) error {
	db := db.GetMongo()
	now := time.Now()
	params.CreatedAt = &now
	_, err := db.Database(discord.DatabasePointWalletActivity).Collection(params.WalletAddress).InsertOne(context.TODO(), params)
	if err != nil {
		return fmt.Errorf("error adding wallet activity: %w", err)
	}
	logger.LogMessage("info", "Added Wallet Activity: %s", params.WalletAddress)
	return nil
}
func DropCollections(params discord.MergeActivityV2) error {
	db := db.GetMongo()
	if params.MergeType == discord.MergeTypeDiscord && params.DiscordID != nil {
		discordCollection := db.Database(discord.DatabasePointMemberActivity).Collection(*params.DiscordID)
		err := discordCollection.Drop(context.TODO())
		if err != nil {
			return fmt.Errorf("error dropping discord collection: %w", err)
		}
		log.Printf("Dropped the discord collection for discordId: %s", *params.DiscordID)
	} else if params.MergeType == discord.MergeTypeWallet && params.WalletMergeAddress != nil {
		walletAddressCollection := db.Database(discord.DatabasePointWalletActivity).Collection(*params.WalletMergeAddress)
		err := walletAddressCollection.Drop(context.TODO())
		if err != nil {
			return fmt.Errorf("error dropping walletAddress collection: %w", err)
		}

		log.Printf("Dropped the walletAddress collection for address: %s", *params.WalletMergeAddress)
	} else if params.MergeType == discord.MergeTypeCustomProduct && params.ProductID != nil && params.UniqueUserId != nil {
		customProductCollection := db.Database(*params.ProductID).Collection(*params.UniqueUserId)
		err := customProductCollection.Drop(context.TODO())
		if err != nil {
			return fmt.Errorf("error dropping custom product collection: %w", err)
		}

		log.Printf("Dropped the custom product collection for productId: %s and member: %s", *params.ProductID, *params.UniqueUserId)
	} else if params.MergeType == discord.MergeTypeTelegram && params.JoineeChatId != nil {
		discordCollection := db.Database(discord.DatabasePointTelegramActivity).Collection(*params.JoineeChatId)
		err := discordCollection.Drop(context.TODO())
		if err != nil {
			return fmt.Errorf("error dropping telegram collection: %w", err)
		}
		log.Printf("Dropped the telegram collection for telegramId: %s", *params.JoineeChatId)
	} else if params.MergeType == discord.MergeTypeTwitter && params.TwitterUserId != nil {
		discordCollection := db.Database(discord.DatabasePointTwitterActivity).Collection(*params.TwitterUserId)
		err := discordCollection.Drop(context.TODO())
		if err != nil {
			return fmt.Errorf("error dropping twitter collection: %w", err)
		}
		log.Printf("Dropped the twitter collection for twitterId: %s", *params.TwitterUserId)
	}
	return nil
}
func MergeActivityV2(params discord.MergeActivityV2) error {
	db := db.GetMongo()
	// Combined Activity array
	var combinedResults []discord.ActivityGuild

	// Based on the merge type fetch the activity collection
	// 1.1 Merge type: Discord
	// 1.2 Merge type: Wallet
	// 1.3 Merge type: Custom Product
	// 1.4 Merge type: Telegram
	// 1.5 Merge type: Twitter
	if params.MergeType == discord.MergeTypeDiscord && params.DiscordID != nil {
		filter := bson.M{}
		cursor, err := db.Database(discord.DatabasePointMemberActivity).Collection(*params.DiscordID).Find(context.TODO(), filter)
		if err != nil {
			return fmt.Errorf("error fetching discord collection: %w", err)
		}
		defer cursor.Close(context.TODO())

		for cursor.Next(context.TODO()) {
			var singleResult discord.ActivityGuild
			singleResult.MemberID = &params.MemberID
			err := cursor.Decode(&singleResult)
			if err != nil {
				return fmt.Errorf("error decoding discord activity: %w", err)
			}
			combinedResults = append(combinedResults, singleResult)
		}

		if err := cursor.Err(); err != nil {
			return fmt.Errorf("error iterating over cursor: %w", err)
		}

		log.Printf("Discord Activity Data: %v", combinedResults)
	} else if params.MergeType == discord.MergeTypeWallet && params.WalletMergeAddress != nil {
		filter := bson.M{}
		cursor, err := db.Database(discord.DatabasePointWalletActivity).Collection(*params.WalletMergeAddress).Find(context.TODO(), filter)
		if err != nil {
			return fmt.Errorf("error fetching wallet collection: %w", err)
		}
		defer cursor.Close(context.TODO())

		for cursor.Next(context.TODO()) {
			var singleResult discord.ActivityGuild
			err := cursor.Decode(&singleResult)
			if err != nil {
				return fmt.Errorf("error decoding wallet activity: %w", err)
			}
			singleResult.MemberID = &params.MemberID
			combinedResults = append(combinedResults, singleResult)
		}

		if err := cursor.Err(); err != nil {
			return fmt.Errorf("error iterating over cursor: %w", err)
		}

		log.Printf("Wallet Acttivity data: %v", combinedResults)

	} else if params.MergeType == discord.MergeTypeCustomProduct && params.ProductID != nil && params.UniqueUserId != nil {
		filter := bson.M{}
		cursor, err := db.Database(*params.ProductID).Collection(*params.UniqueUserId).Find(context.TODO(), filter)
		if err != nil {
			return fmt.Errorf("error fetching custom product collection: %w", err)
		}
		defer cursor.Close(context.TODO())

		for cursor.Next(context.TODO()) {
			var singleResult discord.ActivityGuild
			err := cursor.Decode(&singleResult)
			if err != nil {
				return fmt.Errorf("error decoding custom product activity: %w", err)
			}
			singleResult.MemberID = &params.MemberID
			combinedResults = append(combinedResults, singleResult)
		}

		if err := cursor.Err(); err != nil {
			return fmt.Errorf("error iterating over cursor: %w", err)
		}

		log.Printf("Custom Product data: %v", combinedResults)
	} else if params.MergeType == discord.MergeTypeTelegram && params.JoineeChatId != nil {
		filter := bson.M{}
		cursor, err := db.Database(discord.DatabasePointTelegramActivity).Collection(*params.JoineeChatId).Find(context.TODO(), filter)
		if err != nil {
			return fmt.Errorf("error fetching telegram collection: %w", err)
		}
		defer cursor.Close(context.TODO())

		for cursor.Next(context.TODO()) {
			var singleResult discord.ActivityGuild
			err := cursor.Decode(&singleResult)
			if err != nil {
				return fmt.Errorf("error decoding telegram activity: %w", err)
			}
			singleResult.MemberID = &params.MemberID
			combinedResults = append(combinedResults, singleResult)
		}

		if err := cursor.Err(); err != nil {
			return fmt.Errorf("error iterating over cursor: %w", err)
		}

		log.Printf("Telegram Activity Data: %v", combinedResults)
	} else if params.MergeType == discord.MergeTypeTwitter && params.TwitterUserId != nil {
		filter := bson.M{}
		cursor, err := db.Database(discord.DatabasePointTwitterActivity).Collection(*params.TwitterUserId).Find(context.TODO(), filter)
		if err != nil {
			return fmt.Errorf("error fetching twitter collection: %w", err)
		}
		defer cursor.Close(context.TODO())

		for cursor.Next(context.TODO()) {
			var singleResult discord.ActivityGuild
			err := cursor.Decode(&singleResult)
			if err != nil {
				return fmt.Errorf("error decoding twitter activity: %w", err)
			}
			singleResult.MemberID = &params.MemberID
			combinedResults = append(combinedResults, singleResult)
		}

		if err := cursor.Err(); err != nil {
			return fmt.Errorf("error iterating over cursor: %w", err)
		}

		log.Printf("Twitter Activity Data: %v", combinedResults)
	}

	interfaceCombinedResults := make([]interface{}, len(combinedResults))
	for i, result := range combinedResults {
		interfaceCombinedResults[i] = result
	}

	collection := db.Database(discord.DatabaseMember).Collection(params.MemberID)

	insertResult, err := collection.InsertMany(context.TODO(), interfaceCombinedResults)
	if err != nil {
		return fmt.Errorf("error inserting documents: %w", err)
	}
	DropCollections(params)
	log.Printf("Inserted %v documents into the member_id collection", insertResult.InsertedIDs)
	return nil

}

func AddCustomActivity(params discord.ActivityCustom) error {
	db := db.GetMongo()
	now := time.Now()
	params.CreatedAt = &now
	_, err := db.Database(params.ProductId).Collection(params.UniqueUserId).InsertOne(context.TODO(), params)
	if err != nil {
		return fmt.Errorf("error adding custom activity: %w", err)
	}
	logger.LogMessage("info", "Added Custom Activity: %s", params.PointId)
	return nil
}

func AddTelegramActivity(params discord.ActivityTelegram) error {
	db := db.GetMongo()
	now := time.Now()
	params.CreatedAt = &now
	_, err := db.Database(discord.DatabasePointTelegramActivity).Collection(params.JoineeChatId).InsertOne(context.TODO(), params)
	if err != nil {
		return fmt.Errorf("error adding Telegram activity: %w", err)
	}
	logger.LogMessage("info", "Added Telegram Activity: %s", *params.PointId)
	return nil
}

func AddTwitterActivity(params discord.ActivityTwitter) error {
	db := db.GetMongo()
	now := time.Now()
	params.CreatedAt = &now
	_, err := db.Database(discord.DatabasePointTwitterActivity).Collection(params.ToTwitterUserId).InsertOne(context.TODO(), params)
	if err != nil {
		return fmt.Errorf("error adding Twitter activity: %w", err)
	}
	logger.LogMessage("info", "Added Twitter Activity: %s", params.PointId)
	return nil
}

func MergeActivity(params discord.Merge) error {
	db := db.GetMongo()

	var combinedResults []discord.ActivityGuild

	if params.UserID != nil && *params.UserID != "" {
		filter := bson.M{}
		cursor, err := db.Database(discord.DatabasePointMemberActivity).Collection(*params.UserID).Find(context.TODO(), filter)
		if err != nil {
			return fmt.Errorf("error fetching guild metrics: %w", err)
		}
		defer cursor.Close(context.TODO())

		for cursor.Next(context.TODO()) {
			var singleResult discord.ActivityGuild
			err := cursor.Decode(&singleResult)
			if err != nil {
				return fmt.Errorf("error decoding guild metrics: %w", err)
			}
			combinedResults = append(combinedResults, singleResult)
		}

		if err := cursor.Err(); err != nil {
			return fmt.Errorf("error iterating over cursor: %w", err)
		}

		log.Printf("User ID data: %v", combinedResults)
	}

	if params.WalletAddress != nil && len(*params.WalletAddress) > 0 {
		for _, address := range *params.WalletAddress {
			filter := bson.M{}
			cursor, err := db.Database(discord.DatabasePointWalletActivity).Collection(address).Find(context.TODO(), filter)
			if err != nil {
				return fmt.Errorf("error fetching guild metrics: %w", err)
			}
			defer cursor.Close(context.TODO())

			for cursor.Next(context.TODO()) {
				var singleResult discord.ActivityGuild
				err := cursor.Decode(&singleResult)
				if err != nil {
					return fmt.Errorf("error decoding guild metrics: %w", err)
				}
				singleResult.MemberID = params.MemberID
				combinedResults = append(combinedResults, singleResult)
			}

			if err := cursor.Err(); err != nil {
				return fmt.Errorf("error iterating over cursor: %w", err)
			}

			log.Printf("User ID data: %v", combinedResults)
		}
	}

	sort.Slice(combinedResults, func(i, j int) bool {
		return combinedResults[i].CreatedAt.Before(*combinedResults[j].CreatedAt)
	})

	interfaceCombinedResults := make([]interface{}, len(combinedResults))
	for i, result := range combinedResults {
		interfaceCombinedResults[i] = result
	}

	collection := db.Database(discord.DatabaseMember).Collection(*params.MemberID)

	insertResult, err := collection.InsertMany(context.TODO(), interfaceCombinedResults)
	if err != nil {
		return fmt.Errorf("error inserting documents: %w", err)
	}

	log.Printf("Inserted %v documents into the member_id collection", insertResult.InsertedIDs)

	if params.UserID != nil {
		userIDCollection := db.Database(discord.DatabasePointMemberActivity).Collection(*params.UserID)
		err = userIDCollection.Drop(context.TODO())
		if err != nil {
			return fmt.Errorf("error dropping userID collection: %w", err)
		}
	}

	log.Printf("Dropped the userID collection")

	if params.WalletAddress != nil {
		for _, address := range *params.WalletAddress {
			walletAddressCollection := db.Database(discord.DatabasePointWalletActivity).Collection(address)
			err = walletAddressCollection.Drop(context.TODO())
			if err != nil {
				return fmt.Errorf("error dropping walletAddress collection: %w", err)
			}

			log.Printf("Dropped the walletAddress collection for address: %s", address)
		}
	}

	return nil
}

// GetGuildsByUserID returns guilds by member id
func GetGuildsByUserIDPoint(userID string) ([]discord.GuildForMemberPoint, error) {
	db := db.GetMongo()
	membersCol := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers)

	cursor, err := membersCol.Aggregate(context.Background(), []bson.M{
		{"$lookup": bson.M{
			"from":         discord.CollectionGuilds,
			"localField":   "guild_id",
			"foreignField": "_id",
			"as":           "guildlist",
		}},
		{"$match": bson.M{"discord_user_id": userID}},
	})
	if err != nil {
		return nil, fmt.Errorf("error getting guilds by user id: %w", err)
	}

	var data []discord.GuildForMemberPoint
	if err = cursor.All(context.Background(), &data); err != nil {
		return nil, fmt.Errorf("error getting guilds by user id: %w", err)
	}

	return data, nil
}
func GuildByDiscordIdGuildId(userID string, guildID string) ([]discord.GuildForMemberPoint, error) {
	db := db.GetMongo()
	membersCol := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers)

	var result []discord.GuildForMemberPoint
	cursor, err := membersCol.Aggregate(context.Background(), []bson.M{
		{"$lookup": bson.M{
			"from":         discord.CollectionGuilds,
			"localField":   "guild_id",
			"foreignField": "_id",
			"as":           "guildlist",
		}},
		{"$match": bson.M{"discord_user_id": userID, "guild_id": guildID}},
	})
	if err != nil {
		return nil, fmt.Errorf("error finding guild by user ID and guild ID: %w", err)
	}
	if err = cursor.All(context.Background(), &result); err != nil {
		return nil, fmt.Errorf("error finding guild by user ID and guild ID: %w", err)
	}

	return result, nil
}

func DeleteGuildPoint(guildID string) error {
	db := db.GetMongo()
	_, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionGuilds).DeleteOne(context.Background(), bson.M{"_id": guildID})
	if err != nil {
		return fmt.Errorf("error deleting guild: %w", err)
	}

	logger.LogMessage("info", "Deleted guild ID: %s", guildID)

	_, err = db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).DeleteMany(context.Background(), bson.M{"guild_id": guildID})
	if err != nil {
		return fmt.Errorf("error deleting members: %w", err)
	}

	logger.LogMessage("info", "Deleted members for guild ID: %s", guildID)

	_, err = db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionRoles).DeleteMany(context.Background(), bson.M{"guild_id": guildID})
	if err != nil {
		return fmt.Errorf("error deleting roles: %w", err)
	}

	logger.LogMessage("info", "Deleted roles for guild ID: %s", guildID)

	return nil
}

func DisconnectMemPoint(memberID string) error {
	db := db.GetMongo()
	_, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionAuth).DeleteOne(context.Background(), bson.M{"_id": memberID})
	if err != nil {
		return fmt.Errorf("error deleting auth Data: %w", err)
	}

	logger.LogMessage("info", "Deleted Auth Data: %s", memberID)

	return nil
}
