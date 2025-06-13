package store

import (
	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-plugin/pkg/gcal"
	"github.com/Samudai/service-plugin/pkg/github"
	"github.com/Samudai/service-plugin/pkg/notion"
)

func Init() {
	db := db.GetMongo()
	// github
	_ = db.Database(github.DatabaseGithubTest)
	_ = db.Database(github.DatabaseGithub)
	_ = db.Database(github.CollectionDAOData)
	_ = db.Database(github.CollectionMemberData)
	// gcal
	_ = db.Database(gcal.DatabaseGcal)
	// notion
	_ = db.Database(notion.DatabaseNotion)
}
