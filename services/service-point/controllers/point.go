package controllers

import (
	"net/http"

	"github.com/Samudai/service-point/internal/point"
	pkg "github.com/Samudai/service-point/pkg/point"
	"github.com/gin-gonic/gin"
)

type CreatePointParams struct {
	Point pkg.Point `json:"point"`
}

func CreatePoint(c *gin.Context) {
	var params CreatePointParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	pointID, err := point.CreatePoint(params.Point)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"point_id": pointID})
}

func UpdatePointsNum(c *gin.Context) {
	var params pkg.UpdatePointsNumParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.UpdatePointsNum(params.MemberID, params.PointID, params.Point)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateGuildIdParams struct {
	PointID    string `json:"point_id"`
	GuildID    string `json:"guild_id"`
	ServerName string `json:"server_name"`
}

func UpdateGuildId(c *gin.Context) {
	var params UpdateGuildIdParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.UpdateGuildId(params.PointID, params.GuildID, params.ServerName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GetPointByMemberID(c *gin.Context) {
	memberID := c.Param("member_id")

	Point, err := point.GetPointByMemberID(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"point": Point})
}

func GetPointByGuildID(c *gin.Context) {
	guildID := c.Param("guild_id")

	Point, err := point.GetPointByGuildID(guildID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"point": Point})
}

func GetGuildByPointID(c *gin.Context) {
	pointID := c.Param("point_id")

	Point, err := point.GetGuildByPointID(pointID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"point": Point})
}

func GetPointByPointID(c *gin.Context) {
	pointID := c.Param("point_id")

	Point, err := point.GetPointByPointID(pointID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"point": Point})
}
func GetPointIdsByMemberId(c *gin.Context) {
	memberID := c.Param("member_id")

	PointIds, err := point.GetPointIdsByMemberId(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"point": PointIds})
}
