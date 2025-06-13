package controllers

import (
	"net/http"

	"github.com/Samudai/service-project/internal/project"
	pkg "github.com/Samudai/service-project/pkg/project"
	"github.com/gin-gonic/gin"
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
