package pluginsvc

import (
	"context"
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/Samudai/backend/services/plugin/pkg/github"
	"github.com/Samudai/backend/services/plugin/pkg/notion"
)

// EnsureIndexes creates the secondary indexes the plugin service queries on, for
// its notion and github Mongo databases. Idempotent and non-unique (see the
// discord service for the rationale). The gcal database is queried only by _id, so
// it needs no secondary index.
func EnsureIndexes(ctx context.Context) error {
	client := db.GetMongo()

	authOwner := mongoIndex("authresponse_owner_user_baseuser_id",
		bson.D{{Key: "authresponse.owner.user.baseuser.id", Value: 1}})

	plans := []struct {
		database   string
		collection string
		models     []mongo.IndexModel
	}{
		{notion.DatabaseNotion, notion.CollectionMemberData, []mongo.IndexModel{authOwner}},
		{notion.DatabaseNotion, notion.CollectionPages, []mongo.IndexModel{mongoIndex("id", bson.D{{Key: "id", Value: 1}})}},
		{github.DatabaseGithub, github.CollectionMemberData, []mongo.IndexModel{authOwner}},
		{github.DatabaseGithubTest, github.CollectionInstallation, []mongo.IndexModel{mongoIndex("installation_id", bson.D{{Key: "installation_id", Value: 1}})}},
	}

	for _, p := range plans {
		if _, err := client.Database(p.database).Collection(p.collection).Indexes().CreateMany(ctx, p.models); err != nil {
			return fmt.Errorf("%s.%s: %w", p.database, p.collection, err)
		}
	}
	return nil
}

// mongoIndex builds a named, non-unique index model.
func mongoIndex(name string, keys bson.D) mongo.IndexModel {
	return mongo.IndexModel{Keys: keys, Options: options.Index().SetName(name)}
}
