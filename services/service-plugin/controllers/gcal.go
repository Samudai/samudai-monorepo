package controllers

import (
	"net/http"

	"github.com/Samudai/service-plugin/internal/gcal"
	"github.com/gin-gonic/gin"
)

type GcalAuthParam struct {
	LinkID      string `json:"link_id" binding:"required"`
	Code        string `json:"code" binding:"required"`
	RedirectURI string `json:"redirect_uri" binding:"required"`
}

func GcalAuth(c *gin.Context) {
	var params GcalAuthParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	accessToken, email, err := gcal.Auth(params.RedirectURI, params.Code, params.LinkID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"access_token": accessToken, "email": email})
}

func CheckMemberGcalExists(c *gin.Context) {
	memberID := c.Param("member_id")
	exists, email, err := gcal.CheckMemberGcalExists(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"exists": exists, "email": email})
}

func GetGcalAuth(c *gin.Context) {
	memberID := c.Param("member_id")
	accessToken, email, err := gcal.GetAuth(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"access_token": accessToken, "email": email})
}

func DeleteGcalAccess(c *gin.Context) {
	memberID := c.Param("member_id")
	err := gcal.DeleteAccess(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
