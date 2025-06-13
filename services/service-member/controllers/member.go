package controllers

import (
	"net/http"

	"github.com/Samudai/service-member/internal/member"
	pkg "github.com/Samudai/service-member/pkg/member"
	"github.com/gin-gonic/gin"
)

// CreateMember creates a new member
func CreateMember(c *gin.Context) {
	var params pkg.CreateMemberParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	memberID, err := member.Create(params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"member_id": memberID})
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

	err := member.CreateMemberDiscord(params.MemberID, params.Discord)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

// FetchMember returns a member by member_id/discord_user_id/wallet_address/username
func FetchMember(c *gin.Context) {
	var params pkg.FetchMemberParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	member, err := member.FetchMember(params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"member": member})
}

func FetchIMember(c *gin.Context) {
	var params pkg.FetchMemberParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	member, err := member.FetchIMember(params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"member": member})
}

func GetMembersBulk(c *gin.Context) {
	var params struct {
		MemberIDs []string `json:"member_ids"`
		Query     string   `json:"query"`
	}
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	members, err := member.GetMembersBulk(params.MemberIDs, params.Query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"members": members})
}

// UpdateMember updates a member
func UpdateMember(c *gin.Context) {
	var params pkg.CreateMemberParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.UpdateMember(params.Member)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateMemberOpportunityStatusParams struct {
	MemberID           string `json:"member_id"`
	OpenForOpportunity bool   `json:"open_for_opportunity"`
}

func UpdateMemberOpportunityStatus(c *gin.Context) {
	var params UpdateMemberOpportunityStatusParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.UpdateMemberOpportunityStatus(params.MemberID, params.OpenForOpportunity)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateHourlyRateParams struct {
	MemberID   string `json:"member_id"`
	Currency   string `json:"currency"`
	HourlyRate string `json:"hourly_rate"`
}

// UpdateMember updates a member hourly rate
func UpdateMemberHourlyRate(c *gin.Context) {
	var params UpdateHourlyRateParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// fmt.Println("Memberid:   ", params.MemberID)
	err := member.UpdateMemberHourlyRate(params.MemberID, params.Currency, params.HourlyRate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func UpdateMemberFeaturedProjects(c *gin.Context) {
	var params pkg.UpdateMemberFeaturedProjectsParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := member.UpdateMemberFeaturedProjects(params)
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

	err := member.UpdateMemberDiscord(params.MemberID, params.Discord)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

// DeleteMember deletes a member
func DeleteMember(c *gin.Context) {
	memberID := c.Param("member_id")
	err := member.DeleteMember(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateProfilePictureParams struct {
	MemberID string `json:"member_id"`
	URL      string `json:"url"`
}

func UpdateProfilePicture(c *gin.Context) {
	var params UpdateProfilePictureParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.UpdateProfilePicture(params.MemberID, params.URL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateOppurtunityPrefParams struct {
	MemberID string `json:"member_id"`
	Pref     bool   `json:"pref"`
}

func UpdateOppurtunityPref(c *gin.Context) {
	var params UpdateOppurtunityPrefParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.UpdateOppurtunityPref(params.MemberID, params.Pref)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateCeramicStreamParams struct {
	MemberID      string `json:"member_id" binding:"required"`
	CeramicStream string `json:"ceramic_stream" binding:"required"`
}

func UpdateCeramicStream(c *gin.Context) {
	var params UpdateCeramicStreamParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.UpdateCeramicStream(params.MemberID, params.CeramicStream)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateSubdomainParams struct {
	MemberID  string `json:"member_id" binding:"required"`
	Subdomain string `json:"subdomain" binding:"required"`
}

func UpdateSubdomain(c *gin.Context) {
	var params UpdateSubdomainParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.UpdateSubdomain(params.MemberID, params.Subdomain)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateSkillsParams struct {
	MemberID string   `json:"member_id" binding:"required"`
	Skills   []string `json:"skills" binding:"required"`
}

func UpdateSkills(c *gin.Context) {
	var params UpdateSkillsParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.UpdateSkills(params.MemberID, params.Skills)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateDomainTagsParams struct {
	MemberID   string   `json:"member_id" binding:"required"`
	DomainTags []string `json:"domain_tags_for_work" binding:"required"`
}

func UpdateDomainTags(c *gin.Context) {
	var params UpdateDomainTagsParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.UpdateDomainTags(params.MemberID, params.DomainTags)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateTagsParams struct {
	MemberID string   `json:"member_id" binding:"required"`
	Tags     []string `json:"tags" binding:"required"`
}

func UpdateTags(c *gin.Context) {
	var params UpdateTagsParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.UpdateTags(params.MemberID, params.Tags)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateNameParams struct {
	MemberID string `json:"member_id" binding:"required"`
	Name     string `json:"name" binding:"required"`
	Pfp      string `json:"profile_picture" binding:"required"`
	Email    string `json:"email" binding:"required"`
}

func UpdateNamePfpEmail(c *gin.Context) {
	var params UpdateNameParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.UpdateNameAndPfp(params.MemberID, params.Name, params.Pfp, params.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateUsernameParams struct {
	MemberID string `json:"member_id" binding:"required"`
	Username string `json:"username" binding:"required"`
}

func UpdateUsername(c *gin.Context) {
	var params UpdateUsernameParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.UpdateUsername(params.MemberID, params.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateUserOriginalNameParams struct {
	MemberID string `json:"member_id" binding:"required"`
	Name     string `json:"name" binding:"required"`
}

func UpdateUserOriginalName(c *gin.Context) {
	var params UpdateUserOriginalNameParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.UpdateUserOriginalName(params.MemberID, params.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateEmailParams struct {
	MemberID string `json:"member_id" binding:"required"`
	Email    string `json:"email" binding:"required"`
}

func UpdateEmail(c *gin.Context) {
	var params UpdateEmailParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.UpdateEmail(params.MemberID, params.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GetIsEmailUpdated(c *gin.Context) {
	memberId := c.Param("member_id")
	emailUpdated, err := member.GetIsEmailUpdated(memberId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"email_updated": emailUpdated})
}

func DeleteDiscordMemberData(c *gin.Context) {
	memberId := c.Param("member_id")
	err := member.DeleteDiscordMemberData(memberId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func CheckDiscordExist(c *gin.Context) {
	memberId := c.Param("member_id")
	exist, username, err := member.CheckDiscordExist(memberId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"exist": exist, "username": username})
}

func CheckUsernameExist(c *gin.Context) {
	username := c.Param("username")
	exist, err := member.CheckUsernameExist(username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"exist": exist})
}

func SearchMember(c *gin.Context) {
	var params pkg.SearchMemberParams
	if err := c.BindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	members, err := member.SearchNFilter(params.Query, params.Limit, params.Offset, params.Skills, params.Team, params.Tags,
		params.OpenForOpportunity, params.OfoFilers, params.MemberID, params.Sort)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, members)
}

func GetInviteCount(c *gin.Context) {
	memberID := c.Param("member_id")
	count, err := member.GetInviteCount(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"count": count})
}

func GetMemberWorkInProgress(c *gin.Context) {
	memberID := c.Param("member_id")
	memberWorkProgress, err := member.GetMemberWorkInProgress(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"member_work_progress": memberWorkProgress})
}

func GetAllContributors(c *gin.Context) {
	contributors, err := member.GetAllContributors()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"contributors": contributors})
}

func GetAllOpenToWorkContributor(c *gin.Context) {
	contributors, err := member.GetAllOpenToWorkContributor()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"contributors": contributors})
}

func GetBulkMemberForDiscovery(c *gin.Context) {
	var params struct {
		MemberIDs []string `json:"member_ids"`
		MemberId  string   `json:"member_id"`
	}
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	member_data, err := member.GetBulkMemberForDiscovery(params.MemberIDs, params.MemberId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": member_data})

}

func GetBulkTelegramChatIds(c *gin.Context) {
	var params struct {
		MemberIDs []string `json:"member_ids"`
	}

	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	telegrams, err := member.GetBulkTelegramChatIds(params.MemberIDs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"telegram": telegrams})

}
