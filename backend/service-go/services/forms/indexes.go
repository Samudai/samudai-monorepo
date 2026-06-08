package formssvc

import (
	"context"
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/Samudai/backend/services/forms/pkg/deal"
)

// EnsureIndexes creates the secondary indexes the forms service queries on, for
// its forms Mongo database. Idempotent and non-unique (see the discord service for
// the rationale).
func EnsureIndexes(ctx context.Context) error {
	client := db.GetMongo()

	plans := []struct {
		database   string
		collection string
		models     []mongo.IndexModel
	}{
		{deal.DatabaseForm, deal.CollectionDealForm, []mongo.IndexModel{
			mongoIndex("dao_id", bson.D{{Key: "dao_id", Value: 1}}),
			mongoIndex("type", bson.D{{Key: "type", Value: 1}}),
		}},
		{deal.DatabaseForm, deal.CollectionResponse, []mongo.IndexModel{
			mongoIndex("form_id", bson.D{{Key: "form_id", Value: 1}}),
		}},
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
