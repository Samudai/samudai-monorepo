package controllers

import (
	"net/http"

	"github.com/Samudai/service-member/internal/member"
	"github.com/gin-gonic/gin"
)

func ListSkills(c *gin.Context) {
	skills, err := member.ListSkills()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"skills": skills})
}
