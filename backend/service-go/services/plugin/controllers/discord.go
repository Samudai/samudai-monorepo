package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/Samudai/backend/services/plugin/internal/discord"
)

func CheckMemberDiscordExists(c *gin.Context) {
	discordid := c.Param("discord_id")
	exists, discordId, err := discord.CheckMemberDiscordExists(discordid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"exists": exists, "username": discordId})
}
