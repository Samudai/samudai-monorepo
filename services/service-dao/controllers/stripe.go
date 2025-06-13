package controllers

import (
	"net/http"

	"github.com/Samudai/service-dao/internal/dao"
	pkg "github.com/Samudai/service-dao/pkg/dao"
	"github.com/gin-gonic/gin"
)

type AddSubscriptionForDaoParams struct {
	Subscription pkg.Subscription `json:"subscription"`
}

func AddSubscriptionForDao(c *gin.Context) {
	var params AddSubscriptionForDaoParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	daoID, err := dao.AddSubscriptionForDao(params.Subscription)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"dao_id": daoID})
}

func UpdateSubscriptionForDao(c *gin.Context) {
	var params AddSubscriptionForDaoParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := dao.UpdateSubscriptionForDao(params.Subscription)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GetSubscriptionCountForDao(c *gin.Context) {
	daoID := c.Param("dao_id")

	count, err := dao.GetSubscriptionCountForDao(daoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"count": count})
}

func GetCustomerIdForDao(c *gin.Context) {
	daoID := c.Param("dao_id")

	customerId, err := dao.GetCustomerIdForDao(daoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"customerId": customerId})

}

type AddCustomerForDaoParams struct {
	Customer pkg.Customer `json:"customer"`
}

func AddCustomerForDao(c *gin.Context) {
	var params AddCustomerForDaoParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	daoID, err := dao.AddCustomerForDao(params.Customer)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"dao_id": daoID})
}

func UpdateCustomerForDao(c *gin.Context) {
	var params AddCustomerForDaoParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := dao.UpdateCustomerForDao(params.Customer)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
