package controllers

import (
	"net/http"

	"github.com/Samudai/service-dao/internal/dao"
	pkg "github.com/Samudai/service-dao/pkg/dao"
	"github.com/gin-gonic/gin"
)

type CreateFavouriteParams struct {
	Favourite pkg.Favourite `json:"favourite"`
}

func CreateFavourite(c *gin.Context) {
	var params CreateFavouriteParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	favouriteID, err := dao.CreateDAOFavourite(params.Favourite)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"favourite_id": favouriteID})
}

func GetFavouriteList(c *gin.Context) {
	memberID := c.Param("member_id")
	var page pkg.Pagination
	if err := c.ShouldBindJSON(&page); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	favouriteList, total, err := dao.GetDAOFavouriteList(memberID, page.Limit, page.Offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"favourite_list": favouriteList, "total": total})
}

func DeleteFavourite(c *gin.Context) {
	favouriteID := c.Param("favourite_id")

	err := dao.DeleteDAOFavourite(favouriteID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GetFavouriteCountByDAO(c *gin.Context) {
	daoID := c.Param("dao_id")

	count, err := dao.GetDAOFavouriteCountByDAO(daoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"count": count})
}
