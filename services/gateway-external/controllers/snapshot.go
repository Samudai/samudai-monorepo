package controllers

import (
	"net/http"

	"github.com/Samudai/samudai-pkg/logger"
	"github.com/gin-gonic/gin"
)

type SnapshotParams struct {
	ID     string `json:"id" binding:"required"`
	Event  string `json:"event" binding:"required"`
	Space  string `json:"space" binding:"required"`
	Expire int64  `json:"expire" binding:"required"`
}

func Snapshot(c *gin.Context) {
	var params SnapshotParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	logger.LogMessage("info", "webhook %v", params)
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}
