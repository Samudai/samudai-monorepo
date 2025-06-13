package controllers

import (
	"net/http"

	"github.com/Samudai/service-project/internal/project"
	pkg "github.com/Samudai/service-project/pkg/project"
	"github.com/gin-gonic/gin"
)

// CreateTaskParam is the param for CreateTask
type CreateTaskParam struct {
	Task pkg.Task `json:"task" binding:"required"`
}

// CreateTask creates a task
func CreateTask(c *gin.Context) {
	var params CreateTaskParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	taskID, err := project.CreateTask(params.Task)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"task_id": taskID})
}

func GetAllTaskByProject(c *gin.Context) {
	projectID := c.Param("project_id")
	tasks, total, err := project.GetAllTaskByProject(projectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"tasks": tasks, "total": total})
}

// GetTaskByID returns a task
func GetTaskByID(c *gin.Context) {
	taskID := c.Param("task_id")
	task, err := project.GetTask(taskID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, task)
}

// UpdateTask updates a task
func UpdateTask(c *gin.Context) {
	var params CreateTaskParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.UpdateTask(params.Task)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

// DeleteTask deletes a task
func DeleteTask(c *gin.Context) {
	taskID := c.Param("task_id")
	err := project.DeleteTask(taskID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func UpdateTaskColumn(c *gin.Context) {
	var params pkg.UpdateTaskStatusParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.UpdateTaskCol(params.TaskID, params.Col, params.UpdatedBy)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateTaskColumnBulkParam struct {
	Tasks []pkg.UpdateTaskStatusParam `json:"tasks" binding:"required"`
}

func UpdateTaskColumnBulk(c *gin.Context) {
	var params UpdateTaskColumnBulkParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.UpdateTaskColumnBulk(params.Tasks)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type AddFeedbackParam struct {
	TaskID    string `json:"task_id" binding:"required"`
	Feedback  string `json:"feedback" binding:"required"`
	UpdatedBy string `json:"updated_by"`
}

func UpdateFeedback(c *gin.Context) {
	var params AddFeedbackParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.UpdateFeedback(params.TaskID, params.Feedback, params.UpdatedBy)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func AssignTask(c *gin.Context) {
	var params pkg.AssignTaskParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if params.Type == pkg.ApplicantTypeMember {
		err := project.AssignTaskToMember(params.TaskID, params.AsigneeMembers, params.UpdatedBy)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	if params.Type == pkg.ApplicantTypeClan {
		err := project.AssignTaskToClan(params.TaskID, params.AsigneeClans, params.UpdatedBy)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func AddAssigneeToTask(c *gin.Context){
	var params pkg.AssignTaskParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if params.Type == pkg.ApplicantTypeMember {
		err := project.AddAssigneeToTask(params.TaskID, params.AsigneeMembers, params.UpdatedBy)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type NotionAssignTaskParam struct {
	TaskID    string `json:"task_id" binding:"required"`
	Asignee   string `json:"assignee" binding:"required"`
	UpdatedBy string `json:"updated_by" binding:"required"`
}

func NotionAssignTask(c *gin.Context) {
	var params NotionAssignTaskParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.NotionAssignTaskToMember(params.TaskID, params.Asignee, params.UpdatedBy)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func UpdateTaskPosition(c *gin.Context) {
	var params pkg.UpdateTaskPositionParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.UpdateTaskPosition(params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateTaskVCClaimParam struct {
	TaskID   string `json:"task_id" binding:"required"`
	MemberID string `json:"member_id" binding:"required"`
}

func UpdateTaskVCClaim(c *gin.Context) {
	var params UpdateTaskVCClaimParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.UpdateTaskVCClaim(params.TaskID, params.MemberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateTaskPaymentCreatedParam struct {
	TaskID         string `json:"task_id" binding:"required"`
	PaymentCreated bool   `json:"payment_created" binding:"required"`
	UpdatedBy      string `json:"updated_by"`
}

func UpdateTaskPaymentCreated(c *gin.Context) {
	var params UpdateTaskPaymentCreatedParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.UpdateTaskPaymentCreated(params.TaskID, params.PaymentCreated, params.UpdatedBy)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdatetaskAssociatedJobParam struct {
	TaskID         	  string 				`json:"task_id" binding:"required"`
	AssociatedJobType pkg.AssociatedJobType `json:"associated_job_type"`
	AssociatedJobId   string                `json:"associated_job_id"`
}


func UpdatetaskAssociatedJob(c *gin.Context) {
	var params UpdatetaskAssociatedJobParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.UpdatetaskAssociatedJob(params.TaskID, params.AssociatedJobId, params.AssociatedJobType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateTaskPayoutParam struct {
	TaskID    string       `json:"task_id" binding:"required"`
	Payout    []pkg.Payout `json:"payout" binding:"required"`
	UpdatedBy string       `json:"updated_by"`
}

// REDUNDANT
// func UpdateTaskPayout(c *gin.Context) {
// 	var params UpdateTaskPayoutParam
// 	if err := c.ShouldBindJSON(&params); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	err := project.UpdateTaskPayout(params.TaskID, params.Payout, params.UpdatedBy)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"message": "success"})
// }

type ArchiveTaskParam struct {
	TaskID  string `json:"task_id" binding:"required"`
	Archive bool   `json:"archive"`
}

func ArchiveTask(c *gin.Context) {
	var params ArchiveTaskParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.ArchiveTask(params.TaskID, params.Archive)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GetArchiveTaskByProject(c *gin.Context) {
	projectID := c.Param("project_id")
	tasks, total, err := project.GetArchiveTaskByProject(projectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"tasks": tasks, "total": total})
}

func GetOpentasksForDao(c *gin.Context) {
	daoID := c.Param("dao_id")
	count, err := project.GetOpentasksForDao(daoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"open_task_count": count })
}

type CreateTaskFileParam struct {
	TaskFile pkg.TaskFile `json:"task_file"`
}

func CreateTaskFile(c *gin.Context) {
	var params CreateTaskFileParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	taskFileID, err := project.CreateTaskFile(params.TaskFile)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"task_file_id": taskFileID})
}

func GetTaskFiles(c *gin.Context) {
	taskID := c.Param("task_id")
	projectFiles, err := project.GetTaskFiles(taskID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, projectFiles)
}

func DeleteTaskFile(c *gin.Context) {
	taskFileID := c.Param("task_file_id")
	err := project.DeleteTaskFile(taskFileID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func PersonalTaskByMemberID(c *gin.Context) {
	memberID := c.Param("member_id")
	tasks, err := project.PersonalTaskByMemberID(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"tasks": tasks})
}

func AssignedTaskByMemberID(c *gin.Context) {
	memberID := c.Param("member_id")
	tasks, err := project.AssignedTaskByMemberID(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"tasks": tasks})
}

func AssignedTaskByLinkID(c *gin.Context) {
	linkID := c.Param("link_id")
	team, err := project.AssignedTaskByLinkID(linkID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, team)
}
