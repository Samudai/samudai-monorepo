package controllers

import (
	"net/http"
	"strconv"

	"github.com/Samudai/service-project/internal/project"
	pkg "github.com/Samudai/service-project/pkg/project"
	"github.com/gin-gonic/gin"
)

type CreateCommentParam struct {
	Comment pkg.Comment `json:"comment" binding:"required"`
}

func CreateComment(c *gin.Context) {
	var params CreateCommentParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	commentID, err := project.CreateComment(params.Comment)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"comment_id": commentID})
}

func GetCommentsByLinkID(c *gin.Context) {
	linkID := c.Param("link_id")
	comments, err := project.GetCommentsByLinkID(linkID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, comments)
}

func UpdateComment(c *gin.Context) {
	var params CreateCommentParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.UpdateComment(params.Comment)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func DeleteComment(c *gin.Context) {
	commentID := c.Param("comment_id")
	id, err := strconv.Atoi(commentID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = project.DeleteComment(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
