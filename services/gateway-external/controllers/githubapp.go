package controllers

import (
	"net/http"
	"os"

	"github.com/Samudai/gateway-external/internal/plugin/githubapp"
	"github.com/gin-gonic/gin"
	gh "github.com/google/go-github/v45/github"
)

func ConsumeEvent(c *gin.Context) {
	payload, err := gh.ValidatePayload(c.Request, []byte(os.Getenv("GITHUB_WEBHOOK_SECRET")))
	if err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}
	err = githubapp.ConsumeEvent(gh.WebHookType(c.Request), payload)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}
