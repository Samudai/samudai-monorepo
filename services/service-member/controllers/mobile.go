package controllers

import (
	"net/http"

	"github.com/Samudai/service-member/internal/member"
	pkg "github.com/Samudai/service-member/pkg/member"
	"github.com/gin-gonic/gin"
)

type AddMobileForMemberParam struct {
	Mobile pkg.Mobile `json:"mobile"`
}

func AddMobileForMember(c *gin.Context) {
	var params AddMobileForMemberParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	memberId, err := member.AddMobileForMember(params.Mobile)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"member_id": memberId})
}

type CreateOrUpdateGeneratedOTPParam struct {
	MemberID  string `json:"member_id"`
	MobileOTP string `json:"mobile_otp"`
}

func CreateOrUpdateGeneratedOTP(c *gin.Context) {
	var params CreateOrUpdateGeneratedOTPParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	mobileID, err := member.CreateOrUpdateGeneratedOTP(params.MemberID, params.MobileOTP)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"mobile_id": mobileID})
}

func GetLinkedStatusForMember(c *gin.Context) {
	memberId := c.Param("member_id")
	linked_status, err := member.GetLinkedStatusForMember(memberId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"linked_status": linked_status})
}

func DeleteMobileForMember(c *gin.Context) {
	memberID := c.Param("member_id")

	err := member.DeleteMobileForMember(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
