package controllers

import (
	"fmt"
	"net/http"

	"github.com/Samudai/service-point/internal/point"
	pkg "github.com/Samudai/service-point/pkg/point"
	"github.com/gin-gonic/gin"
)

// CreateMember creates a new member
func CreateMember(c *gin.Context) {
	var params pkg.Member
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	memberID, err := point.Create(params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"member_id": memberID})
}

func CheckFunc(str string, b int) {
	fmt.Printf("String: %s \n Int: %d \n", str, b)

}

// UpdateMember updates a member
func UpdateMember(c *gin.Context) {
	var params pkg.Member
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.UpdateMember(params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func ListMembersForPoint(c *gin.Context) {
	pointID := c.Param("point_id")
	var page pkg.Pagination
	if err := c.ShouldBindJSON(&page); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	members, err := point.ListPointMembers(pointID, page.Limit, page.Offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"members": members})
}

// FetchMember returns a member by member_id/discord_user_id/wallet_address/username
func FetchMember(c *gin.Context) {
	var params pkg.FetchMemberParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	member, err := point.FetchMember(params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"member": member})
}

type FetchMemberIdByDiscordParams struct {
	DiscordUserIds []string `json:"discord_user_ids"`
}

func FetchMemberIdByDiscord(c *gin.Context) {
	var params FetchMemberIdByDiscordParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	members, err := point.FetchMemberIdByDiscord(params.DiscordUserIds)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, members)
}

func UpdateMemberWalletAddress(c *gin.Context) {
	var params pkg.Member
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.UpdateMemberWalletAddress(params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateMemberEmailNameParams struct {
	MemberID      string  `json:"member_id"`
	Email         *string `json:"email"`
	Name          *string `json:"name"`
	EmailVerified bool    `json:"email_verified"`
}

func UpdateMemberEmailName(c *gin.Context) {
	var params UpdateMemberEmailNameParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.UpdateMemberEmailName(params.MemberID, params.Email, params.Name, params.EmailVerified)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateEmailVerificationCodeParams struct {
	MemberID              string  `json:"member_id"`
	EmailVerificationCode *string `json:"email_verification_code"`
}

func UpdateEmailVerificationCode(c *gin.Context) {
	var params UpdateEmailVerificationCodeParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.UpdateEmailVerificationCode(params.MemberID, params.EmailVerificationCode)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateIsOnboardedParams struct {
	MemberID    string `json:"member_id"`
	IsOnboarded bool   `json:"is_onboarded"`
}

func UpdateIsOnboarded(c *gin.Context) {
	var params UpdateIsOnboardedParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.UpdateIsOnboarded(params.MemberID, params.IsOnboarded)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type VerifyEmailForMemberParams struct {
	MemberID              string `json:"member_id"`
	EmailVerificationCode string `json:"email_verification_code"`
}

func VerifyEmailForMember(c *gin.Context) {
	var params VerifyEmailForMemberParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.VerifyEmailForMember(params.MemberID, params.EmailVerificationCode)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type CreateMemberDiscordParams struct {
	MemberID string            `json:"member_id"`
	Discord  pkg.MemberDiscord `json:"discord"`
}

func CreateMemberDiscord(c *gin.Context) {
	var params CreateMemberDiscordParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.CreateMemberDiscord(params.MemberID, params.Discord)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func UpdateMemberDiscord(c *gin.Context) {
	var params CreateMemberDiscordParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.UpdateMemberDiscord(params.MemberID, params.Discord)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func FetchDiscordForMember(c *gin.Context) {
	memberID := c.Param("member_id")

	discord, err := point.FetchDiscordForMember(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"discord": discord})
}

func MapDiscordBulk(c *gin.Context) {
	var params pkg.MapDiscordBulkParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.CreateDAOMembersDiscord(params.Members)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = point.CreateMemberRolesDiscord(params.DiscordMemberRoles)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type CreateDAOMembersDiscordParams struct {
	Members []pkg.PointMember `json:"members"`
}

func CreatePointMembersDiscord(c *gin.Context) {
	var params CreateDAOMembersDiscordParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.UpdateSQLPoints(params.Members)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
