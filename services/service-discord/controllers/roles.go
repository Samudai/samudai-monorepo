package controllers

import (
	"net/http"

	"github.com/Samudai/service-discord/internal/discord"
	pkg "github.com/Samudai/service-discord/pkg/discord"
	"github.com/gin-gonic/gin"
)

// AddRoles adds roles to a discord guild
func AddRoles(c *gin.Context) {
	var params pkg.AddRolesParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.AddRoles(params.GuildID, params.Roles)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GetRolesByGuildID(c *gin.Context) {
	guildID := c.Param("guild_id")

	roles, err := discord.GetRolesByGuildID(guildID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, roles)
}

func UpdateRole(c *gin.Context) {
	var params pkg.UpdateRoleParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.UpdateRole(params.GuildID, params.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func DeleteRole(c *gin.Context) {
	guildID := c.Param("guild_id")
	roleID := c.Param("role_id")

	err := discord.DeleteRole(guildID, roleID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

// Point 

// AddRoles adds roles to a discord guild
func AddRolesPoint(c *gin.Context) {
	var params pkg.AddRolesParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.AddRolesPoint(params.GuildID, params.Roles)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GetRolesByGuildIDPoint(c *gin.Context) {
	guildID := c.Param("guild_id")

	roles, err := discord.GetRolesByGuildIDPoint(guildID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, roles)
}

func UpdateRolePoint(c *gin.Context) {
	var params pkg.UpdateRoleParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.UpdateRolePoint(params.GuildID, params.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func DeleteRolePoint(c *gin.Context) {
	guildID := c.Param("guild_id")
	roleID := c.Param("role_id")

	err := discord.DeleteRolePoint(guildID, roleID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
