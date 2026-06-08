package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/Samudai/backend/services/project/internal/project"
	pkg "github.com/Samudai/backend/services/project/pkg/project"
)

func CreateGithubTask(c *gin.Context) {
	var params pkg.CreateGithubTaskParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	projectIDs, err := project.GetProjectIDsFromGithubRepo(params.DAOID, params.Repo)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = project.CreateTaskFromGithubIssue(params.Issue, projectIDs, params.Assignees)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Create Github Task"})
}

func UpdateGithubTask(c *gin.Context) {
	var params pkg.CreateGithubTaskParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	projectIDs, err := project.GetProjectIDsFromGithubRepo(params.DAOID, params.Repo)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = project.UpdateTaskFromGithubIssue(params.Issue, projectIDs, params.Assignees)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Update Github Task"})
}
