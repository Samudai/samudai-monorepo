package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/Samudai/backend/services/member/internal/member"
)

func ListTags(c *gin.Context) {
	tags, err := member.ListTags()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"tags": tags})
}
