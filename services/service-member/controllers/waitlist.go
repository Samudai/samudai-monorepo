package controllers

import (
	"net/http"

	"github.com/Samudai/service-member/internal/member"
	"github.com/gin-gonic/gin"
)

type CreateWaitlistEntryParam struct {
	Email string `json:"email"`
}

func CreateWaitlistEntry(c *gin.Context) {
	var params CreateWaitlistEntryParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.CreateWaitlistEntry(params.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}