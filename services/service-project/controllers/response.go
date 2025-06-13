package controllers

import (
	"net/http"

	"github.com/Samudai/service-project/internal/project"
	pkg "github.com/Samudai/service-project/pkg/project"
	"github.com/gin-gonic/gin"
)

// CreateResponseParam is the param for CreateResponse
type CreateResponseParam struct {
	Response pkg.FormResponse `json:"response" binding:"required"`
}

// CreateResponse creates a response
func CreateResponse(c *gin.Context) {
	var params CreateResponseParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	responseID, err := project.CreateResponse(params.Response)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"response_id": responseID})
}

func GetAllResponseByProject(c *gin.Context) {
	projectID := c.Param("project_id")
	responses, total, err := project.GetAllResponseByProject(projectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"responses": responses, "total": total})
}

// GetResponseByID returns a response
func GetResponseByID(c *gin.Context) {
	responseID := c.Param("response_id")
	response, err := project.GetResponse(responseID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, response)
}

func GetResponseByFormResponseID(c *gin.Context) {
	formResponseID := c.Param("form_response_id")
	response, err := project.GetResponseByFormResponseID(formResponseID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, response)
}

// DeleteResponse deletes a response
func DeleteResponse(c *gin.Context) {
	responseID := c.Param("response_id")
	err := project.DeleteResponse(responseID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func UpdateResponseColumn(c *gin.Context) {
	var params pkg.UpdateResponseStatusParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.UpdateResponseCol(params.ResponseID, params.Col, params.UpdatedBy)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateResponseColumnBulkParam struct {
	Responses []pkg.UpdateResponseStatusParam `json:"responses" binding:"required"`
}

func UpdateResponseColumnBulk(c *gin.Context) {
	var params UpdateResponseColumnBulkParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.UpdateResponseColumnBulk(params.Responses)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func AssignResponse(c *gin.Context) {
	var params pkg.AssignResponseParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if params.Type == pkg.ApplicantTypeMember && params.AsigneeMembers != nil && len(*params.AsigneeMembers) > 0 {
		err := project.AssignResponseToMember(params.ResponseID, *params.AsigneeMembers, params.UpdatedBy)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	if params.Type == pkg.ApplicantTypeClan && params.AsigneeClans != nil && len(*params.AsigneeClans) > 0 {
		err := project.AssignResponseToClan(params.ResponseID, *params.AsigneeClans, params.UpdatedBy)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func UpdateResponsePosition(c *gin.Context) {
	var params pkg.UpdateResponsePositionParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.UpdateResponsePosition(params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateDiscussionParam struct {
	ResponseID   string `json:"response_id" binding:"required"`
	DiscussionID string `json:"discussion_id" binding:"required"`
	Title        string `json:"title" binding:"required"`
}

func UpdateDiscussion(c *gin.Context) {
	var params UpdateDiscussionParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := project.UpdateDiscussion(params.ResponseID, params.DiscussionID, params.Title)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
