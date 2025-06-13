package controllers

import (
	"net/http"

	"github.com/Samudai/service-dao/internal/dao"
	pkg "github.com/Samudai/service-dao/pkg/dao"
	"github.com/gin-gonic/gin"
)

type CreateProviderParam struct {
	Provider pkg.Provider `json:"provider"`
}

func CreateProvider(c *gin.Context) {
	var params CreateProviderParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	providerID, err := dao.CreateProvider(params.Provider)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"provider_id": providerID})
}

func GetProviderById(c *gin.Context) {
	ProviderID := c.Param("provider_id")

	providerID, err := dao.GetProviderById(ProviderID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": providerID})
}

func ListProvidersForDAO(c *gin.Context) {
	daoID := c.Param("dao_id")

	providerList, err := dao.ListProvidersForDAO(daoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"provider_list": providerList})
}

func DoesExistProvider(c *gin.Context) {
	providerID := c.Param("provider_id")

	providers, err := dao.DoesExistProvider(providerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"provider": providers})
}

func UpdateProvider(c *gin.Context) {
	providerID := c.Param("provider_id")

	var params CreateProviderParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := dao.UpdateProvider(params.Provider)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"provider_id": providerID})
}

func DeleteProvider(c *gin.Context) {
	providerID := c.Param("provider_id")

	// id, err := strconv.Atoi(providerID)
	// if err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	// 	return
	// }

	err := dao.DeleteProvider(providerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"provider_id": providerID})
}

func GetDefaultProvider(c *gin.Context) {
	daoID := c.Param("dao_id")

	provider, err := dao.GetDefaultProvider(daoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"provider": provider})
}

type SetDefaultProviderParam struct {
	DAOID      string `json:"dao_id"`
	ProviderID string `json:"provider_id"`
	IsDefault  bool   `json:"is_default"`
}

func SetDefaultProvider(c *gin.Context) {
	var params SetDefaultProviderParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := dao.SetDefaultProvider(params.DAOID, params.ProviderID, params.IsDefault)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
