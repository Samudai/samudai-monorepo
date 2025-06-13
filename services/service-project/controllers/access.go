package controllers

import (
	"net/http"

	"github.com/Samudai/service-project/internal/project"
	pkg "github.com/Samudai/service-project/pkg/project"
	"github.com/gin-gonic/gin"
)

type CreateAccessParam struct {
	Access []pkg.Access `json:"access" binding:"required"`
}

func CreateAccess(c *gin.Context) {
	var param CreateAccessParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.CreateAccess(param.Access)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type GetProjectAccessByMemberIDParam struct {
	ProjectID string   `json:"project_id"`
	MemberID  string   `json:"member_id"`
	Roles     []string `json:"roles"`
}

func GetProjectAccessByMemberID(c *gin.Context) {
	var param GetProjectAccessByMemberIDParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	access, err := project.GetProjectAccessByMemberID(param.ProjectID, param.MemberID, param.Roles)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, access)
}

func GetAccessByProjectID(c *gin.Context) {
	projectID := c.Param("project_id")
	accesses, err := project.GetAccessByProjectID(projectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, accesses)
}

func UpdateAccess(c *gin.Context) {
	var param CreateAccessParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.UpdateAccess(param.Access)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type AddAccessIfNotExistsForMemberParam struct {
	ProjectID string   `json:"project_id"`
	MemberID  string   `json:"member_id"`
	Access    pkg.AccessType `json:"access"`
}

func AddAccessIfNotExistsForMember(c *gin.Context) {
	var param AddAccessIfNotExistsForMemberParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.AddAccessIfNotExistsForMember(param.ProjectID, param.MemberID, param.Access)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func DeleteAccess(c *gin.Context) {
	projectID := c.Param("project_id")
	err := project.DeleteAccess(projectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type AddAccessByInviteParam struct {
	InviteCode string `json:"invite_code"`
	MemeberID  string `json:"member_id"`
}

func AddAccessByInvite(c *gin.Context) {
	var params AddAccessByInviteParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	projectID, linkID, err := project.AddAccessByInvite(params.InviteCode, params.MemeberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"project_id": projectID, "link_id": linkID})
}
