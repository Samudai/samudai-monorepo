package controllers

import (
	"net/http"

	"github.com/Samudai/service-plugin/internal/notion"
	notionpkg "github.com/Samudai/service-plugin/pkg/notion"
	"github.com/gin-gonic/gin"
)

// NotionAuthParam is the paramter for NotionAuth
type NotionAuthParam struct {
	Code        string `json:"code" binding:"required"`
	MemberID    string `json:"member_id" binding:"required"`
	RedirectURI string `json:"redirect_uri" binding:"required"`
}

func NotionAuth(c *gin.Context) {
	var params NotionAuthParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	auth, err := notion.Auth(params.MemberID, params.Code, params.RedirectURI)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, auth)
}

func CheckMemberNotionExists(c *gin.Context) {
	memberID := c.Param("member_id")

	exists, username, err := notion.CheckMemberNotionExists(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"exists": exists, "username": username})
}

// GetAllDatabaseParam is the paramter for GetDatabase
type GetAllDatabaseParam struct {
	MemberID string `json:"member_id" binding:"required"`
}

// GetAllDatabase is the handler for GetAllDatabase
func GetAllDatabase(c *gin.Context) {
	var params GetAllDatabaseParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	auth, err := notion.Auth(params.MemberID, "", "")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	data, err := notion.GetAllDatabase(auth.AccessToken)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"databases": data})
}

// GetDatabase is the handler for GetDatabase
func GetDatabase(c *gin.Context) {
	var params notionpkg.GetDatabaseParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	auth, err := notion.Auth(params.MemberID, "", "")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database, err := notion.GetDatabase(params.DatabaseID, auth.AccessToken)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, *database)
}

func GetDatabaseProperties(c *gin.Context) {
	var params notionpkg.GetDatabaseParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	auth, err := notion.Auth(params.MemberID, "", "")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	properties, err := notion.GetDatabaseProperties(params.DatabaseID, auth.AccessToken)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, properties)
}

func GetPages(c *gin.Context) {
	var params notionpkg.GetDatabaseParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	auth, err := notion.Auth(params.MemberID, "", "")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	pages, err := notion.QueryDatabase(auth.AccessToken, params.DatabaseID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = notion.SavePages(pages)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, pages)
}

type GetMemberIDsParam struct {
	UserIDs []string `json:"user_ids" binding:"required"`
}

func GetNotionMemberIDs(c *gin.Context) {
	var params GetMemberIDsParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	memberIDs, err := notion.GetMemberIDs(params.UserIDs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, memberIDs)
}

func DeleteNotionAuth(c *gin.Context) {
	memberID := c.Param("member_id")

	err := notion.DeleteAuth(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

// Extras

func GetPageByID(c *gin.Context) {
	pageID := c.Param("page_id")

	page, err := notion.GetPageByID(pageID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"page": page})
}
