package controllers

import (
	"net/http"
	"strconv"

	"github.com/Samudai/service-dashboard/internal/dashboard"
	pkg "github.com/Samudai/service-dashboard/pkg/dashboard"
	"github.com/gin-gonic/gin"
)

type CreateDashboardWidgetParams struct {
	DashboardWidget pkg.DashboardWidget `json:"dashboard_widget"`
}

func CreateDashboardWidget(c *gin.Context) {
	var params CreateDashboardWidgetParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	dashboardWidgetID, err := dashboard.CreateDashboardWidget(params.DashboardWidget)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"dashboard_widget_id": dashboardWidgetID})
}

func ListDashboardWidget(c *gin.Context) {
	dashboardID := c.Param("dashboard_id")

	dashboardWidgets, err := dashboard.ListDashboardWidgetView(dashboardID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"dashboard_widgets": dashboardWidgets})
}

type UpdateDashboardWidgetParams struct {
	DashboardID      string                `json:"dashboard_id"`
	DashboardWidgets []pkg.DashboardWidget `json:"dashboard_widgets"`
}

func UpdateDashboardWidget(c *gin.Context) {
	var params UpdateDashboardWidgetParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := dashboard.UpdateDashboardWidget(params.DashboardID, params.DashboardWidgets)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateWidgetActiveParam struct {
	DashboardWidgetID int  `json:"dashboard_widget_id"`
	Active            bool `json:"active"`
}

func UpdateWidgetActive(c *gin.Context) {
	var params UpdateWidgetActiveParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := dashboard.UpdateWidgetActive(params.DashboardWidgetID, params.Active)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func DeleteDashboardWidget(c *gin.Context) {
	dashboardWidgetID := c.Param("dashboard_widget_id")
	id, err := strconv.Atoi(dashboardWidgetID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = dashboard.DeleteDashboardWidget(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
