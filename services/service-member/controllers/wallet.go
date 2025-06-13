package controllers

import (
	"net/http"

	"github.com/Samudai/service-member/internal/member"
	pkg "github.com/Samudai/service-member/pkg/member"
	"github.com/gin-gonic/gin"
)

type AddWalletParams struct {
	Wallet pkg.Wallet `json:"wallet"`
}

func CreateWallet(c *gin.Context) {
	var params AddWalletParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.CreateWallet(params.Wallet)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateDefaultWalletParam struct {
	MemberID      string `json:"member_id"`
	WalletAddress string `json:"wallet_address"`
}

func UpdateDefaultWallet(c *gin.Context) {
	var params UpdateDefaultWalletParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.UpdateDefaultWallet(params.MemberID, params.WalletAddress)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func DeleteWallet(c *gin.Context) {
	memberID := c.Param("member_id")
	walletAdd := c.Param("wallet_add")

	err := member.DeleteWallet(memberID, walletAdd)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GetDefaultWallet(c *gin.Context) {
	memberID := c.Param("member_id")
	wallet, err := member.GetDefaultWallet(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"wallet": wallet})
}
