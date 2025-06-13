package github

import (
	"context"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-plugin/pkg/github"
	gh "github.com/google/go-github/v47/github"
	"go.mongodb.org/mongo-driver/bson"
)

func ConsumeEvent(webhookType string, payload []byte) error {
	event, err := gh.ParseWebHook(webhookType, payload)
	if err != nil {
		return err
	}

	db := db.GetMongo()
	githubTestDB := db.Database(github.DatabaseGithubTest)
	githubDB := db.Database(github.DatabaseGithub)
	switch Event := event.(type) {
	case *gh.CreateEvent:
		logger.LogMessage("info", "Received a create event")
		_, err := githubTestDB.Collection(github.CollectionCreate).InsertOne(context.TODO(), event)
		if err != nil {
			return err
		}
	case *gh.IssuesEvent:
		logger.LogMessage("info", "Received issues event")
		_, err := githubTestDB.Collection(github.CollectionIssue).InsertOne(context.TODO(), event)
		if err != nil {
			return err
		}
	// integrate someday
	// case *gh.ProjectEvent:
	// 	logger.LogMessage("info", "Received project event")
	// 	_, err := githubTestDB.Collection(github.CollectionProject).InsertOne(context.TODO(), event)
	// 	if err != nil {
	// 		return err
	// 	}
	// case *gh.ProjectCardEvent:
	// 	logger.LogMessage("info", "Received project card event")
	// 	_, err := githubTestDB.Collection(github.CollectionProjectCard).InsertOne(context.TODO(), event)
	// 	if err != nil {
	// 		return err
	// 	}
	// case *gh.ProjectColumnEvent:
	// 	logger.LogMessage("info", "Received project column event")
	// 	_, err := githubTestDB.Collection(github.CollectionProjectColumn).InsertOne(context.TODO(), event)
	// 	if err != nil {
	// 		return err
	// 	}
	case *gh.PullRequestEvent:
		logger.LogMessage("info", "Received pull request event")
		_, err := githubTestDB.Collection(github.CollectionPullRequest).InsertOne(context.TODO(), event)
		if err != nil {
			return err
		}
	case *gh.InstallationEvent:
		installationCol := githubTestDB.Collection(github.CollectionInstallation)
		logger.LogMessage("info", "Received installation event")
		if Event.GetAction() == "deleted" {
			_, err := installationCol.DeleteMany(context.TODO(), bson.M{"installation.id": Event.GetInstallation().GetID()})
			if err != nil {
				return err
			}
			daoCol := githubDB.Collection(github.CollectionDAOData)
			_, err = daoCol.DeleteMany(context.TODO(), bson.M{"installation_id": Event.GetInstallation().GetID()})
			if err != nil {
				return err
			}
		} else if Event.GetAction() == "created" {
			_, err := installationCol.InsertOne(context.TODO(), event)
			if err != nil {
				return err
			}
		} else {
			_, err := installationCol.UpdateOne(context.TODO(), bson.M{"installation.id": Event.GetInstallation().GetID()}, bson.M{"$set": event})
			if err != nil {
				return err
			}
		}
	default:
		logger.LogMessage("info", "Received unknown event")
		_, err := githubTestDB.Collection("events").InsertOne(context.TODO(), event)
		if err != nil {
			return err
		}
	}
	return nil
}
