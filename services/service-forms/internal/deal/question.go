package deal

import (
	"context"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-forms/pkg/deal"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreateQuestions(form deal.Form) (string, error) {
	db := db.GetMongo()
	database := db.Database(deal.DatabaseForm)

	form.FormID = primitive.NewObjectID()
	form.CreatedAt = getTime()

	result, err := database.Collection(deal.CollectionDealForm).InsertOne(context.Background(), form)
	if err != nil {
		return "", err
	}

	return result.InsertedID.(primitive.ObjectID).Hex(), nil
}

func UpdateQuestions(form deal.Form) error {
	db := db.GetMongo()
	database := db.Database(deal.DatabaseForm)

	form.UpdatedAt = getTime()

	_, err := database.Collection(deal.CollectionDealForm).UpdateOne(context.Background(), bson.M{"_id": form.FormID}, bson.M{"$set": form})
	if err != nil {
		return err
	}

	return nil
}

func GetQuestionsByFormID(formID string) (deal.Form, error) {
	db := db.GetMongo()
	database := db.Database(deal.DatabaseForm)

	var form deal.Form
	objectID, err := primitive.ObjectIDFromHex(formID)
	if err != nil {
		return form, err
	}

	err = database.Collection(deal.CollectionDealForm).FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&form)
	if err != nil {
		return form, err
	}

	return form, nil
}

func GetQuestionsByDAO(daoID string) ([]deal.Form, error) {
	db := db.GetMongo()
	database := db.Database(deal.DatabaseForm)

	var forms []deal.Form
	cursor, err := database.Collection(deal.CollectionDealForm).Find(context.Background(), bson.M{"dao_id": daoID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	if err := cursor.All(context.Background(), &forms); err != nil {
		return nil, err
	}

	return forms, nil
}

func GetQuestionsCountByDAO(daoID string) (int, error) {
	db := db.GetMongo()
	database := db.Database(deal.DatabaseForm)

	var forms []deal.Form
	cursor, err := database.Collection(deal.CollectionDealForm).Find(context.Background(), bson.M{"dao_id": daoID})
	if err != nil {
		return 0, err
	}
	defer cursor.Close(context.Background())

	if err := cursor.All(context.Background(), &forms); err != nil {
		return 0, err
	}

	return len(forms), nil
}

func DeleteQuestions(formID string) error {
	db := db.GetMongo()
	database := db.Database(deal.DatabaseForm)

	objectID, err := primitive.ObjectIDFromHex(formID)
	if err != nil {
		return err
	}

	_, err = database.Collection(deal.CollectionDealForm).DeleteOne(context.Background(), bson.M{"_id": objectID})
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Deleted form with ID: %s", formID)

	return nil
}

func GetSupportQuestions() (deal.Form, error) {
	db := db.GetMongo()
	database := db.Database(deal.DatabaseForm)

	var form deal.Form
	err := database.Collection(deal.CollectionDealForm).FindOne(context.Background(), bson.M{"type": deal.FormTypeSupport}).Decode(&form)
	if err != nil {
		return form, err
	}

	return form, nil
}
