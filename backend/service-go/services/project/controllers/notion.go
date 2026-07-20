package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/Samudai/backend/services/project/internal/project"
	pkg "github.com/Samudai/backend/services/project/pkg/project"
)

func GetNotionTasks(c *gin.Context) {
	var params pkg.GetProjectsByMemberDAOParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tasks, err := project.GetNotionTasks(params.MemberID, params.DAOs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tasks)
}
