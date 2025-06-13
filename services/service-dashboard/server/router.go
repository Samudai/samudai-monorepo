package server

import (
	"fmt"
	"time"

	"github.com/Samudai/service-dashboard/controllers"
	"github.com/Samudai/service-dashboard/middlewares"
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
	corsConfig.AllowMethods = []string{"GET", "POST"}
	corsConfig.AllowHeaders = []string{"*"}
	corsConfig.MaxAge = 1 * time.Minute
	router.Use(cors.New(corsConfig))

	router.Use(middlewares.SetHeadersMiddleware)

	health := new(controllers.HealthController)

	router.GET("/health", health.Status)

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

	return router

}
