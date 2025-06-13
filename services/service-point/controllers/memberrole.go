package controllers

import (
	"net/http"
	"strconv"

	"github.com/Samudai/service-point/internal/point"
	pkg "github.com/Samudai/service-point/pkg/point"
	"github.com/gin-gonic/gin"
)

type CreateMemberRoleParams struct {
	MemberRole pkg.MemberRole `json:"member_role"`
}

func CreateMemberRole(c *gin.Context) {
	var params CreateMemberRoleParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	memberRoleID, err := point.CreateDAOMemberRole(params.MemberRole)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"member_role_id": memberRoleID})
}

func DeleteMemberRole(c *gin.Context) {
	memberRoleID := c.Param("member_role_id")
	id, err := strconv.Atoi(memberRoleID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = point.DeleteDAOMemberRole(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type AddRolesDiscordParams struct {
	DiscordMemberRoles []pkg.MemberRoleDiscord `json:"dao_member_roles"`
}

// CreateMemberRolesDiscord adds member roles from discord
func CreateMemberRolesDiscord(c *gin.Context) {
	var params AddRolesDiscordParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.CreateMemberRolesDiscord(params.DiscordMemberRoles)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func DeleteMemberRolesDiscord(c *gin.Context) {
	var params AddRolesDiscordParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.DeleteMemberRolesDiscord(params.DiscordMemberRoles)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
