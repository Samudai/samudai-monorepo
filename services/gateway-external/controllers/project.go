package controllers

import (
	"net/http"

	"github.com/Samudai/gateway-external/internal/project"
	"github.com/gin-gonic/gin"
)

func GetAllProject(c *gin.Context) {
	projects, err := project.GetAllProject()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, projects)
}
