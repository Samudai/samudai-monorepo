package dashboardsvc

import (
	"github.com/gin-gonic/gin"

	"github.com/Samudai/backend/services/dashboard/controllers"
)

func Register(router *gin.RouterGroup) {

	dashboard := router.Group("/dashboard")
	dashboard.POST("/create", controllers.CreateDashboard)
	dashboard.GET("/list/:dao_id", controllers.ListDashboard)
	dashboard.POST("/update", controllers.UpdateDashboard)
	dashboard.POST("/update/name", controllers.UpdateDashboardName)
	dashboard.POST("/update/visibility", controllers.UpdateDashboardVisibility)
	dashboard.DELETE("/delete/:dashboard_id", controllers.DeleteDashboard)

	dashboardwidget := router.Group("/dashboardwidget")
	dashboardwidget.POST("/create", controllers.CreateDashboardWidget)
	dashboardwidget.GET("/list/:dashboard_id", controllers.ListDashboardWidget)
	dashboardwidget.POST("/update", controllers.UpdateDashboardWidget)
	dashboardwidget.POST("/update/active", controllers.UpdateWidgetActive)
	dashboardwidget.DELETE("/delete/:dashboard_widget_id", controllers.DeleteDashboardWidget)

}
