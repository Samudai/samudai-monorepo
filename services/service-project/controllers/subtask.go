package controllers

import (
	"net/http"

	"github.com/Samudai/service-project/internal/project"
	pkg "github.com/Samudai/service-project/pkg/project"
	"github.com/gin-gonic/gin"
)

// CreateSubtaskParam is the param for CreateSubtask
type CreateSubtaskParam struct {
	Subtask pkg.Subtask `json:"subtask" binding:"required"`
}

// CreateSubtask creates a subtask
func CreateSubtask(c *gin.Context) {
	var params CreateSubtaskParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	subtaskID, err := project.Addsubtask(params.Subtask)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success", "subtask_id": subtaskID})
}

// GetAllSubtaskByTask returns all subtasks of a task
func GetAllSubtaskByProject(c *gin.Context) {
	ProjectID := c.Param("project_id")
	subtasks, total, err := project.GetAllSubtaskByProject(ProjectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"subtasks": subtasks, "total": total})
}

// GetSubtask returns a subtask
func GetSubtaskByID(c *gin.Context) {
	subtaskID := c.Param("subtask_id")
	subtask, err := project.GetSubtask(subtaskID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, subtask)
}

// UpdateSubtask updates a subtask
func UpdateSubtask(c *gin.Context) {
	var params CreateSubtaskParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.UpdateSubtask(params.Subtask)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func UpdateSubtaskColumn(c *gin.Context) {
	var params pkg.UpdateSubTaskStatusParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.UpdateSubtaskColumn(params.SubTaskID, params.Col, params.UpdatedBy)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateSubTaskColumnBulkParam struct {
	SubTasks []pkg.UpdateSubTaskStatusParam `json:"subtasks" binding:"required"`
}

func UpdateSubtaskColumnBulk(c *gin.Context) {
	var params UpdateSubTaskColumnBulkParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.UpdateSubTaskColumnBulk(params.SubTasks)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateSubTaskPayoutParam struct {
	SubTaskID string       `json:"subtask_id" binding:"required"`
	Payout    []pkg.Payout `json:"payout" binding:"required"`
	UpdatedBy string       `json:"updated_by"`
}

func UpdateSubTaskPayout(c *gin.Context) {
	var params UpdateSubTaskPayoutParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.UpdateSubTaskPayout(params.SubTaskID, params.Payout, params.UpdatedBy)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func UpdateSubtaskPosition(c *gin.Context) {
	var params pkg.UpdateSubTaskPositionParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.UpdateSubtaskPosition(params.SubtaskID, params.Position, params.UpdatedBy)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type AddAssigneeToSubTaskParam struct {
	SubTaskID 			string       `json:"subtask_id" binding:"required"`
	AssigneeMember      []string     `json:"assignee_member,omitempty"`
	UpdatedBy 			string       `json:"updated_by"`
}

func AddAssigneeToSubTask(c *gin.Context) {
	var params AddAssigneeToSubTaskParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.AddAssigneeToSubTask(params.SubTaskID, &params.AssigneeMember, params.UpdatedBy)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
}

// DeleteSubtask deletes a subtask
func DeleteSubtask(c *gin.Context) {
	subtaskID := c.Param("subtask_id")
	err := project.DeleteSubtask(subtaskID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateSubtaskStatusParam struct {
	SubtaskID string `json:"subtask_id" binding:"required"`
	Completed bool   `json:"completed"`
}

// UpdateSubtaskStatus updates a subtask state
func UpdateSubtaskStatus(c *gin.Context) {
	var params UpdateSubtaskStatusParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.UpdateSubtaskStatus(params.SubtaskID, params.Completed)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateSubtaskAssociatedJobParam struct {
	SubtaskID 		  string 			    `json:"subtask_id" binding:"required"`
	AssociatedJobType pkg.AssociatedJobType `json:"associated_job_type,omitempty"`
	AssociatedJobId   string                `json:"associated_job_id,omitempty"`
}

func UpdateSubtaskAssociatedJob(c *gin.Context) {
	var params UpdateSubtaskAssociatedJobParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.UpdateSubtaskAssociatedJob(params.SubtaskID, params.AssociatedJobId, params.AssociatedJobType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func ArchiveSubtask(c *gin.Context) {
	var params pkg.ArchiveSubTaskParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.ArchiveSubtask(params.SubtaskID, params.Archived, params.UpdatedBy)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GetAllArchivedSubtask(c *gin.Context) {
	ProjectID := c.Param("project_id")
	subtasks, total, err := project.GetAllArchivedSubtask(ProjectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"subtasks": subtasks, "total": total})
}
