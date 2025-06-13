package controllers

import (
	"net/http"

	"github.com/Samudai/service-job/internal/job"
	"github.com/gin-gonic/gin"
)

func ListJobSkills(c *gin.Context) {
	skills, err := job.ListJobSkills()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"skills": skills})
}

func ListBountySkills(c *gin.Context) {
	skills, err := job.ListBountySkills()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"skills": skills})
}
