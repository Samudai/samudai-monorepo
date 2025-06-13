package controllers

import (
	"net/http"

	"github.com/Samudai/service-member/internal/member"
	pkg "github.com/Samudai/service-member/pkg/member"
	"github.com/gin-gonic/gin"
)

type AddSubdomainForMemberParam struct { 
	Subdomain pkg.Subdomain `json:"subdomain"`
}

func AddSubdomainForMember(c *gin.Context) {
	var params AddSubdomainForMemberParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	subdomainID, err := member.AddSubdomainForMember(params.Subdomain)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"subdomainID": subdomainID})
}

func GetSubdomainForMember(c *gin.Context) {
	memberId := c.Param("member_id")
	Subdomain := c.Param("subdomain")
	subdomain, err := member.GetSubdomainForMember(memberId, Subdomain)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"subdomain": subdomain})
}

func CheckSubdomainCreateForMember(c *gin.Context) {
	memberId := c.Param("member_id")

	subdomain_access, err := member.CheckSubdomainCreateForMember(memberId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"access": subdomain_access})
}