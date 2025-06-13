package controllers

import (
	"net/http"

	"github.com/Samudai/service-plugin/internal/discord"
	"github.com/gin-gonic/gin"
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
