package controllers

import (
	"net/http"

	"github.com/Samudai/service-job/internal/job"
	pkg "github.com/Samudai/service-job/pkg/job"
	"github.com/gin-gonic/gin"
)

type CreateBountyParam struct {
	Bounty pkg.Bounty `json:"bounty"`
}

func CreateBounty(c *gin.Context) {
	var params CreateBountyParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	bountyID, err := job.CreateBounty(params.Bounty)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"bounty_id": bountyID})
}

type CreateFavouriteBountyParams struct {
	FavouriteBounty pkg.FavouriteBounty `json:"favourite"`
}

func CreateFavouriteBounty(c *gin.Context) {
	var params CreateFavouriteBountyParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	favouriteID, err := job.CreateFavouriteBounty(params.FavouriteBounty)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"favourite_id": favouriteID})
}

func GetFavouriteListBounty(c *gin.Context) {
	memberID := c.Param("member_id")
	var page pkg.Pagination
	if err := c.ShouldBindJSON(&page); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	favouriteList, err := job.GetFavouriteListBounty(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"favourite_list": favouriteList})
}

func DeleteFavouriteBounty(c *gin.Context) {
	bountyID := c.Param("bounty_id")
	memberID := c.Param("member_id")

	err := job.DeleteFavouriteBounty(bountyID, memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GetFavouriteCountByBounty(c *gin.Context) {
	bountyID := c.Param("bounty_id")

	count, err := job.GetFavouriteCountByBounty(bountyID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"count": count})
}

func GetBountyByID(c *gin.Context) {
	bountyID := c.Param("bounty_id")
	bounty, err := job.GetBountyByID(bountyID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"bounty": bounty})
}

func GetBountyByDAOID(c *gin.Context) {
	daoID := c.Param("dao_id")
	var page pkg.Pagination
	if err := c.ShouldBindJSON(&page); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	bounty, total, err := job.GetBountyByDAOID(daoID, page.Limit, page.Offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"bounty": bounty, "total": total})
}

type GetOpenBountiesParams struct {
	Skills  *[]string `json:"skills"`
    DaoNames *[]string `json:"dao_names"`
	Query string `json:"query"`
	pkg.Pagination
}

func GetOpenBounties(c *gin.Context) {
	var params GetOpenBountiesParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	bounty, total, err := job.GetOpenBounties(params.Query, params.Limit, params.Offset, params.DaoNames, params.Skills)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"bounty": bounty, "total": total})
}

func GetBountyCreatedBy(c *gin.Context) {
	memberID := c.Param("member_id")
	var page pkg.Pagination
	if err := c.ShouldBindJSON(&page); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	bounties, total, err := job.GetBountyCreatedBy(memberID, page.Limit, page.Offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"bounties": bounties, "total": total})
}

func GetBountyListForMember(c *gin.Context) {
	var params pkg.GetBountyListForMemberParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	bounties, total, err := job.GetBountyListForMember(params.UserDaoIDs, params.Filter, params.Pagination.Limit, params.Pagination.Offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"bounties": bounties, "total": total})
}

func UpdateBounty(c *gin.Context) {
	var params CreateBountyParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := job.UpdateBounty(params.Bounty)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateBountyStatusParam struct {
	BountyID  string         `json:"bounty_id"`
	Status    pkg.StatusType `json:"status"`
}

func UpdateBountyStatus(c *gin.Context) {
	var params UpdateBountyStatusParam

	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := job.UpdateBountyStatus(params.BountyID, params.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func UpdateBountyRemainingRequired(c *gin.Context) {
	jobID := c.Param("bounty_id")

	err := job.UpdateBountyRemainingRequired(jobID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func DeleteBounty(c *gin.Context) {
	bountyID := c.Param("bounty_id")
	err := job.DeleteBounty(bountyID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

// CreateBountyFileParam is the param for CreateBountyFile
type CreateBountyFileParam struct {
	BountyFile pkg.BountyFile `json:"bounty_file"`
}

// CreateBountyFile handles the request to create a new job file
func CreateBountyFile(c *gin.Context) {
	var params CreateBountyFileParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	bountyFileID, err := job.CreateBountyFile(params.BountyFile)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"bounty_file_id": bountyFileID})
}

// GetBountyFiles handles the request to get a list of files for a job
func GetBountyFiles(c *gin.Context) {
	bountyID := c.Param("bounty_id")
	bountyFiles, err := job.GetBountyFiles(bountyID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, bountyFiles)
}

// DeleteBountyFile handles the request to delete a job file
func DeleteBountyFile(c *gin.Context) {
	bountyFileID := c.Param("bounty_file_id")
	err := job.DeleteBountyFile(bountyFileID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
