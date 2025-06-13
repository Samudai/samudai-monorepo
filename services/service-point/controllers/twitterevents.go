package controllers

import (
	"net/http"

	"github.com/Samudai/service-point/internal/point"
	pkg "github.com/Samudai/service-point/pkg/point"
	"github.com/gin-gonic/gin"
)

type AddTwitterEventsParam struct {
	TwitterEvents pkg.TwitterPoints `json:"twitter_points"`
}

func AddTwitterPoints(c *gin.Context) {
	var params AddTwitterEventsParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.AddTwitterPoints(params.TwitterEvents)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func UpdateTwitterPoints(c *gin.Context) {
	var params AddTwitterEventsParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.UpdateTwitterPoints(params.TwitterEvents)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = ClearTwitterPointCache(params.TwitterEvents.PointID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GetTwitterPointsByPointId(c *gin.Context) {
	pointID := c.Param("point_id")

	Points, err := point.GetTwitterPointsByPointId(pointID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"points": Points})
}
