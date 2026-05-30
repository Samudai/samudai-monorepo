package notion

import (
	np "github.com/Samudai/go-notion"
	"golang.org/x/net/context"
)

// QueryDatabase returns all pages in databases from notion.
func QueryDatabase(auth, databaseID string) ([]np.Page, error) {
	var pages []np.Page
	client := np.NewClient(auth)

	data, err := client.QueryDatabase(context.Background(), databaseID, &np.DatabaseQuery{
		PageSize: 100,
	})
	if err != nil {
		return nil, err
	}
	pages = append(pages, data.Results...)
	if data.HasMore {
		for {
			data, err := client.QueryDatabase(context.Background(), databaseID, &np.DatabaseQuery{
				StartCursor: *data.NextCursor,
			})
			if err != nil {
				return nil, err
			}
			pages = append(pages, data.Results...)
			if !data.HasMore {
				break
			}
		}
	}

	return data.Results, nil
}
