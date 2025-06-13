package controllers

import (
	"net/http"

	"github.com/Samudai/service-job/internal/job"
	pkg "github.com/Samudai/service-job/pkg/job"
	"github.com/gin-gonic/gin"
)

type CreatePayoutParam struct {
	Payout pkg.Payout `json:"payout" binding:"required"`
}

func CreatePayout(c *gin.Context) {
	var params CreatePayoutParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	payoutID, err := job.CreatePayout(params.Payout)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"payout_id": payoutID})
}

type CreateMultiplePayoutsParam struct {
	Payout pkg.Payout `json:"payout" binding:"required"`
	Count  int        `json:"count"`
}

func CreateMultiplePayouts(c *gin.Context) {
	var params CreateMultiplePayoutsParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	payoutIDs, err := job.CreateMultiplePayouts(params.Payout, params.Count)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"payout_ids": payoutIDs})
}

func UpdatePayout(c *gin.Context) {
	var params CreatePayoutParam

	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := job.UpdatePayout(params.Payout)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdatePayoutStatusParam struct {
	PayoutId string               `json:"payout_id" binding:"required"`
	Status   pkg.PayoutStatusType `json:"status" binding:"required"`
}

func UpdatePayoutStatus(c *gin.Context) {
	var params UpdatePayoutStatusParam

	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := job.UpdatePayoutStatus(params.PayoutId, params.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func CompletePayout(c *gin.Context) {
	payoutID := c.Param("payout_id")
	err := job.CompletePayout(payoutID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type CreatePayoutStatusParam struct {
	LinkID          string               `json:"link_id"`
	ReceiverAddress string               `json:"receiver_address"`
	Status          pkg.PayoutStatusType `json:"status"`
	MemberID        string               `json:"member_id"`
	Rank            int                  `json:"rank"`
}

func UpdatePayoutByLinkIdForTransaction(c *gin.Context) {
	var params CreatePayoutStatusParam

	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := job.UpdatePayoutByLinkIdForTransaction(params.LinkID, params.ReceiverAddress, params.Status,
		params.MemberID, params.Rank)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdatePayoutByLinkIdAndRankParam struct {
	LinkID          string               `json:"link_id"`
	Rank            int                  `json:"rank"`
	ReceiverAddress string               `json:"receiver_address"`
	Status          pkg.PayoutStatusType `json:"status"`
	MemberID        string               `json:"member_id"`
	InitiatedBy     string               `json:"initiated_by"`
}

func UpdatePayoutByLinkIdAndRank(c *gin.Context) {
	var params UpdatePayoutByLinkIdAndRankParam

	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := job.UpdatePayoutByLinkIdAndRank(params.LinkID, params.Rank, params.ReceiverAddress, params.Status, params.MemberID, params.InitiatedBy)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GetPayoutbyID(c *gin.Context) {
	payoutID := c.Param("payout_id")
	payout, err := job.GetPayoutbyID(payoutID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, payout)
}

func GetUninitiatedPayoutForDao(c *gin.Context) {
	daoID := c.Param("dao_id")
	payout, err := job.GetUninitiatedPayoutForDao(daoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, payout)
}

type UpdatePayoutInitatedByParam struct {
	InitiatedBy string       `json:"initiated_by"`
	Payouts     []pkg.Payout `json:"payouts"`
}

func UpdatePayoutInitatedBy(c *gin.Context) {
	var params UpdatePayoutInitatedByParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := job.UpdatePayoutInitatedBy(params.Payouts, params.InitiatedBy)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func DeletePayout(c *gin.Context) {
	payoutID := c.Param("payout_id")
	err := job.DeletePayout(payoutID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
