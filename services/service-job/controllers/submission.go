package controllers

import (
	"net/http"

	"github.com/Samudai/service-job/internal/job"
	pkg "github.com/Samudai/service-job/pkg/job"
	"github.com/gin-gonic/gin"
)

func CreateSubmission(c *gin.Context) {
	var params pkg.CreateSubmissionParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	submissionID, err := job.CreateSubmission(params.Type, params.Submission)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"submission_id": submissionID})
}

func GetSubmissionByID(c *gin.Context) {
	submissionID := c.Param("submission_id")
	submission, err := job.GetSubmissionByID(submissionID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"submission": submission})
}

func GetSubmissionByBountyID(c *gin.Context) {
	bountyID := c.Param("bounty_id")
	submissions, err := job.GetSubmissionByBountyID(bountyID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"submissions": submissions})
}

func GetSubmissionListByMemberID(c *gin.Context) {
	memberID := c.Param("member_id")
	submissions, err := job.GetSubmissionListByMemberID(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"submissions": submissions})
}

func GetSubmissionListByClanID(c *gin.Context) {
	clanID := c.Param("clan_id")
	submissions, err := job.GetSubmissionListByClanID(clanID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"submissions": submissions})
}

func DeleteSubmission(c *gin.Context) {
	submissionID := c.Param("submission_id")
	err := job.DeleteSubmission(submissionID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"submission_id": submissionID})
}

func ReviewSubmission(c *gin.Context) {
	var params pkg.CreateSubmissionParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := job.ReviewSubmission(params.Submission)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
