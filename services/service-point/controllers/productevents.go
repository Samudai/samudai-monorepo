package controllers

import (
	"net/http"

	"github.com/Samudai/service-point/internal/point"
	pkg "github.com/Samudai/service-point/pkg/point"
	"github.com/gin-gonic/gin"
)

type AddProdcutEventsParam struct {
	ProdcutEvents pkg.ProdcutEvents `json:"product_events"`
}

func AddProdcutEvents(c *gin.Context) {
	var param AddProdcutEventsParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.AddProdcutEvents(param.ProdcutEvents)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
func UpdateProdcutEvents(c *gin.Context) {
	var param AddProdcutEventsParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.UpdateProdcutEvents(param.ProdcutEvents)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateProdcutEventsParam struct {
	ProdcutEvents pkg.UpdateProdcutEvents `json:"product_events"`
}

func UpdateProdcutEventsPoint(c *gin.Context) {
	var param UpdateProdcutEventsParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.UpdateProdcutEventsPoint(param.ProdcutEvents)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func DeleteProdcutEvents(c *gin.Context) {
	pointID := c.Param("point_id")
	productID := c.Param("product_id")
	eventName := c.Param("event_name")
	err := point.DeleteProdcutEvents(pointID, productID, eventName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}