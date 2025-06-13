package controllers

import (
	"net/http"

	"github.com/Samudai/service-job/internal/job"
	pkg "github.com/Samudai/service-job/pkg/job"
	"github.com/gin-gonic/gin"
)

func CreateApplicant(c *gin.Context) {
	var params pkg.CreateApplicantParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	applicantID, err := job.CreateApplicant(params.Type, params.Applicant)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"applicant_id": applicantID})
}

func GetApplicantByJobID(c *gin.Context) {
	jobID := c.Param("job_id")
	applicants, err := job.GetApplicantList(jobID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"applicants": applicants})
}

func GetApplicantListByMemberID(c *gin.Context) {
	memberID := c.Param("member_id")
	applicants, err := job.GetApplicantListByMemberID(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"applicants": applicants})
}

func GetApplicantListByClanID(c *gin.Context) {
	clanID := c.Param("clan_id")
	applicants, err := job.GetApplicantListByClanID(clanID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"applicants": applicants})
}

func GetApplicantByID(c *gin.Context) {
	applicantID := c.Param("applicant_id")
	applicant, err := job.GetApplicantByID(applicantID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"applicant": applicant})
}

func UpdateApplicant(c *gin.Context) {
	var params pkg.CreateApplicantParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := job.UpdateApplicant(params.Applicant)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func UpdateApplicantStatus(c *gin.Context) {
	var params pkg.CreateApplicantParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := job.UpdateApplicantStatus(params.Applicant)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func DeleteApplicant(c *gin.Context) {
	applicantID := c.Param("applicant_id")
	err := job.DeleteApplicant(applicantID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GetNewApplicantsCount(c *gin.Context) {
	daoID := c.Param("dao_id")
	counts, err := job.GetNewApplicantsCount(daoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"counts": counts})
}