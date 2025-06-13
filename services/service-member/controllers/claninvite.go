package controllers

import (
	"net/http"
	"strconv"

	"github.com/Samudai/service-member/internal/member"
	pkg "github.com/Samudai/service-member/pkg/member"
	"github.com/gin-gonic/gin"
)

type CreateClanInviteParam struct {
	ClanInvite pkg.ClanInvite `json:"clan_invite"`
}

func CreateClanInvite(c *gin.Context) {
	var params CreateClanInviteParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	inviteID, err := member.CreateClanInvite(params.ClanInvite)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"clan_invite_id": inviteID})
}

func UpdateClanInvite(c *gin.Context) {
	var params CreateClanInviteParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.UpdateClanInvite(params.ClanInvite)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func ListClanInvites(c *gin.Context) {
	clanID := c.Param("clan_id")
	invites, err := member.ListClanInvites(clanID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"invites": invites})
}

func GetClanInviteByReceiverID(c *gin.Context) {
	receiverID := c.Param("receiver_id")
	invite, err := member.GetClanInviteByReceiverID(receiverID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"invite": invite})
}

func DeleteClanInvite(c *gin.Context) {
	inviteID := c.Param("invite_id")
	id, err := strconv.Atoi(inviteID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = member.DeleteClanInvite(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
