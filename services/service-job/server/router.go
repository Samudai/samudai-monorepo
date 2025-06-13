package server

import (
	"fmt"
	"time"

	"github.com/Samudai/service-job/controllers"
	"github.com/Samudai/service-job/middlewares"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func NewRouter() *gin.Engine {
	router := gin.New()
	router.Use(gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		return fmt.Sprintf("%s - [%s] \"%s %s %s %d %s \"%s\" %s\"\n",
			param.ClientIP,
			param.TimeStamp.Format(time.RFC1123),
			param.Method,
			param.Path,
			param.Request.Proto,
			param.StatusCode,
			param.Latency,
			param.Request.UserAgent(),
			param.ErrorMessage,
		)
	}))
	router.Use(gin.Recovery())
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowAllOrigins = true
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "DELETE"}
	corsConfig.AllowHeaders = []string{"*"}
	corsConfig.MaxAge = 1 * time.Minute
	router.Use(cors.New(corsConfig))

	router.Use(middlewares.SetHeadersMiddleware)

	health := new(controllers.HealthController)

	router.GET("/health", health.Status)

	job := router.Group("/job")
	job.POST("/create", controllers.CreateJob)
	job.GET("/:job_id", controllers.GetJobByID)
	job.POST("/list/:dao_id", controllers.GetJobByDAOID)
	job.POST("/publiclist", controllers.GetPublicJobs)
	job.POST("/total_jobs_posted", controllers.GetTotalJobsPosted)
	job.POST("/createdby/:member_id", controllers.GetJobCreatedBy)
	job.POST("/search/project", controllers.GetProjectJobListForMember)
	job.POST("/search/task", controllers.GetTaskJobListForMember)
	job.POST("/update", controllers.UpdateJob)
	job.POST("/update/status", controllers.UpdateJobStatus)
	job.POST("/update/remaining_req/:job_id", controllers.UpdateJobRemainingRequired)
	job.DELETE("/delete/:job_id", controllers.DeleteJob)

	jobFile := router.Group("/jobfile")
	jobFile.POST("/create", controllers.CreateJobFile)
	jobFile.GET("/list/:job_id", controllers.GetJobFiles)
	jobFile.DELETE("/:job_file_id", controllers.DeleteJobFile)

	applicant := router.Group("/applicant")
	applicant.POST("/create", controllers.CreateApplicant)
	applicant.GET("/:applicant_id", controllers.GetApplicantByID)
	applicant.GET("/list/:job_id", controllers.GetApplicantByJobID)
	applicant.GET("/bymember/:member_id", controllers.GetApplicantListByMemberID)
	applicant.GET("/byclan/:clan_id", controllers.GetApplicantListByClanID)
	applicant.POST("/update", controllers.UpdateApplicant)
	applicant.POST("/update/status", controllers.UpdateApplicantStatus)
	applicant.DELETE("/delete/:applicant_id", controllers.DeleteApplicant)
	applicant.GET("/get/applicantcount/:dao_id", controllers.GetNewApplicantsCount)

	bounty := router.Group("/bounty")
	bounty.POST("/create", controllers.CreateBounty)
	bounty.GET("/:bounty_id", controllers.GetBountyByID)
	bounty.POST("/list/:dao_id", controllers.GetBountyByDAOID)
	bounty.POST("/openlist", controllers.GetOpenBounties)
	bounty.POST("/createdby/:member_id", controllers.GetBountyCreatedBy)
	bounty.POST("/search", controllers.GetBountyListForMember)
	bounty.POST("/update", controllers.UpdateBounty)
	bounty.POST("/update/status", controllers.UpdateBountyStatus)
	bounty.POST("/update/remaining_req/:bounty_id", controllers.UpdateBountyRemainingRequired)
	bounty.DELETE("/delete/:bounty_id", controllers.DeleteBounty)

	bountyFile := router.Group("/bountyfile")
	bountyFile.POST("/create", controllers.CreateBountyFile)
	bountyFile.GET("/list/:bounty_id", controllers.GetBountyFiles)
	bountyFile.DELETE("/:bounty_file_id", controllers.DeleteBountyFile)

	submission := router.Group("/submission")
	submission.POST("/create", controllers.CreateSubmission)
	submission.GET("/:submission_id", controllers.GetSubmissionByID)
	submission.GET("/list/:bounty_id", controllers.GetSubmissionByBountyID)
	submission.GET("/bymember/:member_id", controllers.GetSubmissionListByMemberID)
	submission.GET("/byclan/:clan_id", controllers.GetSubmissionListByClanID)
	submission.POST("/review", controllers.ReviewSubmission)
	submission.DELETE("/delete/:submission_id", controllers.DeleteSubmission)

	skill := router.Group("/skill")
	skill.GET("/list/job", controllers.ListJobSkills)
	skill.GET("/list/bounty", controllers.ListBountySkills)
	// skill.POST("/create", controllers.CreateSkill)
	// skill.DELETE("/delete/:skill_id", controllers.DeleteSkill)

	tag := router.Group("/tag")
	tag.GET("/list/job", controllers.ListJobTags)
	tag.GET("/list/bounty", controllers.ListBountyTags)
	// tag.POST("/create", controllers.CreateTag)
	// tag.DELETE("/delete/:tag_id", controllers.DeleteTag)

	favourite := router.Group("/favourite")
	favourite.POST("/create", controllers.CreateFavourite)
	favourite.POST("/bymember/:member_id", controllers.GetFavouriteList)
	favourite.DELETE("/delete/:job_id/:member_id", controllers.DeleteFavourite)
	favourite.GET("/countbyjob/:job_id", controllers.GetFavouriteCountByJob)

	favouritebounty := router.Group("/favouritebounty")
	favouritebounty.POST("/create", controllers.CreateFavouriteBounty)
	favouritebounty.POST("/bymember/:member_id", controllers.GetFavouriteListBounty)
	favouritebounty.DELETE("/delete/:bounty_id/:member_id", controllers.DeleteFavouriteBounty)
	favouritebounty.GET("/countbybounty/:bounty_id", controllers.GetFavouriteCountByBounty)

	payout := router.Group("/payout")
	payout.POST("/create", controllers.CreatePayout)
	payout.POST("/create/multiple", controllers.CreateMultiplePayouts)
	payout.POST("/update", controllers.UpdatePayout)
	payout.POST("/update/status", controllers.UpdatePayoutStatus)
	payout.POST("/complete/:payout_id", controllers.CompletePayout)
	payout.POST("/update/bylinkid/transactions", controllers.UpdatePayoutByLinkIdForTransaction)
	payout.POST("/update/bylinkid/rank", controllers.UpdatePayoutByLinkIdAndRank)
	payout.GET("/get/:payout_id", controllers.GetPayoutbyID)
	payout.GET("/get/uninitiated/:dao_id", controllers.GetUninitiatedPayoutForDao)
	payout.POST("/update/initiated_by", controllers.UpdatePayoutInitatedBy)
	payout.DELETE("/delete/:payout_id", controllers.DeletePayout)

	analytics := router.Group("/job/analytics")
	analytics.GET("/totaljobsappliedcount/:member_id", controllers.GetTotalJobsAppliedCountForMember)
	analytics.POST("/fetch/applicantcount", controllers.FetchApplicantCountForMember)

	return router

}
