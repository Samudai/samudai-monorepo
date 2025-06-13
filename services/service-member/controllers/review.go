package controllers

import (
	"net/http"
	"strconv"

	"github.com/Samudai/service-member/internal/member"
	pkg "github.com/Samudai/service-member/pkg/member"
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

	reviewID, err := member.CreateReview(params.Review)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"review_id": reviewID})
}

func ListReviewsforMember(c *gin.Context) {
	memberID := c.Param("member_id")
	reviews, total, err := member.ListReviews(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"reviews": reviews, "total": total})
}

func ListReviewsforReviewerID(c *gin.Context) {
	reviewerID := c.Param("reviewer_id")
	reviews, total,err := member.ListReviewsForReviewerID(reviewerID)
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

	err = member.DeleteReview(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"review_id": reviewID})
}
