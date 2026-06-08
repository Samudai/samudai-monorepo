package notion

import (
	np "github.com/Samudai/go-notion"
	"golang.org/x/net/context"
)

func GetDatabase(databaseID string, auth string) (*np.Database, error) {
	client := np.NewClient(auth)
	data, err := client.FindDatabaseByID(context.Background(), databaseID)
	if err != nil {
		return nil, err
	}

	return &data, nil
}

func GetDatabaseProperties(databaseID string, auth string) ([]np.DatabaseProperty, error) {
	database, err := GetDatabase(databaseID, auth)
	if err != nil {
		return nil, err
	}

	properties := make(map[string]np.DatabaseProperty)
	for property, data := range database.Properties {
		switch data.Type {
		case np.DBPropTypeSelect:
			properties[property] = data
		case np.DBPropTypeStatus:
			properties[property] = data
		}
	}

	props := make([]np.DatabaseProperty, 0, len(properties))
	for _, prop := range properties {
		props = append(props, prop)
	}

	return props, nil
}

type Database struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

// Search returns all databases in notion.
func GetAllDatabase(auth string) ([]Database, error) {
	client := np.NewClient(auth)
	options := &np.SearchOpts{
		Filter: &np.SearchFilter{
			Property: "object",
			Value:    "database",
		},
		PageSize: 100,
	}
	data, err := client.Search(context.Background(), options)
	if err != nil {
		return nil, err
	}

	var databases []Database
	for _, result := range data.Results {
		data := result.(np.Database)
		if len(data.Title) > 0 {
			database := Database{
				ID:   data.ID,
				Name: data.Title[0].PlainText,
			}
			databases = append(databases, database)
		} else {
			database := Database{
				ID:   data.ID,
				Name: "untitled",
			}
			databases = append(databases, database)
		}
	}

	return databases, nil
}
