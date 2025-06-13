package controllers

import (
	"net/http"

	"github.com/Samudai/service-member/internal/member"
	pkg "github.com/Samudai/service-member/pkg/member"
	"github.com/gin-gonic/gin"
)

type CreateRewardParams struct {
	RewardEarned pkg.RewardEarned `json:"reward_earned"`
}

func CreateReward(c *gin.Context) {
	var params CreateRewardParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.CreateReward(params.RewardEarned)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type ListRewardsForMemberParams struct {
	MemberID string  `json:"member_id"`
	DAOID    *string `json:"dao_id"`
	Type     *string `json:"type"`
}

func ListRewardsForMember(c *gin.Context) {
	var params ListRewardsForMemberParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	rewards, err := member.ListRewardsForMember(params.MemberID, params.DAOID, params.Type)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"rewards": rewards})
}
