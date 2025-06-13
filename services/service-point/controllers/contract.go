package controllers

import (
	"net/http"

	"github.com/Samudai/service-point/internal/point"
	pkg "github.com/Samudai/service-point/pkg/point"
	"github.com/gin-gonic/gin"
)

type AddContractParam struct {
	Contract pkg.Contract `json:"contract"`
}

func AddContract(c *gin.Context) {
	var param AddContractParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.AddContract(param.Contract)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
func UpdateContract(c *gin.Context) {
	var param AddContractParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.UpdateContract(param.Contract)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateContractEventParam struct {
	Contract pkg.UpdateContract `json:"contract"`
}

func UpdateContractEventPoint(c *gin.Context) {
	var param UpdateContractEventParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.UpdateContractEventPoint(param.Contract)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GetContractByIDs(c *gin.Context) {
	contractAddress := c.Param("contract_address")
	contracts, err := point.GetContractByIDs(contractAddress)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"contracts": contracts})
}
func GetContractsByPointID(c *gin.Context) {
	pointId := c.Param("point_id")
	contracts, err := point.GetContractsByPointID(pointId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"contracts": contracts})
}
func GetContractByContractAddressPointId(c *gin.Context) {
	contractAddress := c.Param("contract_address")
	pointId := c.Param("point_id")
	contracts, err := point.GetContractByContractAddressPointId(contractAddress, pointId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"contracts": contracts})
}

func DeleteContract(c *gin.Context) {
	pointID := c.Param("point_id")
	contractAddress := c.Param("contract_address")
	topic := c.Param("topic")
	err := point.DeleteContract(pointID, contractAddress, topic)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type AddWebhookParam struct {
	Webhook pkg.Webhook `json:"webhook"`
}

func AddWebhook(c *gin.Context) {
	var param AddWebhookParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.AddWebhook(param.Webhook)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
func GetWebhook(c *gin.Context) {
	pointID := c.Param("point_id")
	contractAddress := c.Param("contract_address")

	webhook, err := point.GetWebhook(pointID, contractAddress)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"webhook": webhook})
}
func DeleteWebhook(c *gin.Context) {
	pointID := c.Param("point_id")
	contractAddress := c.Param("contract_address")
	err := point.DeleteWebhook(pointID, contractAddress)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateParam struct {
	WebhookID string `json:"webhook_id"`
	Status    bool   `json:"status"`
}

func UpdateWebhook(c *gin.Context) {
	var param UpdateParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.UpdateWebhook(param.WebhookID, param.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}