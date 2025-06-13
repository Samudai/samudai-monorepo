package controllers

import (
	"net/http"

	"github.com/Samudai/service-forms/internal/deal"
	pkg "github.com/Samudai/service-forms/pkg/deal"
	"github.com/gin-gonic/gin"
)

type CreateQuestionsParam struct {
	Form pkg.Form `json:"form" binding:"required"`
}

func CreateQuestions(c *gin.Context) {
	var param CreateQuestionsParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	formID, err := deal.CreateQuestions(param.Form)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"form_id": formID})
}

func UpdateQuestions(c *gin.Context) {
	var param CreateQuestionsParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := deal.UpdateQuestions(param.Form); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GetQuestionsByFormID(c *gin.Context) {
	formID := c.Param("form_id")

	form, err := deal.GetQuestionsByFormID(formID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"form": form})
}

func GetQuestionsByDAO(c *gin.Context) {
	daoID := c.Param("dao_id")

	form, err := deal.GetQuestionsByDAO(daoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"form": form})
}

func GetQuestionsCountByDAO(c *gin.Context) {
	daoID := c.Param("dao_id")

	count, err := deal.GetQuestionsCountByDAO(daoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"count": count})
}


func DeleteQuestions(c *gin.Context) {
	formID := c.Param("form_id")

	if err := deal.DeleteQuestions(formID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GetSupportQuestions(c *gin.Context) {
	form, err := deal.GetSupportQuestions()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"form": form})
}
