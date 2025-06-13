package controllers

import (
	"net/http"

	"github.com/Samudai/service-dao/internal/dao"
	"github.com/gin-gonic/gin"
)

type CreateDepartmentsParams struct {
	DAOID       string   `json:"dao_id"`
	Departments []string `json:"departments"`
}

func CreateDepartments(c *gin.Context) {
	var params CreateDepartmentsParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := dao.CreateDAODepartments(params.DAOID, params.Departments)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type CreateDepartmentParams struct {
	DAOID      string `json:"dao_id"`
	Department string `json:"department"`
}

func CreateDepartment(c *gin.Context) {
	var params CreateDepartmentParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	departmentID, err := dao.CreateDAODepartment(params.DAOID, params.Department)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"department_id": departmentID})
}

func ListDepartmentsForDAO(c *gin.Context) {
	daoID := c.Param("dao_id")
	departments, err := dao.ListDepartmentsForDAO(daoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, departments)
}

func DeleteDepartment(c *gin.Context) {
	departmentID := c.Param("department_id")
	err := dao.DeleteDAODepartment(departmentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "department deleted"})
}
