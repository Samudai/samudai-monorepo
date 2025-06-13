package discord

import (
	"context"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-discord/pkg/discord"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func AddEvent(guildID string, events []discord.Event) error {
	db := db.GetMongo()

	if len(events) == 0 {
		return nil
	}

	data := make([]interface{}, len(events))
	for i, event := range events {
		event.ExpiresAt = event.ScheduledEndTimestamp
		event.Users = []discord.UserData{}
		data[i] = event
	}

	_, err := db.Database(discord.DatabaseDiscord).Collection(discord.CollectionEvents).InsertMany(context.Background(), data)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Added events to database")
	return nil
}

func UpdateEvent(guildID string, event discord.Event) error {
	db := db.GetMongo()

	event.ExpiresAt = event.ScheduledEndTimestamp
	_, err := db.Database(discord.DatabaseDiscord).Collection(discord.CollectionEvents).UpdateOne(context.Background(), bson.M{"_id": event.ID, "guild_id": guildID}, bson.M{"$set": event})
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Updated event in database %s", event.ID)
	return nil
}

func DeleteEvent(eventID string) error {
	db := db.GetMongo()

	_, err := db.Database(discord.DatabaseDiscord).Collection(discord.CollectionEvents).DeleteOne(context.Background(), bson.M{"_id": eventID})
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Deleted event from database %s", eventID)
	return nil
}

func AddUserToEvent(eventID string, user discord.UserData) error {
	db := db.GetMongo()
	database := db.Database(discord.DatabaseDiscord)

	_, err := database.Collection(discord.CollectionEvents).UpdateOne(context.Background(), bson.M{"_id": eventID}, bson.M{"$push": bson.M{"users": user}})
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Added user to event %s", eventID)
	return nil
}

func RemoveUserFromEvent(eventID string, userID string) error {
	db := db.GetMongo()
	database := db.Database(discord.DatabaseDiscord)

	_, err := database.Collection(discord.CollectionEvents).UpdateOne(context.Background(), bson.M{"_id": eventID}, bson.M{"$pull": bson.M{"users": bson.M{"user_id": userID}}})
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Removed user from event %s", eventID)
	return nil
}

func GetEventsByGuildID(guildID string) ([]discord.Event, error) {
	db := db.GetMongo()

	var events []discord.Event
	cursor, err := db.Database(discord.DatabaseDiscord).Collection(discord.CollectionEvents).Find(context.Background(), bson.M{"guild_id": guildID})
	if err != nil {
		return nil, err
	}

	if err = cursor.All(context.Background(), &events); err != nil {
		return nil, err
	}

	logger.LogMessage("info", "Fetched events for guild %s", guildID)
	return events, nil
}

func GetEventsByUserID(userID string) ([]discord.Event, error) {
	db := db.GetMongo()

	var events []discord.Event
	cursor, err := db.Database(discord.DatabaseDiscord).Collection(discord.CollectionEvents).Find(context.Background(), bson.M{"users": bson.M{
		"$elemMatch": bson.M{"_id": userID},
	}})

	if err != nil {
		return nil, err
	}

	if err = cursor.All(context.Background(), &events); err != nil {
		return nil, err
	}

	logger.LogMessage("info", "Fetched events for user %s", userID)
	return events, nil
}

// Point

func AddEventPoint(guildID string, events []discord.Event) error {
	db := db.GetMongo()

	if len(events) == 0 {
		return nil
	}

	data := make([]interface{}, len(events))
	for i, event := range events {
		event.ExpiresAt = event.ScheduledEndTimestamp
		event.Users = []discord.UserData{}
		data[i] = event
	}

	_, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionEvents).InsertMany(context.Background(), data)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Added events to database")
	return nil
}

func UpdateEventPoint(guildID string, event discord.Event) error {
	db := db.GetMongo()

	event.ExpiresAt = event.ScheduledEndTimestamp
	_, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionEvents).UpdateOne(context.Background(), bson.M{"_id": event.ID, "guild_id": guildID}, bson.M{"$set": event})
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Updated event in database %s", event.ID)
	return nil
}

func DeleteEventPoint(eventID string) error {
	db := db.GetMongo()

	_, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionEvents).DeleteOne(context.Background(), bson.M{"_id": eventID})
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Deleted event from database %s", eventID)
	return nil
}

func AddUserToEventPoint(eventID string, user discord.UserData) error {
	db := db.GetMongo()
	database := db.Database(discord.DatabasePointDiscord)

	_, err := database.Collection(discord.CollectionEvents).UpdateOne(context.Background(), bson.M{"_id": eventID}, bson.M{"$push": bson.M{"users": user}})
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Added user to event %s", eventID)
	return nil
}

func RemoveUserFromEventPoint(eventID string, userID string) error {
	db := db.GetMongo()
	database := db.Database(discord.DatabasePointDiscord)

	_, err := database.Collection(discord.CollectionEvents).UpdateOne(context.Background(), bson.M{"_id": eventID}, bson.M{"$pull": bson.M{"users": bson.M{"user_id": userID}}})
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Removed user from event %s", eventID)
	return nil
}

func GetEventsByGuildIDPoint(guildID string) ([]discord.Event, error) {
	db := db.GetMongo()

	var events []discord.Event
	cursor, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionEvents).Find(context.Background(), bson.M{"guild_id": guildID})
	if err != nil {
		return nil, err
	}

	if err = cursor.All(context.Background(), &events); err != nil {
		return nil, err
	}

	logger.LogMessage("info", "Fetched events for guild %s", guildID)
	return events, nil
}

func GetEventsByUserIDPoint(userID string) ([]discord.Event, error) {
	db := db.GetMongo()

	var events []discord.Event
	cursor, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionEvents).Find(context.Background(), bson.M{"users": bson.M{
		"$elemMatch": bson.M{"_id": userID},
	}})

	if err != nil {
		return nil, err
	}

	if err = cursor.All(context.Background(), &events); err != nil {
		return nil, err
	}

	logger.LogMessage("info", "Fetched events for user %s", userID)
	return events, nil
}
func GetRecentActivity(point_id string, limit int, page_number int) (discord.ActivityRes, error) {
	db := db.GetMongo()

	var activity discord.ActivityRes
	skip := (page_number - 1) * limit
	sort := bson.D{{"created_at", -1}}
	cursor, err := db.Database(discord.DatabasePointDiscordActivity).Collection(point_id).Find(context.TODO(), bson.M{}, options.Find().SetSort(sort).SetSkip(int64(skip)).SetLimit(int64(limit)))
	if err != nil {
		return discord.ActivityRes{}, err
	}
	totalCount, err := db.Database(discord.DatabasePointDiscordActivity).Collection(point_id).CountDocuments(context.TODO(), bson.M{"point_id": point_id})
	if err != nil {
		return discord.ActivityRes{}, err
	}
	activity.Total = int64(totalCount)
	if err = cursor.All(context.Background(), &activity.Activity); err != nil {
		return discord.ActivityRes{}, err
	}

	logger.LogMessage("info", "Fetched recent guild activity %s", point_id)
	return activity, nil
}
func GetMemberActivity(member_id string, limit int, page_number int) (discord.ActivityRes, error) {
	db := db.GetMongo()

	var activity discord.ActivityRes
	skip := (page_number - 1) * limit
	sort := bson.D{{"created_at", -1}}
	cursor, err := db.Database(discord.DatabaseMember).Collection(member_id).Find(context.TODO(), bson.M{}, options.Find().SetSort(sort).SetSkip(int64(skip)).SetLimit(int64(limit)))
	if err != nil {
		return discord.ActivityRes{}, err
	}
	totalCount, err := db.Database(discord.DatabaseMember).Collection(member_id).CountDocuments(context.TODO(), bson.M{"member_id": member_id})
	if err != nil {
		return discord.ActivityRes{}, err
	}
	activity.Total = int64(totalCount)

	if err = cursor.All(context.Background(), &activity.Activity); err != nil {
		return discord.ActivityRes{}, err
	}

	logger.LogMessage("info", "Fetched recent member activity %s", member_id)
	return activity, nil
}

func GetLeaderBoard(pointID string, limit int, page_number int) (discord.LeaderBoardRes, error) {
	db := db.GetMongo()

	var leaderBoard discord.LeaderBoardRes
	skip := (page_number - 1) * limit
	cursor, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).Find(context.TODO(), bson.M{"point_id": pointID}, options.Find().SetSort(bson.M{"points_num": -1}).SetSkip(int64(skip)).SetLimit(int64(limit)))
	if err != nil {
		return discord.LeaderBoardRes{}, err
	}
	totalCount, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).CountDocuments(context.TODO(), bson.M{"point_id": pointID})
	if err != nil {
		return discord.LeaderBoardRes{}, err
	}
	leaderBoard.Total = int64(totalCount)
	if err = cursor.All(context.Background(), &leaderBoard.LeaderBoard); err != nil {
		return discord.LeaderBoardRes{}, err
	}

	logger.LogMessage("info", "Fetched Leaderboard %s", pointID)
	return leaderBoard, nil
}

func GetLeaderBoardByGuild(guildID string, limit int, page_number int) (discord.LeaderBoardRes, error) {
	db := db.GetMongo()

	var leaderBoard discord.LeaderBoardRes
	skip := (page_number - 1) * limit
	cursor, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).Find(context.TODO(), bson.M{"guild_id": guildID}, options.Find().SetSort(bson.M{"points_num": -1}).SetSkip(int64(skip)).SetLimit(int64(limit)))
	if err != nil {
		return discord.LeaderBoardRes{}, err
	}
	totalCount, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).CountDocuments(context.TODO(), bson.M{"guild_id": guildID})
	if err != nil {
		return discord.LeaderBoardRes{}, err
	}
	leaderBoard.Total = int64(totalCount)
	if err = cursor.All(context.Background(), &leaderBoard.LeaderBoard); err != nil {
		return discord.LeaderBoardRes{}, err
	}

	logger.LogMessage("info", "Fetched Leaderboard %s", guildID)
	return leaderBoard, nil
}

type PointRes struct {
	PointsNum int `json:"points_num" bson:"points_num"`
}

func GetCPUserPoint(productID, uniqueUserID string) (any, error) {
	db := db.GetMongo()
	filter := bson.M{
		"custom_products": bson.M{
			"$elemMatch": bson.M{
				"product_id":     productID,
				"unique_user_id": uniqueUserID,
			},
		}}

	var results PointRes

	projection := bson.M{"points_num": 1}
	err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).FindOne(context.Background(), filter, options.FindOne().SetProjection(projection)).Decode(&results)
	if err != nil {
		return 0, err
	}

	return results.PointsNum, nil
}
