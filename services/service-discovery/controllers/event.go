package controllers

import (
	"net/http"

	"github.com/Samudai/service-discovery/internal/dao"
	"github.com/Samudai/service-discovery/internal/member"
	daopkg "github.com/Samudai/service-discovery/pkg/dao"
	memberpkg "github.com/Samudai/service-discovery/pkg/member"
	"github.com/gin-gonic/gin"
)

type CreateDAOProjectEventParam struct {
	Event daopkg.DAOEvent `json:"event"`
}

func CreateDAOEvent(c *gin.Context) {
	var param CreateDAOProjectEventParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := dao.CreateDAOProjectEvent(param.Event)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success"})
}

type CreateMemberTaskEventParam struct {
	Event memberpkg.MemberEvent `json:"event"`
}

func CreateMemberEvent(c *gin.Context) {
	var param CreateMemberTaskEventParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.CreateMemberProjectEvent(param.Event)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success"})
}
