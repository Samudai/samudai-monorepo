package controllers

import (
	"net/http"

	"github.com/Samudai/service-discussion/internal/discussion"
	pkg "github.com/Samudai/service-discussion/pkg/discussion"
	"github.com/gin-gonic/gin"
)

type AddParticipantParam struct {
	Participant pkg.Participant `json:"participant"`
}

func AddParticipant(c *gin.Context) {
	var param AddParticipantParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	participantID, err := discussion.AddParticipant(param.Participant)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"participant_id": participantID})
}

type AddParticipantsParam struct {
	Participants []pkg.Participant `json:"participants"`
}

func AddParticipants(c *gin.Context) {
	var param AddParticipantsParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discussion.AddParticipants(param.Participants)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func RemoveParticipant(c *gin.Context) {
	var param AddParticipantParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discussion.RemoveParticipant(param.Participant)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func IsParticipant(c *gin.Context) {
	discussionID := c.Param("discussion_id")
	memberID := c.Param("member_id")
	isParticipant, err := discussion.IsParticipant(discussionID, memberID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"is_participant": isParticipant})
}

func GetParticipantsByDiscussionID(c *gin.Context) {
	discussionID := c.Param("discussion_id")
	participants, err := discussion.GetParticipantsByDiscussionID(discussionID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, participants)
}
