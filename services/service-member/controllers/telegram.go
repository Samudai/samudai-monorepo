package controllers

import (
	"net/http"

	"github.com/Samudai/service-member/internal/member"
	pkg "github.com/Samudai/service-member/pkg/member"
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

	err := member.AddTelegramForMember(params.Telegram)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type CreateOrUpdateGeneratedTelegramIdParam struct{
	MemberID            string   `json:"member_id"`
	GeneratedTelegramId string   `json:"generated_telegram_id"`
}

func CreateOrUpdateGeneratedTelegramId(c *gin.Context) {
	var params CreateOrUpdateGeneratedTelegramIdParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	telegramID, err := member.CreateOrUpdateGeneratedTelegramId(params.MemberID, params.GeneratedTelegramId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"telegram_id": telegramID})
}

func CheckTelegramExist(c *gin.Context) {
	memberId := c.Param("member_id")
	exist, username, err := member.CheckTelegramExist(memberId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"exist": exist, "username": username})
}

func GetTelegramForMember(c *gin.Context) {
	memberId := c.Param("member_id")
	telegram, err := member.GetTelegramForMember(memberId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"telegram": telegram})
}

func DeleteTelegramForMember(c *gin.Context) {
	memberID := c.Param("member_id")

	err := member.DeleteTelegramForMember(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"member_id": memberID})
}