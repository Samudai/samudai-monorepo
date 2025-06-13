package controllers

import (
	"fmt"
	"net/http"
	"sync"

	"github.com/Samudai/service-discord/internal/discord"
	pkg "github.com/Samudai/service-discord/pkg/discord"
	"github.com/gin-gonic/gin"
)

// AddmembersParams is the params for adding members to a discord guild

func CheckFunc(str string, b int) {
	fmt.Printf("String: %s \n Int: %d \n", str, b)

}

type AddmembersParams struct {
	Members []pkg.Member `json:"members"`
}

// Addmembers adds members to a discord guild
func Addmembers(c *gin.Context) {
	var params AddmembersParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.Addmembers(params.Members)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateMemberParams struct {
	Member pkg.Member `json:"member"`
}
type UpdateMemberNumParams struct {
	DiscordUserID string  `json:"discord_user_id"`
	GuildID       string  `json:"guild_id"`
	Points        float64 `json:"points"`
}

func UpdateMember(c *gin.Context) {
	var params UpdateMemberParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.UpdateMember(params.Member)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func DeleteMember(c *gin.Context) {
	guildID := c.Param("guild_id")
	userID := c.Param("user_id")

	err := discord.DeleteMember(guildID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

// Point

type AddmembersPointParams struct {
	PointMembers []pkg.PointMember `json:"members"`
	PointId      *string           `json:"point_id"`
}

// Addmembers adds members to a discord guild
func AddmembersPoint(c *gin.Context) {
	var params AddmembersPointParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.AddmembersPoint(params.PointMembers, params.PointId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type AddDiscordmembersPointParams struct {
	PointMembers []pkg.PointMember `json:"members"`
	PointId      *string           `json:"point_id"`
	MemberIDs    []string          `json:"member_ids"`
}
type AddDiscordmemberPointParams struct {
	PointMember []pkg.PointMember `json:"members"`
	PointId     *string           `json:"point_id"`
	MemberID    string            `json:"member_id"`
}

func AddDiscordmembersPoint(c *gin.Context) {
	var params AddDiscordmembersPointParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.AddDiscordmembersPoint(params.PointMembers, params.PointId, params.MemberIDs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
func AddDiscordmemberPoint(c *gin.Context) {
	var params AddDiscordmemberPointParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.AddDiscordmemberPoint(params.PointMember, params.PointId, params.MemberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func UpdateMemberPoint(c *gin.Context) {
	var params UpdateMemberParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.UpdateMemberPoint(params.Member)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func UpdateMemberPointsNum(c *gin.Context) {
	var params UpdateMemberNumParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.UpdateMemberPointsNum(params.DiscordUserID, params.GuildID, params.Points)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func DeleteMemberPoint(c *gin.Context) {
	guildID := c.Param("guild_id")
	userID := c.Param("user_id")

	err := discord.DeleteMemberPoint(guildID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type MergeParam struct {
	Merge pkg.MergeMultiple `json:"merge"`
}

func MergeAll(c *gin.Context) {
	var params MergeParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if params.Merge.UserID != nil && params.Merge.MergeType == "discord" {
		pointIDs, err := discord.GetPointIdsByMemberId(*params.Merge.MemberID)
		if err != nil {
			fmt.Errorf("Error getting point ids")
		}
		params.Merge.PointId = pointIDs
	} else if len(*params.Merge.WalletAddress) > 0 && params.Merge.MergeType == "wallet" {
		pointIDs, err := discord.GetPointsForWalletAddress(*params.Merge.MergeID)
		if err != nil {
			fmt.Errorf("Error getting point ids")
		}
		params.Merge.PointId = pointIDs
	}
	var wg sync.WaitGroup
	errChan := make(chan error, len(params.Merge.PointId))

	for i := 0; i < len(params.Merge.PointId); i++ {
		go func(i int) {
			defer wg.Done()

			fmt.Print(i)

			var params2 pkg.Merge
			params2.MemberID = params.Merge.MemberID
			params2.PointId = &params.Merge.PointId[i]
			params2.MemberName = params.Merge.MemberName
			params2.UserID = params.Merge.UserID
			params2.WalletAddress = params.Merge.WalletAddress
			err := discord.MergeAll(params2, i)
			if err != nil {
				errChan <- err // Send any error to the errChan
			}
		}(i)
		wg.Add(1)
	}

	go func() {
		wg.Wait()
		close(errChan)
	}()

	// Collect and handle errors
	var errors []error
	for err := range errChan {
		if err != nil {
			errors = append(errors, err)
		}
	}

	if len(errors) > 0 {
		// Handle errors, e.g., by returning the first error
		c.JSON(http.StatusInternalServerError, gin.H{"error": errors[0].Error()})
		return
	}

	// discord.UpdateMemberMergingStatus(*params.Merge.MemberID, false)
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type MergeV2Param struct {
	Merge pkg.MergeMultipleV2 `json:"merge"`
}

func MergeAllV2(c *gin.Context) {
	var params MergeV2Param
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Fetch all the PointIds from All Members for the respective MergeType
	// 1. Discord
	// 2. WalletAddress
	// 3. Custom Product
	// 4. Telegram
	// 5. Twitter

	pointIDs, err := discord.GetPointIdsByMergeType(params.Merge)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	params.Merge.PointIds = pointIDs

	// Adding go routine to the for loop for concurrency
	var wg sync.WaitGroup
	errChan := make(chan error, len(params.Merge.PointIds))

	for i := 0; i < len(params.Merge.PointIds); i++ {
		go func(i int) {
			defer wg.Done()
			fmt.Print(i)
			var params2 pkg.MergeV2
			params2.MergeType = params.Merge.MergeType
			params2.PointId = params.Merge.PointIds[i]
			params2.ProductID = params.Merge.ProductID
			params2.UniqueUserId = params.Merge.UniqueUserId
			params2.DiscordID = params.Merge.DiscordID
			params2.WalletMergeAddress = params.Merge.WalletMergeAddress
			params2.MemberID = params.Merge.MemberID
			params2.MemberName = params.Merge.MemberName
			params2.JoineeChatId = params.Merge.JoineeChatId
			params2.TwitterUserId = params.Merge.TwitterUserId

			// Call the mergeForEachPointId function for all the pointIds. This will only merge the documents in All members and update the respective  points in postico for that member which can be called in a go routine.

			err := discord.MergeEachPointId(params2)
			if err != nil {
				errChan <- err // Send any error to the errChan
			}
		}(i)
		wg.Add(1)

	}
	go func() {
		wg.Wait()
		close(errChan)
	}()
	// handle errors
	var errors []error
	for err := range errChan {
		if err != nil {
			errors = append(errors, err)
		}
	}
	if len(errors) > 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": errors[0].Error()})
		return
	}

	// After go routine is completed execute Merge Activity
	var mergeActivityParams pkg.MergeActivityV2

	mergeActivityParams.MergeType = params.Merge.MergeType
	mergeActivityParams.ProductID = params.Merge.ProductID
	mergeActivityParams.UniqueUserId = params.Merge.UniqueUserId
	mergeActivityParams.DiscordID = params.Merge.DiscordID
	mergeActivityParams.WalletMergeAddress = params.Merge.WalletMergeAddress
	mergeActivityParams.MemberID = params.Merge.MemberID
	mergeActivityParams.JoineeChatId = params.Merge.JoineeChatId
	mergeActivityParams.TwitterUserId = params.Merge.TwitterUserId

	discord.MergeActivityV2(mergeActivityParams)
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
func GetPointsForWalletAddress(c *gin.Context) {
	walletAddress := c.Param("wallet_address")

	pointIds, err := discord.GetPointsForWalletAddress(walletAddress)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, pointIds)
}

type UpdateMemberPointsParam struct {
	PointId  string `json:"point_id"`
	MemberId string `json:"member_id"`
}

func UpdateMemberPoints(c *gin.Context) {
	var params UpdateMemberPointsParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := discord.UpdateMemberPoints(params.PointId, params.MemberId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

// func MergeActivity(c *gin.Context) {
// 	var params MergeParam
// 	if err := c.ShouldBindJSON(&params); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	err := discord.MergeActivity(params.Merge)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"message": "success"})
// }

// func AddWalletActivity(c *gin.Context) {
// 	var params pkg.ActivityWallet
// 	if err := c.ShouldBindJSON(&params); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	err := discord.AddWalletActivity(params)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"message": "success"})
// }

// func Test(c *gin.Context) {
// 	wallet_address := c.Param("wallet_address")
// 	point_id := c.Param("point_id")
// 	points, err := strconv.Atoi(c.Param("points"))
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid points value"})
// 		return
// 	}
// 	err = discord.UpdateMemberWalletsPointsNum(wallet_address, point_id, points)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"message": "success"})
// }

// func GetNFTs(c *gin.Context) {
// 	wallet_address := c.Param("wallet_address")
// 	token_address := c.Param("token_address")
// 	chain := c.Param("chain")
// 	res, err := discord.GetNFTsForWallet(token_address, wallet_address, chain)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}
// 	c.JSON(http.StatusOK, res)
// }
