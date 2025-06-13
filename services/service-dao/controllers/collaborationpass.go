package controllers

import (
	"net/http"

	"github.com/Samudai/service-dao/internal/dao"
	pkg "github.com/Samudai/service-dao/pkg/dao"
	"github.com/gin-gonic/gin"
)

type CreateCollaborationPassParams struct {
	CollaborationPass pkg.CollaborationPass `json:"collaboration_pass"`
}

func CreateCollaborationPass(c *gin.Context) {
	var params CreateCollaborationPassParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	collaborationPassID, err := dao.CreateCollaborationPass(params.CollaborationPass)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"collaboration_pass_id": collaborationPassID})
}

func GetCollaborationPassByDaoId(c *gin.Context) {
	daoId := c.Param("dao_id")

	collaborationPass, err := dao.GetCollaborationPassByDaoId(daoId)
	if err!= nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"collaboration_pass": collaborationPass})
}

func UpdateCollaborationPass(c *gin.Context) {
	var params CreateCollaborationPassParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := dao.UpdateCollaborationPass(params.CollaborationPass)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "collaboration pass updated"})
}

func DeleteCollaborationPass(c *gin.Context) {
	collaborationPassID := c.Param("collaboration_pass_id")
	err := dao.DeleteCollaborationPass(collaborationPassID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "collaboration pass deleted"})
}


