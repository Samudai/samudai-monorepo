package controllers

import (
	"net/http"

	"github.com/Samudai/service-point/internal/point"
	pkg "github.com/Samudai/service-point/pkg/point"
	"github.com/gin-gonic/gin"
)

type CreateCustomProductParam struct {
	CustomProduct pkg.CustomProduct `json:"custom_product"`
}

func CreateCustomProduct(c *gin.Context) {
	var param CreateCustomProductParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	product_id, err := point.CreateCustomProduct(param.CustomProduct)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"product_id": product_id})
}

func UpdateCustomProduct(c *gin.Context) {
	var params CreateCustomProductParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.UpdateCustomProduct(params.CustomProduct)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GetProductByProductID(c *gin.Context) {
	productID := c.Param("product_id")

	Product, err := point.GetProductByProductID(productID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"product": Product})
}

func GetProductByPointID(c *gin.Context) {
	pointID := c.Param("point_id")

	Product, err := point.GetProductBypointID(pointID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"product": Product})
}

type UpdateCustomProductStatusParam struct {
	ProductID string `json:"product_id"`
	Status    bool   `json:"status"`
}

func UpdateCustomProductStatus(c *gin.Context) {
	var param UpdateCustomProductStatusParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.UpdateCustomProductStatus(param.ProductID, param.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type AddReferralPointsParam struct {
	ReferralPointParam pkg.ReferralPointsParam `json:"referral_body"`
}

func AddandUpdateReferralPoints(c *gin.Context) {
	var param AddReferralPointsParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.AddandUpdateReferralPoints(param.ReferralPointParam.PointID, param.ReferralPointParam.ProductID, param.ReferralPointParam.ReferralPoints, param.ReferralPointParam.SamePoints)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateStatusParam struct {
	ReferralStatus pkg.ReferralStatusParam `json:"referral_status"`
}

func UpdateReferralStatus(c *gin.Context) {
	var param UpdateStatusParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.UpdateReferralStatus(param.ReferralStatus.PointID, param.ReferralStatus.ProductID, param.ReferralStatus.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func RequestReferralCode(c *gin.Context) {
	productID := c.Param("product_id")
	pointID := c.Param("point_id")
	uniqueUserID := c.Param("unique_user_id")

	ReferralCode, err := point.RequestReferralCode(pointID, productID, uniqueUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"referral_code": ReferralCode})
}
func VerifyReferralCode(c *gin.Context) {
	productID := c.Param("product_id")
	uniqueUserID := c.Param("unique_user_id")
	referral_code := c.Param("referral_code")

	ReferralObject, err := point.VerifyReferralCode(productID, referral_code, uniqueUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"referral_obj": ReferralObject})
}
