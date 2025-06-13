package controllers

import (
	"net/http"

	"github.com/Samudai/service-point/internal/point"
	pkg "github.com/Samudai/service-point/pkg/point"
	"github.com/gin-gonic/gin"
)

type AddTwitterMemberParam struct {
	TwitterMember pkg.TwitterMember `json:"twitter_member"`
}

func AddTwitterMember(c *gin.Context) {
	var params AddTwitterMemberParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.AddTwitterMember(params.TwitterMember)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = ClearTwitterMemberCache(params.TwitterMember.TwitterUserID, params.TwitterMember.TwitterUsername)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func UpdateTwitterMember(c *gin.Context) {
	var params AddTwitterMemberParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.UpdateTwitterMember(params.TwitterMember)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GetTwitterMemberById(c *gin.Context) {
	memberID := c.Param("member_id")

	TwitterMember, err := point.GetTwitterMemberById(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"twitter_member": TwitterMember})
}

func GetTwitterMemberByUserId(c *gin.Context) {
	PointId := c.Param("point_id")
	twitterUserId := c.Param("twitter_user_id")
	twitterUsername := c.Param("twitter_username")
	
	Member, err := point.GetTwitterMemberByUserId(twitterUserId, twitterUsername)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

 	Points, err := point.GetTwitterPointsByPointId(PointId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"member": Member, "points": Points})
}

func GetTwitterMemberByUserIdFxn(PointId, twitterUserId, twitterUsername string) (string, pkg.TwitterPoints) {
	Member, err := point.GetTwitterMemberByUserId(twitterUserId, twitterUsername)
	if err != nil {
		return "", pkg.TwitterPoints{}
	}

	Points, err := point.GetTwitterPointsByPointId(PointId)
	if err != nil {
		return "", Points
	}

	return Member, Points
}
