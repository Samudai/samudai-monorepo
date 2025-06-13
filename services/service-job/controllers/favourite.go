package controllers

import (
	"net/http"

	"github.com/Samudai/service-job/internal/job"
	pkg "github.com/Samudai/service-job/pkg/job"
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

	favouriteID, err := job.CreateFavourite(params.Favourite)
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

	favouriteList, err := job.GetFavouriteList(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"favourite_list": favouriteList})
}

func DeleteFavourite(c *gin.Context) {
	jobID := c.Param("job_id")
	memberID := c.Param("member_id")

	err := job.DeleteFavourite(jobID, memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GetFavouriteCountByJob(c *gin.Context) {
	jobID := c.Param("job_id")

	count, err := job.GetFavouriteCountByJob(jobID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"count": count})
}
