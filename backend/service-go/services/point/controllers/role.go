package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/Samudai/backend/services/point/internal/point"
	pkg "github.com/Samudai/backend/services/point/pkg/point"
)

type CreateRoleParams struct {
	Role pkg.Role `json:"role"`
}

func CreateRole(c *gin.Context) {
	var params CreateRoleParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	roleID, err := point.CreatePointRole(params.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"role_id": roleID})
}
func UpdateDiscordRole(c *gin.Context) {
	var params CreateRoleParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.UpdateDiscordRole(params.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type CreateRolesParams struct {
	Roles []pkg.Role `json:"roles"`
}

func CreateRoles(c *gin.Context) {
	var params CreateRolesParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.CreatePointRoles(params.Roles)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func ListRolesForPoint(c *gin.Context) {
	pointID := c.Param("point_id")

	roles, err := point.ListPointRoles(pointID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"roles": roles})
}
