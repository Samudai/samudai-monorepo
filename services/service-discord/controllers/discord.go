package controllers

import (
	"net/http"
	"strconv"

	"github.com/Samudai/service-discord/internal/discord"
	pkg "github.com/Samudai/service-discord/pkg/discord"
	"github.com/gin-gonic/gin"
)

// CreateDiscordParams is the params for creating a discord guild
type CreateDiscordParams struct {
	GuildData pkg.Guild `json:"guild_data" binding:"required"`
}

// CreateOrUpdate creates a new or updates discord guild
func CreateOrUpdate(c *gin.Context) {
	var params CreateDiscordParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.AddUpdateDiscord(params.GuildData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GuildsByUserID(c *gin.Context) {
	userID := c.Param("discord_user_id")

	guilds, err := discord.GetGuildsByUserID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, guilds)
}

func Delete(c *gin.Context) {
	guildID := c.Param("guild_id")

	err := discord.DeleteGuild(guildID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type AuthUserParam struct {
	MemberID    string `json:"member_id" binding:"required"`
	AuthCode    string `json:"auth_code" binding:"required"`
	RedirectURI string `json:"redirect_uri" binding:"required"`
}

func AuthUser(c *gin.Context) {
	var params AuthUserParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	token, err := discord.Auth(params.RedirectURI, params.AuthCode, params.MemberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	userData, err := discord.GetUserData(token.Token, params.MemberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user_data": userData})
}

func GuildAdmin(c *gin.Context) {
	memberID := c.Param("member_id")

	token, err := discord.Auth("", "", memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	guild, err := discord.GetGuildAdmin(token.Token, memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, guild)
}

func DisconnectDiscord(c *gin.Context) {
	memberID := c.Param("member_id")

	err := discord.DisconnectMem(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

// Point

// CreateOrUpdate creates a new or updates discord guild
func CreateOrUpdatePoint(c *gin.Context) {
	var params CreateDiscordParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.AddUpdateDiscordPoint(params.GuildData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GuildsByUserIDPoint(c *gin.Context) {
	userID := c.Param("discord_user_id")

	guilds, err := discord.GetGuildsByUserIDPoint(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, guilds)
}
func GuildByDiscordIdGuildId(c *gin.Context) {
	guildID := c.Param("guild_id")
	userID := c.Param("discord_user_id")

	guilds, err := discord.GuildByDiscordIdGuildId(userID, guildID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, guilds)
}

func DeletePoint(c *gin.Context) {
	guildID := c.Param("guild_id")

	err := discord.DeleteGuildPoint(guildID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func AuthUserPoint(c *gin.Context) {
	var params AuthUserParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	token, err := discord.AuthPoint(params.RedirectURI, params.AuthCode, params.MemberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	userData, err := discord.GetUserDataPoint(token.Token, params.MemberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user_data": userData})
}

func GuildAdminPoint(c *gin.Context) {
	memberID := c.Param("member_id")

	token, err := discord.AuthPoint("", "", memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	guild, err := discord.GetGuildAdminPoint(token.Token, memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, guild)
}

func DisconnectDiscordPoint(c *gin.Context) {
	memberID := c.Param("member_id")

	err := discord.DisconnectMemPoint(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
func AddMetric(c *gin.Context) {
	err := discord.AddGuildMetric()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
func GetMetric(c *gin.Context) {
	pointId := c.Param("point_id")
	days, err := strconv.Atoi(c.Param("days"))
	metrics, err := discord.GetGuildMetric(days, pointId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, metrics)
}
func RemoveDuplicate(c *gin.Context) {
	err := discord.RemoveDuplicate()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
