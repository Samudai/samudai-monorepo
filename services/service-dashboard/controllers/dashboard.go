package controllers

import (
	"fmt"
	"net/http"

	"github.com/Samudai/service-dashboard/internal/dashboard"
	pkg "github.com/Samudai/service-dashboard/pkg/dashboard"
	"github.com/gin-gonic/gin"
)

type CreateDashboardParams struct {
	Dashboard pkg.Dashboard `json:"dashboard"`
}

type UpdateDashboardNameParams struct {
	DashboardID string `json:"dashboard_id"`
	Name string `json:"dashboard_name"`
}

func CreateDashboard(c *gin.Context) {
	var params CreateDashboardParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	dashboardID, err := dashboard.CreateDashboard(params.Dashboard)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"dashboard_id": dashboardID})
}

func ListDashboard(c *gin.Context) {
	daoID := c.Param("dao_id")

	dashboards, err := dashboard.ListDashboardView(daoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"dashboards": dashboards})
}

func UpdateDashboard(c *gin.Context) {
	var params CreateDashboardParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := dashboard.UpdateDashboard(params.Dashboard)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func UpdateDashboardName(c *gin.Context) {
	var params UpdateDashboardNameParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Println(params.DashboardID)
	err := dashboard.UpdateDashboardName(params.DashboardID, params.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}


func DeleteDashboard(c *gin.Context) {
	dashboardID := c.Param("dashboard_id")

	err := dashboard.DeleteDashboard(dashboardID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateWidgetVisibilityParams struct {
	DashboardWidgetID int  `json:"id"`
	Visibility        bool `json:"visibility"`
}

func UpdateDashboardVisibility(c *gin.Context) {
	var params UpdateWidgetVisibilityParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := dashboard.UpdateDashboardVisibility(params.DashboardWidgetID, params.Visibility)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
