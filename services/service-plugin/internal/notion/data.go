package notion

import (
	"os"

	np "github.com/Samudai/go-notion"
	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-plugin/pkg/notion"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/net/context"
)

func Auth(memberID, code, redirectURI string) (*np.AuthResponse, error) {
	db := db.GetMongo()
	database := db.Database(notion.DatabaseNotion)

	var memberData notion.MemberData
	var auth np.AuthResponse
	notFound := false

	err := database.Collection(notion.CollectionMemberData).FindOne(context.Background(), bson.M{"_id": memberID}).Decode(&memberData)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			notFound = true
		} else {
			return nil, err
		}
	}

	if notFound && code != "" {
		notionApp := np.InitNotionApp(os.Getenv("NOTION_CLIENT_ID"), os.Getenv("NOTION_CLIENT_SECRET"))
		auth, err := notionApp.AuthUser(code, redirectURI)
		if err != nil {
			return nil, err
		}
		err = saveAuthData(memberID, *auth)
		if err != nil {
			return nil, err
		}
		return auth, nil
	}
	auth.AccessToken = memberData.AccessToken
	auth.TokenType = memberData.TokenType
	auth.BotID = memberData.BotID
	auth.WorkspaceName = memberData.WorkspaceName
	auth.WorkspaceIcon = memberData.WorkspaceIcon
	auth.WorkspaceID = memberData.WorkspaceID
	auth.Owner = memberData.Owner

	return &auth, nil
}

func CheckMemberNotionExists(memberID string) (bool, *string, error) {
	db := db.GetMongo()
	database := db.Database(notion.DatabaseNotion)

	var memberData notion.MemberData
	err := database.Collection(notion.CollectionMemberData).FindOne(context.Background(), bson.M{"_id": memberID}).Decode(&memberData)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return false, nil, nil
		}
		return false, nil, err
	}

	return true, &memberData.Owner.User.Name, nil
}

func saveAuthData(memberID string, data np.AuthResponse) error {
	db := db.GetMongo()
	database := db.Database(notion.DatabaseNotion)
	_, err := database.Collection(notion.CollectionMemberData).InsertOne(context.Background(), notion.MemberData{
		MemberID:     memberID,
		AuthResponse: data,
	})

	return err
}

func SavePages(pages []np.Page) error {
	db := db.GetMongo()
	database := db.Database(notion.DatabaseNotion)

	data := make([]interface{}, len(pages))
	for i := range pages {
		data[i] = pages[i]
	}

	_, err := database.Collection(notion.CollectionPages).InsertMany(context.Background(), data)
	if err != nil {
		return err
	}

	return nil
}

func GetMemberIDs(userIDs []string) ([]string, error) {
	db := db.GetMongo()
	database := db.Database(notion.DatabaseNotion)

	var memberDatas []notion.MemberData
	projection := bson.D{{Key: "member_id", Value: 1}}
	cursor, err := database.Collection(notion.CollectionMemberData).Find(context.Background(), bson.M{"authresponse.owner.user.baseuser.id": bson.M{"$in": userIDs}}, options.Find().SetProjection(projection))
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

func DeleteAuth(memberID string) error {
	db := db.GetMongo()
	database := db.Database(notion.DatabaseNotion)

	_, err := database.Collection(notion.CollectionMemberData).DeleteOne(context.Background(), bson.M{"_id": memberID})
	if err != nil {
		return err
	}

	return nil
}

func GetPageByID(pageID string) (*np.Page, error) {
	db := db.GetMongo()
	database := db.Database(notion.DatabaseNotion)
	var page np.Page
	err := database.Collection(notion.CollectionPages).FindOne(context.Background(), bson.M{"id": pageID}).Decode(&page)
	if err != nil {
		return nil, err
	}

	return &page, nil
}
