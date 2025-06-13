package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/Samudai/service-plugin/internal/github"
	githubpkg "github.com/Samudai/service-plugin/pkg/github"
	"github.com/gin-gonic/gin"
)

type ConsumeEventParam struct {
	WebhookType string      `json:"webhook_type"`
	Payload     interface{} `json:"payload"`
}

func ConsumeEvent(c *gin.Context) {
	var param ConsumeEventParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	payload, err := json.Marshal(param.Payload)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = github.ConsumeEvent(param.WebhookType, payload)
	if err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

type GetAppAccessTokenParam struct {
	Code           string `json:"code" binding:"required"`
	InstallationID int64  `json:"installation_id" binding:"required"`
	SetupAction    string `json:"setup_action"`
	State          string `json:"state"`
	DAOID          string `json:"dao_id" binding:"required"`
	RedirectURI    string `json:"redirect_uri" binding:"required"`
}

func AppAuthMember(c *gin.Context) {
	var params GetAppAccessTokenParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if params.SetupAction == "install" {
		userAuth, err := github.GetAppAccessToken(params.Code, params.State, params.RedirectURI)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		installationEvent, err := github.GetInstallation(params.InstallationID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		saveDataParam := githubpkg.SaveDAODataParam{
			Installation: installationEvent,
			DAOID:        params.DAOID,
			UserAccess:   *userAuth,
		}
		err = github.SaveDAOData(saveDataParam)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": userAuth})
		return
	} // TODO: add delete action
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func CheckDaoGithubAppExists(c *gin.Context) {
	daoID := c.Param("dao_id")

	exists, username, err := github.CheckDaoGithubAppExists(daoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"exists": exists, "username": username})
}

func GetRepos(c *gin.Context) {
	daoID := c.Param("dao_id")
	data, err := github.GetDAOData(daoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	resp, err := github.GetRepos(data)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var repos []string
	if resp != nil {
		for _, repo := range resp.Repositories {
			repos = append(repos, repo.GetFullName())
		}
	}

	c.JSON(http.StatusOK, gin.H{"repos": repos})
}

func GetDAOIDForInstallation(c *gin.Context) {
	installationID := c.Param("installation_id")
	instID, err := strconv.ParseInt(installationID, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	data, err := github.GetDAOIDForInstallation(instID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"dao_id": data})
}

type FetchIssuesParam struct {
	DAOID       string   `json:"dao_id" binding:"required"`
	GithubRepos []string `json:"github_repos" binding:"required"`
}

func FetchIssues(c *gin.Context) {
	var params FetchIssuesParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	data, err := github.GetDAOData(params.DAOID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	issues, err := github.FetchIssues(data, params.GithubRepos)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"issues": issues})
}

type FetchPullRequestsParam struct {
	DAOID       string   `json:"dao_id" binding:"required"`
	GithubRepos []string `json:"github_repos" binding:"required"`
}

func FetchPullRequests(c *gin.Context) {
	var params FetchPullRequestsParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	data, err := github.GetDAOData(params.DAOID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	pullRequests, err := github.FetchPullRequests(data, params.GithubRepos)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"pull_requests": pullRequests})
}

func DeleteGithubAppAuth(c *gin.Context) {
	daoID := c.Param("dao_id")
	err := github.DeleteGithubAppAuth(daoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
