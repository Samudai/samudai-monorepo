package controllers

import (
	"net/http"

	"github.com/Samudai/service-point/internal/point"
	pkg "github.com/Samudai/service-point/pkg/point"
	"github.com/gin-gonic/gin"
)

type CreateAccessParam struct {
	Access pkg.Access `json:"access"`
}

func CreateAccess(c *gin.Context) {
	var param CreateAccessParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.CreateAccess(param.Access)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GetAccessByPointID(c *gin.Context) {
	pointID := c.Param("point_id")
	access, err := point.GetAccessByPointID(pointID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, access)
}

func UpdateAccess(c *gin.Context) {
	var param CreateAccessParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.UpdateAccess(param.Access)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateAllAccessParam struct {
	Accesses []pkg.Access `json:"accesses" binding:"required"`
}

func UpdateAllAccesses(c *gin.Context) {
	var param UpdateAllAccessParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.UpdateAllAccesses(param.Accesses)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func DeleteAccess(c *gin.Context) {
	pointID := c.Param("point_id")
	err := point.DeleteAccess(pointID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type GetAccessForMemberParam struct {
	MemberID string `json:"member_id"`
	PointID  string `json:"point_id"`
}

func GetAccessForMember(c *gin.Context) {
	var param GetAccessForMemberParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	access, err := point.GetAccessForMember(param.MemberID, param.PointID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, access)
}

type GetAccessForMemberByGuildIdParam struct {
	DiscordUserID string `json:"discord_user_id"`
	GuildId       string `json:"guild_id"`
}

func GetAccessForMemberByGuildId(c *gin.Context) {
	var param GetAccessForMemberByGuildIdParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	access, err := point.GetAccessForMemberByGuildId(param.DiscordUserID, param.GuildId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, access)
}

type GetAccessForMemberByTelegramUsernameParam struct {
	GroupChatId  string `json:"group_chat_id"`
	FromUsername string `json:"from_username"`
}

func GetAccessForMemberByTelegramUsername(c *gin.Context) {
	var param GetAccessForMemberByTelegramUsernameParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	access, err := point.GetAccessForMemberByTelegramUsername(param.GroupChatId, param.FromUsername)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, access)
}

func CreateAccesses(c *gin.Context) {
	var param pkg.CreateAccessesParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.CreateAccesses(param.Admin, param.View, param.PointID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func UpdateAccesses(c *gin.Context) {
	var param pkg.CreateAccessesParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.UpdateAccesses(param.Admin, param.View, param.PointID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func AddMemberDiscord(c *gin.Context) {
	var param pkg.AddRoleMemberParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := point.AddMemberDiscord(param.PointID, param.MemberID, param.Access)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func AddRoleDiscord(c *gin.Context) {
	var param pkg.AddRoleDiscordParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := point.AddRoleDiscord(param.PointID, param.Access, param.DiscordRoleID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
