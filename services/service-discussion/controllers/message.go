package controllers

import (
	"net/http"

	"github.com/Samudai/service-discussion/internal/discussion"
	pkg "github.com/Samudai/service-discussion/pkg/discussion"
	"github.com/gin-gonic/gin"
)

type CreateMessageParam struct {
	Message pkg.Message `json:"message"`
}

func CreateMessage(c *gin.Context) {
	var params CreateMessageParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	messageID, err := discussion.CreateMessage(params.Message)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message_id": messageID})
}

func GetMessagesByDiscussionID(c *gin.Context) {
	discussionID := c.Param("discussion_id")
	var page pkg.Pagination
	if err := c.ShouldBindJSON(&page); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	messages, err := discussion.GetMessagesByDiscussionID(discussionID, page.Limit, page.Offset)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, messages)
}

type UpdateMessageContentParam struct {
	MessageID      string     `json:"message_id"`
	Content        string     `json:"content"`
}

func UpdateMessageContent(c *gin.Context) {
	var params UpdateMessageContentParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discussion.UpdateMessageContent(params.MessageID, params.Content)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}


func DeleteMessage(c *gin.Context) {
	messageID := c.Param("message_id")
	err := discussion.DeleteMessage(messageID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}