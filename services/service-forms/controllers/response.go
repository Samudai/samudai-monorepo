package controllers

import (
	"net/http"

	"github.com/Samudai/service-forms/internal/deal"
	pkg "github.com/Samudai/service-forms/pkg/deal"
	"github.com/gin-gonic/gin"
)

type CreateResponseParam struct {
	Response pkg.FormResponse `json:"response" binding:"required"`
}

func CreateResponse(c *gin.Context) {
	var param CreateResponseParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	responseID, err := deal.CreateResponse(param.Response)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"response_id": responseID})
}

func GetResponseByID(c *gin.Context) {
	responseID := c.Param("response_id")

	response, err := deal.GetResponseByID(responseID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"response": response})
}

func GetResponseByFormID(c *gin.Context) {
	formID := c.Param("form_id")

	response, err := deal.GetResponseByFormID(formID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"response": response})
}

func DeleteResponse(c *gin.Context) {
	responseID := c.Param("response_id")

	if err := deal.DeleteResponse(responseID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
