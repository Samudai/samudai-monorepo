package controllers

import (
	"net/http"

	"github.com/Samudai/service-member/internal/member"
	pkg "github.com/Samudai/service-member/pkg/member"
	"github.com/gin-gonic/gin"
)

type CreateClanParam struct {
	Clan pkg.Clan `json:"clan"`
}

func CreateClan(c *gin.Context) {
	var params CreateClanParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	clanID, err := member.CreateClan(params.Clan)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"clan_id": clanID})
}

type AddClanMemberParam struct {
	ClanMember pkg.ClanMember `json:"clan_member"`
}

func AddClanMember(c *gin.Context) {
	var params AddClanMemberParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.AddClanMember(params.ClanMember)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GetClanByID(c *gin.Context) {
	clanID := c.Param("clan_id")
	clan, err := member.GetClanByID(clanID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"clan": clan})
}

func GetClanByMemberID(c *gin.Context) {
	memberID := c.Param("member_id")
	clans, err := member.GetClanByMemberID(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"clans": clans})
}

func UpdateClan(c *gin.Context) {
	var params CreateClanParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.UpdateClan(params.Clan)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func DeleteClan(c *gin.Context) {
	clanID := c.Param("clan_id")
	err := member.DeleteClan(clanID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func RemoveClanMember(c *gin.Context) {
	clanID := c.Param("clan_id")
	memberID := c.Param("member_id")
	err := member.RemoveClanMember(clanID, memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
