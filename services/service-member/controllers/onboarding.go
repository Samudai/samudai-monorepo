package controllers

import (
	"net/http"

	"github.com/Samudai/service-member/internal/member"
	pkg "github.com/Samudai/service-member/pkg/member"
	"github.com/gin-gonic/gin"
)

type UpdateOnboardingParams struct {
	Onboarding pkg.Onboarding `json:"onboarding"`
}

func UpdateOnboarding(c *gin.Context) {
	var params UpdateOnboardingParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.UpdateOnboarding(params.Onboarding)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type RequestNFTParams struct {
	MemberID string `json:"member_id"`
}

func RequestNFT(c *gin.Context) {
	var params RequestNFTParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.RequestNFT(params.MemberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type RequestSubdomainParams struct {
	MemberID string `json:"member_id"`
	Subdomain string `json:"subdomain"`
	WalletAddress string `json:"wallet_address"`
}

func RequestSubdomain(c *gin.Context) {
	var params RequestSubdomainParams

	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.RequestSubdomain(params.MemberID, params.Subdomain, params.WalletAddress)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func CheckSubdomain(c *gin.Context) {
	subdomain := c.Param("subdomain")

	subdomain_exists, err := member.CheckSubdomain(subdomain)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"exists": subdomain_exists})
}

func FetchSubdomainByMemberID(c *gin.Context) {
	memberId := c.Param("member_id")

	subdomain_data, err := member.FetchSubdomainByMemberID(memberId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": subdomain_data})
}


func GetOnboarding(c *gin.Context) {
	memberID := c.Param("member_id")

	onboarding, err := member.GetOnboarding(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"onboarding": onboarding})
}
