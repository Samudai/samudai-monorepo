package deal

import (
	"context"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-forms/pkg/deal"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func CreateResponse(response deal.FormResponse) (string, error) {
	db := db.GetMongo()
	database := db.Database(deal.DatabaseForm)

	response.ResponseID = primitive.NewObjectID()
	response.CreatedAt = getTime()

	responseID, err := database.Collection(deal.CollectionResponse).InsertOne(context.Background(), response)
	if err != nil {
		return "", err
	}

	return responseID.InsertedID.(primitive.ObjectID).Hex(), nil
}

func GetResponseByID(responseID string) (deal.FormResponse, error) {
	db := db.GetMongo()
	database := db.Database(deal.DatabaseForm)

	var response deal.FormResponse
	objectID, err := primitive.ObjectIDFromHex(responseID)
	if err != nil {
		return response, err
	}

	err = database.Collection(deal.CollectionResponse).FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&response)
	if err != nil {
		return response, err
	}

	return response, nil
}

func GetResponseByFormID(formID string) ([]deal.FormResponse, error) {
	db := db.GetMongo()
	database := db.Database(deal.DatabaseForm)

	var responses []deal.FormResponse
	cursor, err := database.Collection(deal.CollectionResponse).Find(context.Background(), bson.M{"form_id": formID}, &options.FindOptions{Sort: bson.M{"created_at": -1}})
	if err != nil {
		return responses, err
	}

	err = cursor.All(context.Background(), &responses)
	if err != nil {
		return responses, err
	}

	return responses, nil
}

func DeleteResponse(responseID string) error {
	db := db.GetMongo()
	database := db.Database(deal.DatabaseForm)

	objectID, err := primitive.ObjectIDFromHex(responseID)
	if err != nil {
		return err
	}

	_, err = database.Collection(deal.CollectionResponse).DeleteOne(context.Background(), bson.M{"_id": objectID})
	if err != nil {
		return err
	}

	return nil
}
