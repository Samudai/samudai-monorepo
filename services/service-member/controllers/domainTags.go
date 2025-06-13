package controllers

import (
	"net/http"

	"github.com/Samudai/service-member/internal/member"
	"github.com/gin-gonic/gin"
)

func ListDomainTags(c *gin.Context) {
	domainTags, err := member.ListDomainTags()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"domainTags": domainTags})
}
