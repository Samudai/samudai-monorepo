package controllers

import (
	"net/http"

	"github.com/Samudai/gateway-external/internal/member"
	"github.com/Samudai/gateway-external/internal/point"
	"github.com/Samudai/gateway-external/internal/telegrambot"


	memberpkg "github.com/Samudai/service-member/pkg/member"
	pointpkg "github.com/Samudai/service-point/pkg/point"
	"github.com/gin-gonic/gin"
)

type CreateTelegramParams struct {
	Telegram memberpkg.Telegram `json:"telegram" binding:"required"`
}

func CreateTelegram(c *gin.Context) {
	var params CreateTelegramParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.AddTelegram(params.Telegram)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type PublishNotificationsParams struct {
	Telegram []memberpkg.Telegram `json:"telegram" binding:"required"`
	NotificationMessage string 	  `json:"notification_message" binding:"required"`
}

func PublishNotifications(c *gin.Context) {
	var params PublishNotificationsParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := telegrambot.PublishNotifications(params.Telegram, params.NotificationMessage)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func DisconnectTelegram(c *gin.Context) {
	chatId := c.Param("chat_id")
	err := telegrambot.DisconnectTelegram(chatId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

// Point

type CreateTelegramPointParams struct {
	Telegram pointpkg.Telegram `json:"telegram" binding:"required"`
}

func CreateTelegramPoint(c *gin.Context) {
	var params CreateTelegramPointParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.AddTelegramPoint(params.Telegram)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
