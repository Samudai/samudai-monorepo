package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/Samudai/backend/services/member/internal/member"
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
