package controllers

import (
	"net/http"

	"github.com/Samudai/service-dao/internal/dao"
	pkg "github.com/Samudai/service-dao/pkg/dao"
	"github.com/gin-gonic/gin"
)

type CreateCollaborationParams struct {
	Collaboration pkg.Collaboration `json:"collaboration"`
}

func CreateCollaboration(c *gin.Context) {
	var params CreateCollaborationParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	favouriteID, err := dao.CreateDAOCollaboration(params.Collaboration)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"collaboration_id": favouriteID})
}

func ListCollaborations(c *gin.Context) {
	daoID := c.Param("dao_id")
	collaborations, err := dao.ListDAOCollaborations(daoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, collaborations)
}

type UpdateCollaborationStatusParam struct {
	CollaborationID  string `json:"collaboration_id"`
	ReplyingMemberID string `json:"replying_member_id"`
	Status           pkg.CollaborationStatus `json:"status"`
}

func UpdateCollaborationStatus(c *gin.Context) {
	var params UpdateCollaborationStatusParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := dao.UpdateDAOCollaborationStatus(params.CollaborationID, params.Status, params.ReplyingMemberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "collaboration status updated"})
}

func DeleteCollaboration(c *gin.Context) {
	collaborationID := c.Param("collaboration_id")
	err := dao.DeleteDAOCollaboration(collaborationID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "collaboration deleted"})
}
