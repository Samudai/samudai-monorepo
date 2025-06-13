package gcal

import (
	"context"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-plugin/pkg/gcal"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/oauth2"
)

func SaveAuth(memberID string, token *oauth2.Token) error {
	db := db.GetMongo()
	database := db.Database(gcal.DatabaseGcal)

	email, err := fetchEmail(token)
	if err != nil {
		return err
	}

	memberData := gcal.MemberData{
		LinkID: memberID,
		Token:  token,
		Email:  email,
	}

	_, err = database.Collection(gcal.CollectionData).UpdateOne(context.Background(), bson.M{"_id": memberID}, bson.M{"$set": memberData}, &options.UpdateOptions{Upsert: &[]bool{true}[0]})
	if err != nil {
		return err
	}

	logger.LogMessage("info", "saved gcal token for member: %s", memberID)
	return nil
}

func GetAuth(memberID string) (*oauth2.Token, *string, error) {
	db := db.GetMongo()
	database := db.Database(gcal.DatabaseGcal)

	var memberData gcal.MemberData
	err := database.Collection(gcal.CollectionData).FindOne(context.Background(), bson.M{"_id": memberID}).Decode(&memberData)
	if err != nil {
		return nil, nil, err
	}

	return memberData.Token, &memberData.Email, nil
}

func CheckMemberGcalExists(memberID string) (bool, *string, error) {
	db := db.GetMongo()
	database := db.Database(gcal.DatabaseGcal)

	var memberData gcal.MemberData
	err := database.Collection(gcal.CollectionData).FindOne(context.Background(), bson.M{"_id": memberID}).Decode(&memberData)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return false, nil, nil
		}
		return false, nil, err
	}

	return true, &memberData.Email, nil
}

func DeleteAccess(memberID string) error {
	db := db.GetMongo()
	database := db.Database(gcal.DatabaseGcal)

	_, err := database.Collection(gcal.CollectionData).DeleteOne(context.Background(), bson.M{"_id": memberID})
	if err != nil {
		return err
	}

	return nil
}
