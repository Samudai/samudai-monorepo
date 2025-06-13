package controllers

import (
	"net/http"

	"github.com/Samudai/service-point/internal/point"
	pkg "github.com/Samudai/service-point/pkg/point"
	"github.com/gin-gonic/gin"
)

type CreateProductMemberParams struct {
	Member pkg.ProductMember `json:"product_member"`
}

func CreateProductMember(c *gin.Context) {
	var params CreateProductMemberParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.CreateProductMember(params.Member)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func FetchProductAndMember(c *gin.Context) {
	productID := c.Param("product_id")
	uniqueUserID := c.Param("unique_user_id")
	eventName := c.Param("event_name")

	MemberID, err := point.FetchProductMemberId(uniqueUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	PointID, Points, ProductName, err := point.FetchPointsOnProductEvent(eventName, productID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"member_id": MemberID, "points_num": Points, "point_id": PointID, "product_name": ProductName})
}

func FetchProductAndMemberFxn(productID, uniqueUserID, eventName string) (string, string, float64, string, error) {

	MemberID, err := point.FetchProductMemberId(uniqueUserID)
	if err != nil {
		return "", MemberID, 0, "", err
	}

	PointId, Points, ProductName, err := point.FetchPointsOnProductEvent(eventName, productID)
	if err != nil {
		return PointId, MemberID, Points, ProductName, err
	}

	return PointId, MemberID, Points, ProductName, nil
}

func FetchProductAndMemberById(c *gin.Context) {
	productID := c.Param("product_id")
	uniqueUserID := c.Param("unique_user_id")

	MemberID, err := point.FetchProductMemberId(uniqueUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	PointID, ProductName, err := point.GetProductNameByProductID(productID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"member_id": MemberID, "point_id": PointID, "product_name": ProductName})
}

func FetchProductAndMemberByIdFxn(productID, uniqueUserID string) (string, string, string, error) {

	MemberID, err := point.FetchProductMemberId(uniqueUserID)
	if err != nil {
		return "", MemberID, "", err
	}

	PointId, ProductName, err := point.GetProductNameByProductID(productID)
	if err != nil {
		return PointId, MemberID, ProductName, err
	}

	return PointId, MemberID, ProductName, nil
}
