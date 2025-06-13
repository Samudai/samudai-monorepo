package controllers

import (
	"net/http"

	"github.com/Samudai/service-member/internal/member"
	"github.com/gin-gonic/gin"
)

func ListTags(c *gin.Context) {
	tags, err := member.ListTags()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"tags": tags})
}
