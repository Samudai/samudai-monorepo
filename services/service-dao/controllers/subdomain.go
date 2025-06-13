package controllers

import (
	"net/http"

	"github.com/Samudai/service-dao/internal/dao"
	pkg "github.com/Samudai/service-dao/pkg/dao"
	"github.com/gin-gonic/gin"
)

type AddSubdomainForDaoParam struct { 
	Subdomain pkg.Subdomain `json:"subdomain"`
}

func AddSubdomainForDao(c *gin.Context) {
	var params AddSubdomainForDaoParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	subdomainID, err := dao.AddSubdomainForDao(params.Subdomain)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"subdomainID": subdomainID})
}

func GetSubdomainForDao(c *gin.Context) {
	daoId := c.Param("dao_id")
	Subdomain := c.Param("subdomain")
	subdomain, err := dao.GetSubdomainForDao(daoId, Subdomain)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"subdomain": subdomain})
}

func CheckSubdomainCreateForDao(c *gin.Context) {
	daoId := c.Param("dao_id")

	subdomain_access, err := dao.CheckSubdomainCreateForDao(daoId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"access": subdomain_access})
}