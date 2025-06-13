package controllers

import (
	"net/http"
	"strconv"

	"github.com/Samudai/service-dao/internal/dao"
	"github.com/gin-gonic/gin"
)

type CreateInviteParam struct {
	DAOID     string `json:"dao_id" binding:"required"`
	CreatedBy string `json:"created_by" binding:"required"`
}

func CreateDAOInvite(c *gin.Context) {
	var params CreateInviteParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	inviteCode, err := dao.CreateInvite(params.DAOID, params.CreatedBy)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"dao_invite": inviteCode})
}

func DeleteDAOInvite(c *gin.Context) {
	inviteID := c.Param("invite_id")
	id, err := strconv.Atoi(inviteID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = dao.DeleteInvite(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type AddMemberFromInviteParam struct {
	InviteCode string `json:"invite_code" binding:"required"`
	MemberID   string `json:"member_id" binding:"required"`
}

func AddMemberFromInvite(c *gin.Context) {
	var params AddMemberFromInviteParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	daoID, err := dao.AddMemberFromInvite(params.InviteCode, params.MemberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"dao_id": daoID})
}
