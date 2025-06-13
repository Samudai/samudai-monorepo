package github

import (
	"context"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-plugin/pkg/github"
	gh "github.com/google/go-github/v47/github"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func SaveDAOData(params github.SaveDAODataParam) error {
	db := db.GetMongo()
	githubDB := db.Database(github.DatabaseGithub)

	data := github.DAOData{
		DAOID:          params.DAOID,
		UserAccess:     params.UserAccess,
		Installation:   params.Installation,
		InstallationID: params.Installation.Installation.GetID(),
	}
	_, err := githubDB.Collection(github.CollectionDAOData).InsertOne(context.TODO(), data)
	if err != nil {
		return err
	}

	return nil
}

func CheckDaoGithubAppExists(daoID string) (bool, *string, error) {
	db := db.GetMongo()
	githubDB := db.Database(github.DatabaseGithub)

	var data github.DAOData
	err := githubDB.Collection(github.CollectionDAOData).FindOne(context.TODO(), bson.M{"_id": daoID}).Decode(&data)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return false, nil, nil
		}
		return false, nil, err
	}

	return true, data.Installation.Installation.Account.Login, nil
}

func GetInstallation(installationID int64) (*gh.InstallationEvent, error) {
	db := db.GetMongo()
	githubTest := db.Database(github.DatabaseGithubTest)
	installationCol := githubTest.Collection(github.CollectionInstallation)

	var installationEvent *gh.InstallationEvent
	err := installationCol.FindOne(context.TODO(), bson.M{"installation.id": installationID}).Decode(&installationEvent)
	if err != nil {
		return installationEvent, err
	}
	return installationEvent, nil
}

func GetDAOData(daoID string) (github.DAOData, error) {
	db := db.GetMongo()
	githubDB := db.Database(github.DatabaseGithub)
	daoCol := githubDB.Collection(github.CollectionDAOData)
	var data github.DAOData
	err := daoCol.FindOne(context.TODO(), bson.M{"_id": daoID}).Decode(&data)
	if err != nil {
		return data, err
	}
	return data, nil
}

func GetDAOIDForInstallation(installationID int64) (string, error) {
	db := db.GetMongo()
	githubDB := db.Database(github.DatabaseGithub)
	memberCol := githubDB.Collection(github.CollectionDAOData)

	var data github.DAOData
	err := memberCol.FindOne(context.TODO(), bson.M{"installation_id": installationID}).Decode(&data)
	if err != nil {
		return "", err
	}
	return data.DAOID, nil
}

func GetMemberIDs(userIDs []string) ([]string, error) {
	db := db.GetMongo()
	database := db.Database(github.DatabaseGithub)
	memberCol := database.Collection(github.CollectionMemberData)

	var memberDatas []github.MemberData
	cursor, err := memberCol.Find(context.Background(), bson.M{"user.login": bson.M{"$in": userIDs}}, options.Find().SetProjection(bson.D{{"_id", 1}}))
	if err != nil {
		return nil, err
	}
	if err = cursor.All(context.Background(), &memberDatas); err != nil {
		return nil, err
	}

	var memberIDs []string
	for _, memberData := range memberDatas {
		memberIDs = append(memberIDs, memberData.MemberID)
	}

	return memberIDs, nil
}

func DeleteMemberData(memberID string) error {
	db := db.GetMongo()
	database := db.Database(github.DatabaseGithub)

	_, err := database.Collection(github.CollectionMemberData).DeleteOne(context.Background(), bson.M{"_id": memberID})
	if err != nil {
		return err
	}

	return nil
}

func DeleteGithubAppAuth(daoID string) error {
	db := db.GetMongo()
	database := db.Database(github.DatabaseGithub)

	_, err := database.Collection(github.CollectionDAOData).DeleteMany(context.Background(), bson.M{"_id": daoID})
	if err != nil {
		return err
	}

	return nil
}
