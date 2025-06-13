package controllers

import (
	"net/http"

	"github.com/Samudai/service-project/internal/project"
	pkg "github.com/Samudai/service-project/pkg/project"
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

	payoutID, err := project.CreatePayout(params.Payout)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"payout_id": payoutID})
}

type CreateBulkPayoutParam struct {
	Payouts []pkg.Payout `json:"payouts" binding:"required"`
}

func CreateBulkPayout(c *gin.Context) {
	var params CreateBulkPayoutParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	payoutID, err := project.CreateBulkPayout(params.Payouts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"payout_id": payoutID})
}

func UpdatePayout(c *gin.Context) {
	var params CreatePayoutParam

	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.UpdatePayout(params.Payout)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdatePayoutStatusParam struct {
	PayoutId  string `json:"payout_id" binding:"required"`
	Completed bool   `json:"completed" binding:"required"`
}

func UpdatePayoutStatus(c *gin.Context) {
	var params UpdatePayoutStatusParam

	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.UpdatePayoutStatus(params.PayoutId, params.Completed)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdatePayoutPaymentStatusParam struct {
	PayoutId      string                  `json:"payout_id" binding:"required"`
	PaymentStatus pkg.PayoutPaymentStatus `json:"payment_status" binding:"required"`
}

func UpdatePayoutPaymentStatus(c *gin.Context) {
	var params UpdatePayoutPaymentStatusParam

	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.UpdatePayoutPaymentStatus(params.PayoutId, params.PaymentStatus)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func CompletePayout(c *gin.Context) {
	payoutID := c.Param("payout_id")
	err := project.CompletePayout(payoutID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GetPayoutbyID(c *gin.Context) {
	payoutID := c.Param("payout_id")
	payout, err := project.GetPayoutbyID(payoutID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, payout)
}

func GetPaymentsToInitiateByDaoID(c *gin.Context) {
	daoId := c.Param("dao_id")
	payout, err := project.GetUninitiatedPayoutbyDAOID(daoId)
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

	err := project.UpdatePayoutInitatedBy(params.Payouts, params.InitiatedBy)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func DeletePayout(c *gin.Context) {
	payoutID := c.Param("payout_id")
	err := project.DeletePayout(payoutID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
