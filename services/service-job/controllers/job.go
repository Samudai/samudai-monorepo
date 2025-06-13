package controllers

import (
	"net/http"

	"github.com/Samudai/service-job/internal/job"
	pkg "github.com/Samudai/service-job/pkg/job"
	"github.com/gin-gonic/gin"
)

// CreateOpportunityParam is the param for CreateJob
type CreateOpportunityParam struct {
	Opportunity pkg.Opportunity `json:"opportunity"`
}

// CreateJob creates a new opportunity
func CreateJob(c *gin.Context) {
	var params CreateOpportunityParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	jobID, err := job.CreateOpportunity(params.Opportunity)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"job_id": jobID})
}

func GetJobCreatedBy(c *gin.Context) {
	memberID := c.Param("member_id")
	var page pkg.Pagination
	if err := c.ShouldBindJSON(&page); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	opportunities, total, err := job.GetOpportunityCreatedBy(memberID, page.Limit, page.Offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"opportunities": opportunities, "total": total})
}

func GetTotalJobsPosted(c *gin.Context) {
	var requestData struct {
		DAOID     string `json:"dao_id"`
		ProjectID string `json:"project_id"`
	}

	err := c.BindJSON(&requestData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	total_jobs_posted, err := job.GetTotalJobsPosted(requestData.DAOID, requestData.ProjectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"total_jobs_posted": total_jobs_posted})
}

func GetJobByDAOID(c *gin.Context) {
	daoID := c.Param("dao_id")
	var page pkg.Pagination
	if err := c.ShouldBindJSON(&page); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	opportunities, total, err := job.GetOpportunityByDAOID(daoID, page.Limit, page.Offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"opportunities": opportunities, "total": total})
}

type GetPublicJobsParams struct {
	Skills  *[]string `json:"skills"`
    DaoNames *[]string `json:"dao_names"`
	Query string `json:"query"`
	pkg.Pagination
}

func GetPublicJobs(c *gin.Context) {
	var params GetPublicJobsParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	opportunities, total, err := job.GetPublicOpportunities(params.Query, params.Limit, params.Offset, params.DaoNames, params.Skills)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"opportunities": opportunities, "total": total})
}

func GetJobByID(c *gin.Context) {
	jobID := c.Param("job_id")
	opportunity, err := job.GetOpportunityByID(jobID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"opportunity": opportunity})
}

func GetProjectJobListForMember(c *gin.Context) {
	var params pkg.GetJobListForMemberParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	opportunities, total, err := job.SearchNFilterJob(params.Query, params.UserDaoIDs, params.Filter, pkg.JobTypeProject, params.Pagination.Limit, params.Pagination.Offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"opportunities": opportunities, "total": total})
}

func GetTaskJobListForMember(c *gin.Context) {
	var params pkg.GetJobListForMemberParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	opportunities, total, err := job.SearchNFilterJob(params.Query, params.UserDaoIDs, params.Filter, pkg.JobTypeTask, params.Pagination.Limit, params.Pagination.Offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"opportunities": opportunities, "total": total})
}

func UpdateJob(c *gin.Context) {
	var params CreateOpportunityParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := job.UpdateOpportunity(params.Opportunity)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateJobStatusParam struct {
	OpportunityID string         `json:"job_id"`
	Status        pkg.StatusType `json:"status"`
	UpdatedBy     string         `json:"updated_by"`
}

func UpdateJobStatus(c *gin.Context) {
	var params UpdateJobStatusParam

	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := job.UpdateJobStatus(params.OpportunityID, params.Status, params.UpdatedBy)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func UpdateJobRemainingRequired(c *gin.Context) {
	jobID := c.Param("job_id")

	err := job.UpdateJobRemainingRequired(jobID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func DeleteJob(c *gin.Context) {
	jobID := c.Param("job_id")
	err := job.DeleteOpportunity(jobID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

// CreateJobFileParam is the param for CreateJobFile
type CreateJobFileParam struct {
	JobFile pkg.JobFile `json:"job_file"`
}

// CreateJobFile handles the request to create a new job file
func CreateJobFile(c *gin.Context) {
	var params CreateJobFileParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	jobFileID, err := job.CreateJobFile(params.JobFile)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"job_file_id": jobFileID})
}

// GetJobFiles handles the request to get a list of files for a job
func GetJobFiles(c *gin.Context) {
	jobID := c.Param("job_id")
	jobFiles, err := job.GetJobFiles(jobID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, jobFiles)
}

// DeleteJobFile handles the request to delete a job file
func DeleteJobFile(c *gin.Context) {
	jobFileID := c.Param("job_file_id")
	err := job.DeleteJobFile(jobFileID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
