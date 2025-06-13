package server

import (
	"fmt"
	"time"

	"github.com/Samudai/service-project/controllers"
	"github.com/Samudai/service-project/middlewares"
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

	project := router.Group("/project")
	project.POST("/create", controllers.CreateProject)
	project.GET("/getall", controllers.GetAllProject)
	project.GET("/:project_id", controllers.GetProjectByID)
	project.GET("/contributor/:project_id", controllers.GetContributorByProjectID)
	project.POST("/bylinkid/:link_id", controllers.GetProjectByLinkID)
	project.POST("/bymemberdao", controllers.GetProjectsByMemberDAO)
	project.POST("/bymember", controllers.GetProjectsByMember)
	project.POST("/update", controllers.UpdateProject)
	project.DELETE("/:project_id", controllers.DeleteProject)
	project.POST("/link/github", controllers.CreateGithubLink)
	project.POST("/update/columns", controllers.UpdateProjectColumns)
	project.POST("/update/completed", controllers.UpdateProjectCompleted)
	project.POST("/update/visibility", controllers.UpdateProjectVisibility)
	project.POST("/update/pinned", controllers.UpdateProjectPinned)
	project.GET("/investment/forms/:dao_id/:form_id", controllers.GetInvestmentForForm)
	project.GET("/investment/:dao_id", controllers.GetInvestmentProjectID)
	project.POST("/search", controllers.SearchProject)
	project.GET("/workprogress/:link_id", controllers.GetWorkProgress)
	project.POST("/archive", controllers.ArchiveProject)
	project.POST("/bymemberdao/archive", controllers.GetArchivedProjectsByMemberDAO)
	project.GET("/get/projectcount/:dao_id", controllers.GetProjectCountForDao)

	folder := router.Group("/folder")
	folder.POST("/create", controllers.CreateFolder)
	folder.GET("/:folder_id", controllers.GetFolderByID)
	folder.GET("/byproject/:project_id", controllers.GetFolderByProjectID)
	folder.POST("/update", controllers.UpdateFolder)
	folder.DELETE("/delete/:folder_id", controllers.DeleteFolder)

	projectFile := router.Group("/projectfile")
	projectFile.POST("/create", controllers.CreateProjectFile)
	projectFile.GET("/list/:folder_id", controllers.GetProjectFiles)
	projectFile.DELETE("/:project_file_id", controllers.DeleteProjectFile)

	access := router.Group("/access")
	access.POST("/create", controllers.CreateAccess)
	access.GET("/listbyprojectid/:project_id", controllers.GetAccessByProjectID)
	access.POST("/update", controllers.UpdateAccess)
	access.POST("/add/formember", controllers.AddAccessIfNotExistsForMember)
	access.DELETE("/delete/:project_id", controllers.DeleteAccess)
	access.POST("/bymemberid", controllers.GetProjectAccessByMemberID)
	access.POST("/byinvite", controllers.AddAccessByInvite)

	// task
	task := router.Group("/task")
	task.POST("/create", controllers.CreateTask)
	task.GET("/alltask/:project_id", controllers.GetAllTaskByProject)
	task.GET("/:task_id", controllers.GetTaskByID)
	task.POST("/update", controllers.UpdateTask)
	task.DELETE("/:task_id", controllers.DeleteTask)
	task.POST("/update/column", controllers.UpdateTaskColumn)
	task.POST("/update/columnbulk", controllers.UpdateTaskColumnBulk)
	task.POST("/update/feedback", controllers.UpdateFeedback)
	task.POST("/update/assignee", controllers.AssignTask)
	task.POST("/add/assignee", controllers.AddAssigneeToTask)
	task.POST("/update/position", controllers.UpdateTaskPosition)
	task.POST("/update/vcclaim", controllers.UpdateTaskVCClaim)
	task.POST("/update/paymentcreated", controllers.UpdateTaskPaymentCreated)
	task.POST("/update/associatejob", controllers.UpdatetaskAssociatedJob)
	
	// REDUNDANT // task.POST("/update/payout", controllers.UpdateTaskPayout)
	task.POST("/notion/assignee", controllers.NotionAssignTask)
	task.GET("/personaltask/:member_id", controllers.PersonalTaskByMemberID)
	task.GET("/assignedtask/:member_id", controllers.AssignedTaskByMemberID)
	task.GET("/team/assigned/:link_id", controllers.AssignedTaskByLinkID)
	task.POST("/archivetask", controllers.ArchiveTask)
	task.GET("/allarchivetask/:project_id", controllers.GetArchiveTaskByProject)
	task.GET("/getopentasks/:dao_id", controllers.GetOpentasksForDao)

	response := router.Group("/response")
	response.POST("/create", controllers.CreateResponse)
	response.GET("/allresponse/:project_id", controllers.GetAllResponseByProject)
	response.GET("/:response_id", controllers.GetResponseByID)
	response.GET("/byformresponse/:form_response_id", controllers.GetResponseByFormResponseID)
	response.DELETE("/:response_id", controllers.DeleteResponse)
	response.POST("/update/column", controllers.UpdateResponseColumn)
	response.POST("/update/columnbulk", controllers.UpdateResponseColumnBulk)
	response.POST("/update/assignee", controllers.AssignResponse)
	response.POST("/update/position", controllers.UpdateResponsePosition)
	response.POST("/update/discussion", controllers.UpdateDiscussion)

	comment := router.Group("/comment")
	comment.POST("/create", controllers.CreateComment)
	comment.GET("/list/:link_id", controllers.GetCommentsByLinkID)
	comment.POST("/update", controllers.UpdateComment)
	comment.DELETE("/:comment_id", controllers.DeleteComment)

	taskFile := router.Group("/taskfile")
	taskFile.POST("/create", controllers.CreateTaskFile)
	taskFile.GET("/list/:task_id", controllers.GetTaskFiles)
	taskFile.DELETE("/:task_file_id", controllers.DeleteTaskFile)

	tag := router.Group("/tag")
	tag.GET("/list", controllers.ListTags)
	// tag.POST("/create", controllers.CreateTag)
	// tag.DELETE("/delete/:tag_id", controllers.DeleteTag)

	subtask := router.Group("/subtask")
	subtask.GET("/allsubtask/:project_id", controllers.GetAllSubtaskByProject)
	subtask.GET("/:subtask_id", controllers.GetSubtaskByID)
	subtask.POST("/create", controllers.CreateSubtask)
	subtask.POST("/update", controllers.UpdateSubtask)
	subtask.POST("/update/column", controllers.UpdateSubtaskColumn)
	subtask.POST("/update/columnbulk", controllers.UpdateSubtaskColumnBulk)
	subtask.POST("/update/payout", controllers.UpdateSubTaskPayout)
	subtask.POST("/update/position", controllers.UpdateSubtaskPosition)
	subtask.POST("/add/assignee", controllers.AddAssigneeToSubTask)
	subtask.DELETE("/:subtask_id", controllers.DeleteSubtask)
	subtask.POST("/update/status", controllers.UpdateSubtaskStatus)
	subtask.POST("/update/associatejob", controllers.UpdateSubtaskAssociatedJob)
	subtask.POST("/archive", controllers.ArchiveSubtask)
	subtask.GET("/getall/archived/:project_id", controllers.GetAllArchivedSubtask)

	payout := router.Group("/payout")
	payout.POST("/create", controllers.CreatePayout)
	payout.POST("/createbulk", controllers.CreateBulkPayout)
	payout.POST("/update", controllers.UpdatePayout)
	payout.POST("/update/status", controllers.UpdatePayoutStatus)	
	payout.POST("/update/paymentstatus", controllers.UpdatePayoutPaymentStatus)	
	payout.POST("/complete/:payout_id", controllers.CompletePayout)	
	payout.GET("/get/:payout_id", controllers.GetPayoutbyID)
	payout.GET("/getfordao/:dao_id", controllers.GetPaymentsToInitiateByDaoID)
	payout.POST("/update/initiated_by", controllers.UpdatePayoutInitatedBy)
	payout.DELETE("/delete/:payout_id", controllers.DeletePayout)

	github := router.Group("/github")
	github.POST("/createtask", controllers.CreateGithubTask)
	github.POST("/updatetask", controllers.UpdateGithubTask)

	notion := router.Group("/notion")
	notion.POST("/getnotiontasks", controllers.GetNotionTasks)

	return router
}
