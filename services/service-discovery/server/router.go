package server

import (
	"fmt"
	"time"

	"github.com/Samudai/service-discovery/controllers"
	"github.com/Samudai/service-discovery/middlewares"
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
	corsConfig.AllowHeaders = []string{"*"}
	corsConfig.MaxAge = 1 * time.Minute
	router.Use(cors.New(corsConfig))

	router.Use(middlewares.SetHeadersMiddleware)

	health := new(controllers.HealthController)
	router.GET("/health", health.Status)

	eventsDao := router.Group("/events/dao")
	eventsDao.POST("/create", controllers.CreateDAOEvent)

	eventsMember := router.Group("/events/member")
	eventsMember.POST("/create", controllers.CreateMemberEvent)

	discovery := router.Group("/discovery")
	discovery.POST("/dao", controllers.DiscoverDAO)
	discovery.POST("/member", controllers.DiscoverMember)

	return router
}
