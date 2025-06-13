package controllers

import (
	"net/http"

	"github.com/Samudai/service-job/internal/job"
	"github.com/gin-gonic/gin"
)

func ListJobTags(c *gin.Context) {
	tags, err := job.ListJobTags()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"tags": tags})
}

func ListBountyTags(c *gin.Context) {
	tags, err := job.ListBountyTags()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"tags": tags})
}
