package controllers

import (
	"net/http"

	"github.com/Samudai/service-plugin/internal/github"
	"github.com/gin-gonic/gin"
)

type GetUserAccessTokenParam struct {
	Code        string `json:"code" binding:"required"`
	MemberID    string `json:"member_id" binding:"required"`
	RedirectURI string `json:"redirect_uri" binding:"required"`
}

func AuthMember(c *gin.Context) {
	var params GetUserAccessTokenParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	userAuth, err := github.GetAccessToken(params.Code, params.RedirectURI)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if userAuth.AccessToken == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "no access token"})
		return
	}
	user, err := github.GetUser(userAuth.AccessToken)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = github.SaveMemberData(params.MemberID, userAuth, *user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func CheckMemberGithubExists(c *gin.Context) {
	memberID := c.Param("member_id")
	exists, username, err := github.CheckMemberGithubExists(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"exists": exists, "username": username})
}

type GetGithubMemberIDsParam struct {
	Logins []string `json:"logins" binding:"required"`
}

func GetGithubMemberIDs(c *gin.Context) {
	var params GetGithubMemberIDsParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	memberIDs, err := github.GetMemberIDs(params.Logins)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, memberIDs)
}

func DeleteGithubAuth(c *gin.Context) {
	memberID := c.Param("member_id")
	err := github.DeleteMemberData(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
