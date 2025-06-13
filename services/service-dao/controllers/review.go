package controllers

import (
	"net/http"
	"strconv"

	"github.com/Samudai/service-dao/internal/dao"
	pkg "github.com/Samudai/service-dao/pkg/dao"
	"github.com/gin-gonic/gin"
)

type CreateReviewParams struct {
	Review pkg.Review `json:"review" binding:"required"`
}

func CreateReview(c *gin.Context) {
	var params CreateReviewParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	reviewID, err := dao.CreateReview(params.Review)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"review_id": reviewID})
}

func ListReviewsforDAO(c *gin.Context) {
	daoID := c.Param("dao_id")
	reviews, total, err := dao.ListReviews(daoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"reviews": reviews, "total": total})
}

func ListReviewsforReviewerID(c *gin.Context) {
	reviewerID := c.Param("reviewer_id")
	reviews, total, err := dao.ListReviewsForReviewerID(reviewerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"reviews": reviews, "total": total})
}

func DeleteReview(c *gin.Context) {
	reviewID := c.Param("review_id")
	id, err := strconv.Atoi(reviewID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = dao.DeleteReview(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"review_id": reviewID})
}
