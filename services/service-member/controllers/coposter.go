package controllers

import (
	"net/http"

	"github.com/Samudai/service-member/internal/member"
	pkg "github.com/Samudai/service-member/pkg/member"
	"github.com/gin-gonic/gin"
)

type AddCoposterUserParam struct {
	CoposterUser pkg.CoposterUser `json:"coposter_user"`
}

type TweetInfoParam struct {
	TweetInfo pkg.TweetInfo `json:"tweet_info"`
}
type CastInfoParam struct {
	CastInfo pkg.CastInfo `json:"cast_info"`
}

type XcasterUserParam struct {
	XcasterUser pkg.XcasterUser `json:"xcaster_user"`
}
type UpdateXUserParam struct {
	UpdateXUser pkg.UpdateXUser `json:"update_x_user"`
}
type UpdateWarpcastUserParam struct {
	UpdateWarpcastUser pkg.UpdateWarpcastUser `json:"update_warpcast_user"`
}

func UpdateXUser(c *gin.Context) {
	var params UpdateXUserParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.UpdateXUser(params.UpdateXUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
func UpdateWarpcastUser(c *gin.Context) {
	var params UpdateWarpcastUserParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.UpdateWarpcastUser(params.UpdateWarpcastUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func AddXcasterUser(c *gin.Context) {
	var params XcasterUserParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.AddXcasterUser(params.XcasterUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func FetchXcasterUser(c *gin.Context) {
	memberId := c.Param("member_id")

	user_data, err := member.FetchXcasterUser(memberId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": user_data})
}

func AddCoposterUser(c *gin.Context) {
	var params AddCoposterUserParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	coposterUserId, err := member.AddCoposterUser(params.CoposterUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"coposterUserId": coposterUserId})
}

func GetCoposterUserById(c *gin.Context) {
	coposterUserId := c.Param("coposter_user_id")
	coposterUser, err := member.GetCoposterUserById(coposterUserId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"coposterUser": coposterUser})
}

func AddTweet(c *gin.Context) {
	var params TweetInfoParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.AddTweet(params.TweetInfo)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func AddCast(c *gin.Context) {
	var params CastInfoParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.AddCast(params.CastInfo)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
