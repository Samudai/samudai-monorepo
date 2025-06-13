package discord

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"os"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/requester"
	"github.com/Samudai/service-discord/pkg/discord"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var pointService string = os.Getenv("SERVICE_POINT")

// Addmembers adds members to the database
func Addmembers(members []discord.Member) error {
	db := db.GetMongo()

	data := make([]interface{}, len(members))
	for i := range members {
		data[i] = members[i]
	}

	_, err := db.Database(discord.DatabaseDiscord).Collection(discord.CollectionMembers).InsertMany(context.Background(), data)
	if err != nil {
		return err
	}

	return nil
}

type Resp struct {
	PointIds []string `json:"point"`
}

func GetPointIdsByMemberId(memberId string) ([]string, error) {
	url := fmt.Sprintf("%s/point/getPointIdsByMemberId/%s", pointService, memberId)

	res, err := requester.Get(url)
	if err != nil {
		return nil, err
	}
	var response Resp
	err = json.Unmarshal(res, &response)
	if err != nil {
		return nil, err
	}

	return response.PointIds, nil
}

type MemberResponse struct {
	Member discord.MemberView `json:"member"`
}

func GetMember(value string, memberType string) (discord.MemberView, error) {
	url := fmt.Sprintf("%s/member/fetch", pointService)

	var response MemberResponse
	var params map[string]interface{}
	switch memberType {
	case "discord_user_id":
		params = map[string]interface{}{
			"type":            memberType,
			"discord_user_id": value,
		}
	case "member_id":
		params = map[string]interface{}{
			"type":      memberType,
			"member_id": value,
		}
	case "wallet_address":
		params = map[string]interface{}{
			"type":           memberType,
			"wallet_address": value,
		}
	default:
		return response.Member, fmt.Errorf("unknown member type: %s", memberType)
	}
	res, err := requester.Post(url, params)
	if err != nil {
		return response.Member, err
	}
	err = json.Unmarshal(res, &response)
	if err != nil {
		return response.Member, err
	}

	return response.Member, nil
}

func GetNFTsForWallet(tokenAddress string, walletAddress string, chain string) (bool, error) {
	if tokenAddress == "" {
		return false, nil
	}
	url := fmt.Sprintf("https://deep-index.moralis.io/api/v2.2/%s/nft?chain=%s&format=decimal&token_addresses%%5B0%%5D=%s&media_items=false", walletAddress, chain, tokenAddress)

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("Accept", "application/json")
	req.Header.Add("X-API-Key", os.Getenv("MORALIS_API_KEY"))

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return false, err
	}

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)
	var nfts discord.NFT
	err = json.Unmarshal(body, &nfts)
	if err != nil {
		return false, err
	}
	// fmt.Println(len(nfts.Result))
	if len(nfts.Result) > 0 {
		return true, nil
	}
	return false, nil
}
func GetProductMemberAndPoints(product_id, unique_user_id, event_name string) (discord.ProductResponse, error) {
	url := fmt.Sprintf("%s/memberproduct/fetch/productandmember/%s/%s/%s",
		pointService, product_id, unique_user_id, event_name)

	var member discord.ProductResponse
	res, err := requester.Get(url)
	if err != nil {
		return member, err
	}
	err = json.Unmarshal(res, &member)
	if err != nil {
		return member, err
	}

	return member, nil
}

func GetProductMember(product_id, unique_user_id, event_name string) (discord.ProductResponse1, error) {
	url := fmt.Sprintf("%s/memberproduct/fetchbyid/productandmember/%s/%s",
		pointService, product_id, unique_user_id)

	var member discord.ProductResponse1
	res, err := requester.Get(url)
	if err != nil {
		return member, err
	}
	err = json.Unmarshal(res, &member)
	if err != nil {
		return member, err
	}

	return member, nil
}

func GetTelegramMember(joinee_chat_id, group_chat_id, event_name string) (discord.TelegramResponse, error) {
	url := fmt.Sprintf("%s/telegram/getmember/%s/%s/%s",
		pointService, joinee_chat_id, group_chat_id, event_name)

	var member discord.TelegramResponse
	res, err := requester.Get(url)
	if err != nil {
		return member, err
	}
	err = json.Unmarshal(res, &member)
	if err != nil {
		return member, err
	}

	return member, nil
}

func GetTwitterMember(point_id, twitter_user_id, twitter_username string) (discord.TwitterResponse, error) {
	url := fmt.Sprintf("%s/twittermember/getbyuserid/%s/%s/%s",
		pointService, point_id, twitter_user_id, twitter_username)

	var member discord.TwitterResponse
	res, err := requester.Get(url)
	if err != nil {
		return member, err
	}
	err = json.Unmarshal(res, &member)
	if err != nil {
		return member, err
	}

	return member, nil
}

func UpdateMemberMergingStatus(memberId string, status bool) error {
	url := fmt.Sprintf("%s/member/update/mergingstatus", pointService)

	params := map[string]interface{}{
		"member_id":    memberId,
		"merge_status": status,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func UpdateMember(member discord.Member) error {
	db := db.GetMongo()
	_, err := db.Database(discord.DatabaseDiscord).Collection(discord.CollectionMembers).UpdateOne(context.Background(), bson.M{"discord_user_id": member.UserID, "guild_id": member.GuildID}, bson.M{"$set": member})
	if err != nil {
		return err
	}

	return nil
}

func DeleteMember(guildID, userID string) error {
	db := db.GetMongo()
	_, err := db.Database(discord.DatabaseDiscord).Collection(discord.CollectionMembers).DeleteOne(context.Background(), bson.M{"discord_user_id": userID, "guild_id": guildID})
	if err != nil {
		return err
	}

	return nil
}

// Point

// Addmembers adds members to the database
func AddmembersPoint(members []discord.PointMember, point_id *string) error {
	db := db.GetMongo()

	data := make([]interface{}, len(members))
	for i := range members {
		members[i].PointId = point_id
		data[i] = members[i]
	}

	_, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).InsertMany(context.Background(), data)
	if err != nil {
		return err
	}

	return nil
}
func AddDiscordmembersPoint(members []discord.PointMember, point_id *string, memberIds []string) error {
	db := db.GetMongo()

	for i := range members {
		if memberIds[i] != "" {
			members[i].MemberID = &memberIds[i]
			members[i].PointId = point_id

			filter := bson.M{"memberid": members[i].MemberID, "point_id": point_id}

			update := bson.M{
				"$set": bson.M{
					"discord_user_id": members[i].UserID,
					"bot":             members[i].Bot,
					"username":        members[i].Username,
					"discriminator":   members[i].Discriminator,
					"avatar":          members[i].Avatar,
					"guild_id":        members[i].GuildID,
					"joined_at":       members[i].JoinedAt,
					"nickname":        members[i].Nickname,
					"roles":           members[i].Roles,
					"point_id":        point_id,
				},
				"$inc": bson.M{
					"points_num": members[i].PointsNum,
				},
			}

			result, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).UpdateOne(
				context.Background(),
				filter,
				update,
			)
			if err != nil {
				return err
			}

			if result.ModifiedCount == 0 {
				_, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).InsertOne(
					context.Background(),
					members[i],
				)
				if err != nil {
					return err
				}
			}
		} else {
			members[i].PointId = point_id
			_, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).InsertOne(
				context.Background(),
				members[i],
			)
			if err != nil {
				return err
			}
		}
	}

	return nil
}
func AddDiscordmemberPoint(member []discord.PointMember, point_id *string, memberId string) error {
	db := db.GetMongo()
	if memberId != "" {
		member[0].MemberID = &memberId
		member[0].PointId = point_id

		filter := bson.M{"memberid": member[0].MemberID, "point_id": point_id}

		update := bson.M{
			"$set": bson.M{
				"discord_user_id": member[0].UserID,
				"bot":             member[0].Bot,
				"username":        member[0].Username,
				"discriminator":   member[0].Discriminator,
				"avatar":          member[0].Avatar,
				"guild_id":        member[0].GuildID,
				"joined_at":       member[0].JoinedAt,
				"nickname":        member[0].Nickname,
				"roles":           member[0].Roles,
				"point_id":        point_id,
			},
			"$inc": bson.M{
				"points_num": member[0].PointsNum,
			},
		}

		result, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).UpdateOne(
			context.Background(),
			filter,
			update,
		)
		if err != nil {
			return err
		}

		if result.ModifiedCount == 0 {
			_, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).InsertOne(
				context.Background(),
				member[0],
			)
			if err != nil {
				return err
			}
		}
	} else {
		member[0].PointId = point_id
		_, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).InsertOne(
			context.Background(),
			member[0],
		)
		if err != nil {
			return err
		}
	}

	return nil
}

func AddmemberPoint(members discord.PointMember, point_id *string) error {
	db := db.GetMongo()
	members.PointId = point_id
	now := time.Now()
	members.JoinedAt = &now
	_, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).InsertOne(context.Background(), members)
	if err != nil {
		return err
	}

	return nil
}

// func UpdateAllFields(members discord.PointMemberView) error {
// 	db := db.GetMongo() // Assuming this function returns a *mongo.Client
// 	filter := bson.M{
// 		"walletAddress": bson.M{
// 			"$elemMatch": bson.M{
// 				"$eq": (*members.WalletAddress)[0],
// 			},
// 		},
// 		"pointId": *&members.PointId,
// 	}

// 	// Construct a new document with all fields from the members struct
// 	newDocument := bson.M{
// 		"UserID":        members.UserID,
// 		"Bot":           members.Bot,
// 		"Username":      members.Username,
// 		"Discriminator": members.Discriminator,
// 		"Avatar":        members.Avatar,
// 		"GuildID":       members.GuildID,
// 		"JoinedAt":      members.JoinedAt,
// 		"Nickname":      members.Nickname,
// 		"Roles":         members.Roles,
// 		"PointsNum":     members.PointsNum,
// 		"PointId":       members.PointId,
// 		"WalletAddress": members.WalletAddress,
// 		"MemberID":      members.MemberID,
// 		"MemberName":    members.MemberName,
// 	}

// 	_, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).UpdateOne(
// 		context.Background(),
// 		filter,
// 		newDocument,
// 		options.Update().SetUpsert(true),
// 	)
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

func UpdateMemberPoint(member discord.Member) error {
	db := db.GetMongo()
	_, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).UpdateOne(context.Background(), bson.M{"discord_user_id": member.UserID, "guild_id": member.GuildID}, bson.M{"$set": member})
	if err != nil {
		return err
	}

	return nil
}
func UpdateMemberPointsNum(discord_user_id string, pointId string, points float64) error {
	db := db.GetMongo()
	_, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).UpdateOne(context.Background(), bson.M{"discord_user_id": discord_user_id, "point_id": pointId}, bson.M{"$inc": bson.M{
		"points_num": points, // Increment the `points` field by `pointsToAdd`
	}})
	if err != nil {
		return err
	}

	return nil
}
func UpdateMemberWalletsPointsNum(walletAddress string, point_id string, points float64) error {
	db := db.GetMongo()
	filter := bson.M{
		"point_id":      point_id,
		"walletaddress": walletAddress,
	}
	update := bson.M{
		"$inc": bson.M{
			"points_num": points,
		},
	}
	result, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).UpdateOne(context.Background(), filter, update)
	if err != nil {
		return err
	}

	if result.MatchedCount == 0 {
		var member discord.PointMember
		member.PointId = &point_id
		member.PointsNum = points
		walletAddressSlice := []string{walletAddress}
		member.WalletAddress = &walletAddressSlice
		AddmemberPoint(member, &point_id)

	}

	return nil
}
func UpdateMemberIDWalletsPointsNum(walletAddress string, point_id string, points float64, memberId string) error {
	db := db.GetMongo()
	filter := bson.M{
		"point_id": point_id,
		"memberid": memberId,
	}
	update := bson.M{
		"$inc": bson.M{
			"points_num": points,
		},
	}
	result, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).UpdateOne(context.Background(), filter, update)
	if err != nil {
		return err
	}

	if result.MatchedCount == 0 {
		var member discord.PointMember
		member.MemberID = &memberId
		member.PointId = &point_id
		member.PointsNum = points
		walletAddressSlice := []string{walletAddress}
		member.WalletAddress = &walletAddressSlice
		AddmemberPoint(member, &point_id)
	}

	return nil
}
func UpdateMemberTelegramPointsNum(joinee_chat_id string, joinee_first_name string, chat_name string, point_id string, points float64) error {
	db := db.GetMongo()
	filter := bson.M{
		"point_id":       point_id,
		"joinee_chat_id": joinee_chat_id,
	}
	update := bson.M{
		"$inc": bson.M{
			"points_num": points,
		},
	}
	result, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).UpdateOne(context.Background(), filter, update)
	if err != nil {
		return err
	}

	if result.MatchedCount == 0 {
		var member discord.PointMember
		member.PointId = &point_id
		member.PointsNum = points
		member.JoineeChatId = &joinee_chat_id
		member.JoineeFirstName = &joinee_first_name
		member.ChatName = &chat_name
		AddmemberPoint(member, &point_id)

	}

	return nil
}
func UpdateMemberIDTelegramPointsNum(joinee_chat_id string, joinee_first_name string, chat_name string, point_id string, points float64, memberId string) error {
	db := db.GetMongo()
	filter := bson.M{
		"point_id": point_id,
		"memberid": memberId,
	}
	update := bson.M{
		"$inc": bson.M{
			"points_num": points,
		},
	}
	result, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).UpdateOne(context.Background(), filter, update)
	if err != nil {
		return err
	}

	if result.MatchedCount == 0 {
		var member discord.PointMember
		member.MemberID = &memberId
		member.PointId = &point_id
		member.PointsNum = points
		member.JoineeChatId = &joinee_chat_id
		member.JoineeFirstName = &joinee_first_name
		member.ChatName = &chat_name
		AddmemberPoint(member, &point_id)
	}

	return nil
}

func UpdateMemberTwitterPointsNum(to_twitter_user_id string, to_twitter_username string, point_id string, points float64) error {
	db := db.GetMongo()
	filter := bson.M{
		"point_id":        point_id,
		"twitter_user_id": to_twitter_user_id,
	}
	update := bson.M{
		"$inc": bson.M{
			"points_num": points,
		},
	}
	result, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).UpdateOne(context.Background(), filter, update)
	if err != nil {
		return err
	}

	if result.MatchedCount == 0 {
		var member discord.PointMember
		member.PointId = &point_id
		member.PointsNum = points
		member.TwitterUserId = &to_twitter_user_id
		member.TwitterUserName = &to_twitter_username
		AddmemberPoint(member, &point_id)

	}

	return nil
}
func UpdateMemberIDTwitterPointsNum(to_twitter_user_id string, to_twitter_username string, point_id string, points float64, memberId string) error {
	db := db.GetMongo()
	filter := bson.M{
		"point_id": point_id,
		"memberid": memberId,
	}
	update := bson.M{
		"$inc": bson.M{
			"points_num": points,
		},
	}
	result, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).UpdateOne(context.Background(), filter, update)
	if err != nil {
		return err
	}

	if result.MatchedCount == 0 {
		var member discord.PointMember
		member.MemberID = &memberId
		member.PointId = &point_id
		member.PointsNum = points
		member.TwitterUserId = &to_twitter_user_id
		member.TwitterUserName = &to_twitter_username
		AddmemberPoint(member, &point_id)
	}

	return nil
}
func UpdateCustomPointsNum(product_id string, product_name string, unique_user_id string, point_id string, points float64) error {
	db := db.GetMongo()
	objectToMatch := bson.M{
		"product_id":     product_id,
		"unique_user_id": unique_user_id,
	}
	customProductObject := discord.CustomProductObj{
		ProductID:    product_id,
		ProductName:  &product_name,
		UniqueUserId: unique_user_id,
	}
	filter := bson.M{
		"custom_products": bson.M{
			"$elemMatch": objectToMatch,
		},
		"point_id": point_id,
	}
	update := bson.M{
		"$inc": bson.M{
			"points_num": points,
		},
	}
	result, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).UpdateOne(context.Background(), filter, update)
	if err != nil {
		return err
	}

	if result.MatchedCount == 0 {
		var member discord.PointMember
		member.PointId = &point_id
		member.PointsNum = points

		CustomProductsSlice := []discord.CustomProductObj{customProductObject}
		(member.CustomProducts) = &CustomProductsSlice

		AddmemberPoint(member, &point_id)
	}

	return nil
}

func UpdateMemberIDCustomPointsNum(product_id string, product_name string, unique_user_id string, point_id string, points float64, memberId string) error {
	db := db.GetMongo()
	objectToMatch := bson.M{
		"product_id":     product_id,
		"unique_user_id": unique_user_id,
	}
	customProductObject := discord.CustomProductObj{
		ProductID:    product_id,
		ProductName:  &product_name,
		UniqueUserId: unique_user_id,
	}
	filter := bson.M{
		"custom_products": bson.M{
			"$elemMatch": objectToMatch,
		},
		"point_id": point_id,
	}
	update := bson.M{
		"$inc": bson.M{
			"points_num": points,
		},
	}
	result, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).UpdateOne(context.Background(), filter, update)
	if err != nil {
		return err
	}

	if result.MatchedCount == 0 {
		var member discord.PointMember
		member.MemberID = &memberId
		member.PointId = &point_id
		member.PointsNum = points

		CustomProductsSlice := []discord.CustomProductObj{customProductObject}
		(member.CustomProducts) = &CustomProductsSlice
		AddmemberPoint(member, &point_id)
	}

	return nil
}

func UpdateMemberPoints(pointId, member_id string) error {
	db := db.GetMongo()
	filter := bson.M{
		"point_id": pointId,
		"memberid": member_id,
	}

	var memberData discord.PointMemberView
	err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).FindOne(context.Background(), filter).Decode(&memberData)
	if err != nil {
		return err
	}

	pointMember := discord.PointMemberType{
		MemberID: memberData.MemberID,
		PointID:  memberData.PointId,
		Points:   memberData.PointsNum,
	}

	pointMembers := []discord.PointMemberType{pointMember}

	url := fmt.Sprintf("%s/member/createpointmember", pointService)
	params := map[string]interface{}{
		"members": pointMembers,
	}
	_, err = requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func MergeAll(params discord.Merge, i int) error {
	db := db.GetMongo()
	var walletResult []discord.PointMemberView
	var tempwalletResult []discord.PointMemberView
	var discordResult discord.PointMemberView
	if params.UserID != nil {
		filter := bson.M{
			"discord_user_id": params.UserID,
			"point_id":        params.PointId,
		}
		err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).FindOne(context.Background(), filter).Decode(&discordResult)
		if err != nil {
			return err
		}
		tempwalletResult = append(tempwalletResult, discordResult)
	}
	if params.WalletAddress != nil && len(*params.WalletAddress) > 0 {
		for _, wallet := range *params.WalletAddress {
			var tempWallet discord.PointMemberView
			filter := bson.M{
				"point_id":      params.PointId,
				"walletaddress": wallet,
			}
			err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).FindOne(context.Background(), filter).Decode(&tempWallet)
			if err != nil {
				return err
			}
			tempwalletResult = append(tempwalletResult, tempWallet)
		}
	}
	if len(tempwalletResult) == 0 {
		return nil
	}
	for _, tempWallet := range tempwalletResult {
		exists := false
		for _, existingWallet := range walletResult {
			if *existingWallet.Id == *tempWallet.Id {
				exists = true
				break
			}
		}
		if !exists {
			walletResult = append(walletResult, tempWallet)
		}
	}
	for _, wallet := range walletResult {
		fmt.Println(*wallet.Id)
	}
	if len(walletResult) > 1 {
		var member discord.PointMember
		walletAddressSlice := []string{}
		member.WalletAddress = &walletAddressSlice
		if walletResult[0].UserID != nil {
			member.UserID = walletResult[0].UserID
			member.Bot = walletResult[0].Bot
			member.Username = walletResult[0].Username
			member.Discriminator = walletResult[0].Discriminator
			member.Avatar = walletResult[0].Avatar
			member.GuildID = walletResult[0].GuildID
			member.Roles = walletResult[0].Roles
			member.PointId = walletResult[0].PointId
			*member.WalletAddress = append(*member.WalletAddress, *walletResult[1].WalletAddress...)

		} else if walletResult[1].UserID != nil {
			member.UserID = walletResult[1].UserID
			member.Bot = walletResult[1].Bot
			member.Username = walletResult[1].Username
			member.Discriminator = walletResult[1].Discriminator
			member.Avatar = walletResult[1].Avatar
			member.GuildID = walletResult[1].GuildID
			member.Roles = walletResult[1].Roles
			member.PointId = walletResult[1].PointId
			*member.WalletAddress = append(*member.WalletAddress, *walletResult[0].WalletAddress...)
		} else {
			member.PointId = walletResult[0].PointId
			*member.WalletAddress = append(*member.WalletAddress, *walletResult[1].WalletAddress...)
			*member.WalletAddress = append(*member.WalletAddress, *walletResult[0].WalletAddress...)
		}
		member.MemberID = params.MemberID
		member.MemberName = params.MemberName

		member.PointsNum = walletResult[0].PointsNum + walletResult[1].PointsNum
		AddmemberPoint(member, params.PointId)
		objectID, err := primitive.ObjectIDFromHex(*walletResult[0].Id)
		if err != nil {
			log.Fatal(err)
		}
		_, err = db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).DeleteOne(context.Background(), bson.M{"_id": objectID})
		if err != nil {
			log.Fatal(err)
		}
		object2ID, err := primitive.ObjectIDFromHex(*walletResult[1].Id)
		if err != nil {
			log.Fatal(err)
		}
		_, err = db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).DeleteOne(context.Background(), bson.M{"_id": object2ID})
		if err != nil {
			log.Fatal(err)
		}
		if i == 0 {
			MergeActivity(params)
		}
		UpdateMemberPoints(*params.PointId, *params.MemberID)
	} else if len(walletResult) == 1 {
		var member2 discord.PointMember
		walletAddressSlice := []string{}
		member2.WalletAddress = &walletAddressSlice
		if walletResult[0].UserID != nil {
			member2.UserID = walletResult[0].UserID
			member2.Bot = walletResult[0].Bot
			member2.Username = walletResult[0].Username
			member2.Discriminator = walletResult[0].Discriminator
			member2.Avatar = walletResult[0].Avatar
			member2.GuildID = walletResult[0].GuildID
			member2.Roles = walletResult[0].Roles
			member2.PointId = walletResult[0].PointId
		} else {
			*member2.WalletAddress = append(*member2.WalletAddress, *walletResult[0].WalletAddress...)
		}
		member2.PointsNum = walletResult[0].PointsNum
		member2.MemberID = params.MemberID
		member2.MemberName = params.MemberName
		objectID, err := primitive.ObjectIDFromHex(*walletResult[0].Id)
		if err != nil {
			log.Fatal(err)
		}
		_, err = db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).DeleteOne(context.Background(), bson.M{"_id": objectID})
		if err != nil {
			log.Fatal(err)
		}
		AddmemberPoint(member2, params.PointId)
		if i == 0 {
			MergeActivity(params)
		}
		UpdateMemberPoints(*params.PointId, *params.MemberID)
	}
	return nil
}

func GetPointsForWalletAddress(walletAddress string) ([]string, error) {
	db := db.GetMongo()

	collectionName := discord.CollectionMembers

	filter := bson.M{"walletaddress": bson.M{"$elemMatch": bson.M{"$eq": walletAddress}}}

	projectOptions := options.Find().SetProjection(bson.M{"point_id": 1})

	cursor, err := db.Database(discord.DatabasePointDiscord).Collection(collectionName).Find(context.Background(), filter, projectOptions)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var points []string
	for cursor.Next(context.Background()) {
		var pm discord.PointMember
		if err := cursor.Decode(&pm); err != nil {
			return nil, err
		}
		points = append(points, *pm.PointId)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return points, nil
}

func DeleteMemberPoint(guildID, userID string) error {
	db := db.GetMongo()
	_, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).DeleteOne(context.Background(), bson.M{"discord_user_id": userID, "guild_id": guildID})
	if err != nil {
		return err
	}

	return nil
}

// MergeV2 Functions
func GetPointIdsByMergeType(params discord.MergeMultipleV2) ([]string, error) {
	db := db.GetMongo()

	collectionName := discord.CollectionMembers
	var filter primitive.M
	if params.MergeType == discord.MergeTypeDiscord && params.DiscordID != nil {
		filter = bson.M{"discord_user_id": params.DiscordID}
	} else if params.MergeType == discord.MergeTypeWallet && params.WalletMergeAddress != nil {
		filter = bson.M{"walletaddress": bson.M{"$elemMatch": bson.M{"$eq": params.WalletMergeAddress}}}
	} else if params.MergeType == discord.MergeTypeCustomProduct && params.ProductID != nil && params.UniqueUserId != nil {
		filter = bson.M{
			"custom_products": bson.M{
				"$elemMatch": bson.M{
					"product_id":     params.ProductID,
					"unique_user_id": params.UniqueUserId,
				},
			},
		}
	} else if params.MergeType == discord.MergeTypeTelegram && params.JoineeChatId != nil {
		filter = bson.M{"joinee_chat_id": params.JoineeChatId}
	} else if params.MergeType == discord.MergeTypeTwitter && params.TwitterUserId != nil {
		filter = bson.M{"twitter_user_id": params.TwitterUserId}
	}

	if filter != nil {
		projectOptions := options.Find().SetProjection(bson.M{"point_id": 1})

		cursor, err := db.Database(discord.DatabasePointDiscord).Collection(collectionName).Find(context.Background(), filter, projectOptions)
		if err != nil {
			return nil, err
		}
		defer cursor.Close(context.Background())

		var points []string
		for cursor.Next(context.Background()) {
			var pm discord.PointMember
			if err := cursor.Decode(&pm); err != nil {
				return nil, err
			}
			points = append(points, *pm.PointId)
		}

		if err := cursor.Err(); err != nil {
			return nil, err
		}

		return points, nil
	}
	return []string{}, nil
}

func RemoveMongoDocumentByIdFromAllMembers(id string) {
	db := db.GetMongo()
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		log.Fatal(err)
	}
	_, err = db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).DeleteOne(context.Background(), bson.M{"_id": objectID})
	if err != nil {
		log.Fatal(err)
	}

}
func MergeEachPointId(params discord.MergeV2) error {
	db := db.GetMongo()
	// 1. Check if a document with memberId,PointId exists
	var memberDocument discord.PointMember
	var memberDocumentView discord.PointMemberView
	var tempDocument bson.M
	var firstMerge bool = false
	memberfilter := bson.M{
		"memberid": params.MemberID,
		"point_id": params.PointId,
	}
	err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).FindOne(context.Background(), memberfilter).Decode(&tempDocument)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			firstMerge = true
		} else {
			return err
		}
	}
	// Storing the result in tempDocument to later unmarshal into two variables to reduce code redundancy. Used to check if documents are already merged or not.
	bsonBytes, err := bson.Marshal(tempDocument)
	if err != nil {
		return err
	}
	err = bson.Unmarshal(bsonBytes, &memberDocument)
	if err != nil {
		return err
	}
	err = bson.Unmarshal(bsonBytes, &memberDocumentView)
	if err != nil {
		return err
	}

	// 2. Merge documents in All members according to the merge type
	// 2.1 Merge type: Discord
	// 2.2 Merge type: Wallet
	// 2.3 Merge type: Custom Product
	// 2.4 Merge type: Telegram
	// 2.5 Merge type: Twitter

	if params.MergeType == discord.MergeTypeDiscord && params.DiscordID != nil {
		var discordDocument discord.PointMemberView
		filter := bson.M{
			"discord_user_id": params.DiscordID,
			"point_id":        params.PointId,
		}
		err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).FindOne(context.Background(), filter).Decode(&discordDocument)
		if err != nil {
			return err
		}
		if !firstMerge && *discordDocument.Id == *memberDocumentView.Id {
			return nil
		}

		if firstMerge {
			memberDocument.PointId = &params.PointId
			memberDocument.MemberID = &params.MemberID
			memberDocument.MemberName = params.MemberName
			memberDocument.UserID = discordDocument.UserID
			memberDocument.Username = discordDocument.Username
			memberDocument.Roles = discordDocument.Roles
			memberDocument.PointsNum = discordDocument.PointsNum
			if memberDocument.WalletAddress == nil {
				memberDocument.WalletAddress = &[]string{}
			}
			if memberDocument.CustomProducts == nil {
				memberDocument.CustomProducts = &[]discord.CustomProductObj{}
			}
			// Insert this new document in DB and
			AddmemberPoint(memberDocument, &params.PointId)
		} else {
			update := bson.M{
				"$set": bson.M{
					"discord_user_id": discordDocument.UserID,
					"username":        discordDocument.Username,
					"roles":           discordDocument.Roles,
				},
				"$inc": bson.M{
					"points_num": discordDocument.PointsNum,
				}}
			_, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).UpdateOne(context.Background(), memberfilter, update)
			if err != nil {
				return err
			}
		}
		// Removing the discord document after disord merge
		RemoveMongoDocumentByIdFromAllMembers(*discordDocument.Id)

	} else if params.MergeType == discord.MergeTypeWallet && params.WalletMergeAddress != nil {
		var walletDocument discord.PointMemberView
		filter := bson.M{
			"walletaddress": bson.M{
				"$elemMatch": bson.M{
					"$eq": params.WalletMergeAddress,
				},
			},
			"point_id": params.PointId,
		}
		err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).FindOne(context.Background(), filter).Decode(&walletDocument)
		if err != nil {
			return err
		}
		if !firstMerge && *walletDocument.Id == *memberDocumentView.Id {
			return nil
		}

		if firstMerge {
			memberDocument.PointId = &params.PointId
			memberDocument.MemberID = &params.MemberID
			memberDocument.MemberName = params.MemberName
			if memberDocument.CustomProducts == nil {
				memberDocument.CustomProducts = &[]discord.CustomProductObj{}
			}
			if memberDocument.WalletAddress == nil {
				memberDocument.WalletAddress = &[]string{}
			}
			*memberDocument.WalletAddress = append(*memberDocument.WalletAddress, *params.WalletMergeAddress)
			memberDocument.PointsNum = walletDocument.PointsNum
			// Insert this new document in DB and
			AddmemberPoint(memberDocument, &params.PointId)
		} else {
			update := bson.M{
				"$push": bson.M{
					"walletaddress": params.WalletMergeAddress,
				},
				"$inc": bson.M{
					"points_num": walletDocument.PointsNum,
				}}
			_, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).UpdateOne(context.Background(), memberfilter, update)
			if err != nil {
				return err
			}
		}
		// Removing the wallet document after wallet merge
		RemoveMongoDocumentByIdFromAllMembers(*walletDocument.Id)

	} else if params.MergeType == discord.MergeTypeCustomProduct && params.ProductID != nil && params.UniqueUserId != nil {
		var customProductDocument discord.PointMemberView
		objectToMatch := bson.M{
			"product_id":     params.ProductID,
			"unique_user_id": params.UniqueUserId,
		}
		customProductObject := discord.CustomProductObj{
			ProductID:    *params.ProductID,
			UniqueUserId: *params.UniqueUserId,
		}
		filter := bson.M{
			"custom_products": bson.M{
				"$elemMatch": objectToMatch,
			},
			"point_id": params.PointId,
		}
		err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).FindOne(context.Background(), filter).Decode(&customProductDocument)
		if err != nil {
			return err
		}
		if !firstMerge && *customProductDocument.Id == *memberDocumentView.Id {
			return nil
		}

		if firstMerge {
			memberDocument.PointId = &params.PointId
			memberDocument.MemberID = &params.MemberID
			memberDocument.MemberName = params.MemberName
			if memberDocument.WalletAddress == nil {
				memberDocument.WalletAddress = &[]string{}
			}
			if memberDocument.CustomProducts == nil {
				memberDocument.CustomProducts = &[]discord.CustomProductObj{}
			}
			*memberDocument.CustomProducts = append(*memberDocument.CustomProducts, customProductObject)
			memberDocument.PointsNum = customProductDocument.PointsNum
			// Insert this new document in DB and
			AddmemberPoint(memberDocument, &params.PointId)
		} else {
			update := bson.M{
				"$push": bson.M{
					"custom_products": objectToMatch,
				},
				"$inc": bson.M{
					"points_num": customProductDocument.PointsNum,
				}}
			_, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).UpdateOne(context.Background(), memberfilter, update)
			if err != nil {
				return err
			}
		}
		// Removing the wallet document after wallet merge
		RemoveMongoDocumentByIdFromAllMembers(*customProductDocument.Id)

	} else if params.MergeType == discord.MergeTypeTelegram && params.JoineeChatId != nil {
		var telegramDocument discord.PointMemberView
		filter := bson.M{
			"joinee_chat_id": params.JoineeChatId,
			"point_id":       params.PointId,
		}
		err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).FindOne(context.Background(), filter).Decode(&telegramDocument)
		if err != nil {
			return err
		}
		if !firstMerge && *telegramDocument.Id == *memberDocumentView.Id {
			return nil
		}

		if firstMerge {
			memberDocument.PointId = &params.PointId
			memberDocument.MemberID = &params.MemberID
			memberDocument.MemberName = params.MemberName
			memberDocument.JoineeChatId = telegramDocument.JoineeChatId
			memberDocument.JoineeFirstName = telegramDocument.JoineeFirstName
			memberDocument.ChatName = telegramDocument.ChatName
			memberDocument.PointsNum = telegramDocument.PointsNum
			if memberDocument.WalletAddress == nil {
				memberDocument.WalletAddress = &[]string{}
			}
			if memberDocument.CustomProducts == nil {
				memberDocument.CustomProducts = &[]discord.CustomProductObj{}
			}
			// Insert this new document in DB and
			AddmemberPoint(memberDocument, &params.PointId)
		} else {
			update := bson.M{
				"$set": bson.M{
					"joinee_chat_id":    telegramDocument.JoineeChatId,
					"joinee_first_name": telegramDocument.JoineeFirstName,
					"chat_name":         telegramDocument.ChatName,
				},
				"$inc": bson.M{
					"points_num": telegramDocument.PointsNum,
				}}
			_, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).UpdateOne(context.Background(), memberfilter, update)
			if err != nil {
				return err
			}
		}
		// Removing the discord document after disord merge
		RemoveMongoDocumentByIdFromAllMembers(*telegramDocument.Id)

	} else if params.MergeType == discord.MergeTypeTwitter && params.TwitterUserId != nil {
		var twitterDocument discord.PointMemberView
		filter := bson.M{
			"twitter_user_id": params.TwitterUserId,
			"point_id":        params.PointId,
		}
		err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).FindOne(context.Background(), filter).Decode(&twitterDocument)
		if err != nil {
			return err
		}
		if !firstMerge && *twitterDocument.Id == *memberDocumentView.Id {
			return nil
		}

		if firstMerge {
			memberDocument.PointId = &params.PointId
			memberDocument.MemberID = &params.MemberID
			memberDocument.MemberName = params.MemberName
			memberDocument.TwitterUserId = params.TwitterUserId
			memberDocument.TwitterUserName = twitterDocument.TwitterUserName
			memberDocument.TwitterName = twitterDocument.TwitterName
			memberDocument.PointsNum = twitterDocument.PointsNum
			if memberDocument.WalletAddress == nil {
				memberDocument.WalletAddress = &[]string{}
			}
			if memberDocument.CustomProducts == nil {
				memberDocument.CustomProducts = &[]discord.CustomProductObj{}
			}
			// Insert this new document in DB and
			AddmemberPoint(memberDocument, &params.PointId)
		} else {
			update := bson.M{
				"$set": bson.M{
					"twitter_user_id":   twitterDocument.TwitterUserId,
					"twitter_user_name": twitterDocument.TwitterUserName,
					"twitter_name":      twitterDocument.TwitterName,
				},
				"$inc": bson.M{
					"points_num": twitterDocument.PointsNum,
				}}
			_, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionMembers).UpdateOne(context.Background(), memberfilter, update)
			if err != nil {
				return err
			}
		}
		// Removing the discord document after disord merge
		RemoveMongoDocumentByIdFromAllMembers(*twitterDocument.Id)

	}

	// The documents have been merged according to the merge type
	// 3. Update the points in Postgres
	UpdateMemberPoints(params.PointId, params.MemberID)

	return nil
}
