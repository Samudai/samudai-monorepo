package controllers

import (
	"net/http"

	"github.com/Samudai/service-job/internal/job"
	"github.com/gin-gonic/gin"
)

func GetTotalJobsAppliedCountForMember(c *gin.Context) {
	memberID := c.Param("member_id")
	appliedjobcount, err := job.GetTotalJobsAppliedCountForMember(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"applied_job_count": appliedjobcount})
}

type FetchApplicantCountForMemberParams struct {
	MemberId string     `json:"member_id"`
	DaoIDs   []string	`json:"dao_ids"`
}

func FetchApplicantCountForMember(c *gin.Context) {
	var params FetchApplicantCountForMemberParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	applicant_count, err := job.FetchApplicantCountForMember(params.DaoIDs, params.MemberId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"applicant_count": applicant_count})

}