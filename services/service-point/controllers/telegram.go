package controllers

import (
	"net/http"

	"github.com/Samudai/service-point/internal/point"
	pkg "github.com/Samudai/service-point/pkg/point"
	"github.com/gin-gonic/gin"
)

type AddTelegramForMemberParam struct {
	Telegram pkg.Telegram `json:"telegram"`
}

func AddTelegramForMember(c *gin.Context) {
	var params AddTelegramForMemberParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.AddTelegramForMember(params.Telegram)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type CreateOrUpdateOTPParam struct {
	MemberID string  `json:"member_id"`
	PointID  *string `json:"point_id"`
	OTP      string  `json:"otp"`
	ChatType string  `json:"chat_type"`
}

func CreateOrUpdateOTP(c *gin.Context) {
	var params CreateOrUpdateOTPParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	telegramID, err := point.CreateOrUpdateOTP(params.PointID, params.MemberID, params.OTP, params.ChatType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"telegram_id": telegramID})
}

func GetTelegramForMember(c *gin.Context) {
	memberId := c.Param("member_id")
	telegram, err := point.GetTelegramForMember(memberId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"telegram": telegram})
}

func GetTelegramMemberByUsername(c *gin.Context) {
	joinee_chat_id := c.Param("joinee_chat_id")
	event_name := c.Param("event_name")
	group_chat_id := c.Param("group_chat_id")
	memberId, err := point.GetTelegramMemberByChatId(joinee_chat_id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	pointId, points, err := point.GetPointIdAndPointsForGroups(event_name, group_chat_id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"member_id": memberId, "point_id": pointId, "points_num": points})
}

func GetTelegramMemberByUsernameFxn(joinee_chat_id, event_name, group_chat_id string) (string, string, float64) {
	memberId, err := point.GetTelegramMemberByChatId(joinee_chat_id)
	if err != nil {
		return "", "", 0
	}

	pointId, points, err := point.GetPointIdAndPointsForGroups(event_name, group_chat_id)
	if err != nil {
		return "", "", 0
	}

	return memberId, pointId, points
}

func GetTelegramMemberByUsername1(c *gin.Context) {
	username := c.Param("username")
	group_chat_id := c.Param("group_chat_id")
	memberId, err := point.GetTelegramMemberByUsername(username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	pointId, err := point.GetPointIdByChatID(group_chat_id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"member_id": memberId, "point_id": pointId})
}

func GetTelegramMemberByUsernameFxn1(username, group_chat_id string) (string, string) {
	memberId, err := point.GetTelegramMemberByUsername(username)
	if err != nil {
		return "", ""
	}

	pointId, err := point.GetPointIdByChatID(group_chat_id)
	if err != nil {
		return "", ""
	}

	return memberId, pointId
}

func GetTelegramForPoint(c *gin.Context) {
	memberId := c.Param("point_id")
	telegram, err := point.GetTelegramForPoint(memberId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"telegram": telegram})
}

type AddTelegramEventsPointParam struct {
	TelegramEvents pkg.TelegramEvent `json:"telegram_events"`
}

func AddTelegramEventsPoint(c *gin.Context) {
	var param AddTelegramEventsPointParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.AddTelegramEventsPoint(param.TelegramEvents)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func UpdateTelegramEventsPoint(c *gin.Context) {
	var param AddTelegramEventsPointParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.UpdateTelegramEventsPoint(param.TelegramEvents)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GetTelegramEventForPoint(c *gin.Context) {
	pointId := c.Param("point_id")
	telegramEvents, err := point.GetTelegramEventForPoint(pointId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"telegram_event": telegramEvents})
}
