package github

import (
	"context"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-plugin/pkg/github"
	gh "github.com/google/go-github/v47/github"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func SaveMemberData(memberID string, userAuth *github.UserAccessTokenResp, user gh.User) error {
	db := db.GetMongo()
	data := github.MemberData{
		MemberID:   memberID,
		UserAccess: *userAuth,
		User:       user,
	}
	_, err := db.Database(github.DatabaseGithub).Collection(github.CollectionMemberData).InsertOne(context.TODO(), data)
	if err != nil {
		return err
	}

	return nil
}

func CheckMemberGithubExists(memberID string) (bool, *string, error) {
	db := db.GetMongo()
	githubDB := db.Database(github.DatabaseGithub)

	var data github.MemberData
	err := githubDB.Collection(github.CollectionMemberData).FindOne(context.TODO(), bson.M{"_id": memberID}).Decode(&data)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return false, nil, nil
		}
		return false, nil, err
	}

	return true, data.User.Login, nil
}
